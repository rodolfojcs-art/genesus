"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/catalog";

type ActionResult = { error?: string; success?: string };

// ── Schemas ────────────────────────────────────────────────────────────────

const StoreSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  ubicacion: z.string().optional(),
});

const ProductSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  descripcion: z.string().optional(),
  precio_base: z.coerce.number().positive("El precio debe ser positivo"),
  moneda: z.enum(["USD", "VES"]),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  unidad: z.string().min(1, "La unidad es requerida"),
  category_id: z.string().uuid("Selecciona una categoría válida"),
  principio_activo: z.string().optional(),
  dosis_recomendada: z.string().optional(),
  periodo_carencia: z.string().optional(),
  contraindicaciones: z.string().optional(),
  certificaciones: z.string().optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autenticado");
  return { supabase, user };
}

async function getUserStore(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: store, error } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", userId)
    .single();
  if (error || !store) throw new Error("No tienes una tienda activa");
  return store;
}

// ── Actions ────────────────────────────────────────────────────────────────

export async function createStoreAction(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const raw = {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion") || undefined,
      ubicacion: formData.get("ubicacion") || undefined,
    };

    const parsed = StoreSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const slug = generateSlug(parsed.data.nombre);

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const { error } = await supabase.from("stores").insert({
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion,
      ubicacion: parsed.data.ubicacion,
      slug: finalSlug,
      owner_id: user.id,
      terra_score: 0,
      verificada: false,
    });

    if (error) return { error: "No se pudo crear la tienda: " + error.message };

    revalidatePath("/tienda-mia");
    return { success: "Tienda creada exitosamente" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error inesperado" };
  }
}

export async function createProductAction(
  _prevState: { error?: string; success?: string } | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const store = await getUserStore(supabase, user.id);

    const raw = {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion") || undefined,
      precio_base: formData.get("precio_base"),
      moneda: formData.get("moneda"),
      stock: formData.get("stock"),
      unidad: formData.get("unidad"),
      category_id: formData.get("category_id"),
      principio_activo: formData.get("principio_activo") || undefined,
      dosis_recomendada: formData.get("dosis_recomendada") || undefined,
      periodo_carencia: formData.get("periodo_carencia") || undefined,
      contraindicaciones: formData.get("contraindicaciones") || undefined,
      certificaciones: formData.get("certificaciones") || undefined,
    };

    const parsed = ProductSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const cultivoObjetivo = formData.getAll("cultivo_objetivo") as string[];
    const ciclo = formData.getAll("ciclo") as string[];
    const certificaciones = parsed.data.certificaciones
      ? parsed.data.certificaciones.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const slug = generateSlug(parsed.data.nombre);

    const { error } = await supabase.from("products").insert({
      store_id: store.id,
      nombre: parsed.data.nombre,
      slug,
      descripcion: parsed.data.descripcion ?? "",
      precio_base: parsed.data.precio_base,
      moneda: parsed.data.moneda,
      stock: parsed.data.stock,
      unidad: parsed.data.unidad,
      category_id: parsed.data.category_id,
      principio_activo: parsed.data.principio_activo,
      dosis_recomendada: parsed.data.dosis_recomendada,
      periodo_carencia: parsed.data.periodo_carencia,
      contraindicaciones: parsed.data.contraindicaciones,
      cultivo_objetivo: cultivoObjetivo.length > 0 ? cultivoObjetivo : null,
      ciclo: ciclo.length > 0 ? ciclo : null,
      certificaciones: certificaciones.length > 0 ? certificaciones : null,
      activo: true,
    });

    if (error) return { error: "No se pudo crear el producto: " + error.message };

    revalidatePath("/tienda-mia/productos");
    return { success: "Producto publicado exitosamente" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error inesperado" };
  }
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const store = await getUserStore(supabase, user.id);

    // Verify ownership
    const { data: product } = await supabase
      .from("products")
      .select("id, store_id")
      .eq("id", id)
      .eq("store_id", store.id)
      .single();

    if (!product) return { error: "Producto no encontrado o no autorizado" };

    const raw = {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion") || undefined,
      precio_base: formData.get("precio_base"),
      moneda: formData.get("moneda"),
      stock: formData.get("stock"),
      unidad: formData.get("unidad"),
      category_id: formData.get("category_id"),
      principio_activo: formData.get("principio_activo") || undefined,
      dosis_recomendada: formData.get("dosis_recomendada") || undefined,
      periodo_carencia: formData.get("periodo_carencia") || undefined,
      contraindicaciones: formData.get("contraindicaciones") || undefined,
      certificaciones: formData.get("certificaciones") || undefined,
    };

    const parsed = ProductSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    }

    const cultivoObjetivo = formData.getAll("cultivo_objetivo") as string[];
    const ciclo = formData.getAll("ciclo") as string[];
    const certificaciones = parsed.data.certificaciones
      ? parsed.data.certificaciones.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const { error } = await supabase
      .from("products")
      .update({
        nombre: parsed.data.nombre,
        descripcion: parsed.data.descripcion ?? "",
        precio_base: parsed.data.precio_base,
        moneda: parsed.data.moneda,
        stock: parsed.data.stock,
        unidad: parsed.data.unidad,
        category_id: parsed.data.category_id,
        principio_activo: parsed.data.principio_activo,
        dosis_recomendada: parsed.data.dosis_recomendada,
        periodo_carencia: parsed.data.periodo_carencia,
        contraindicaciones: parsed.data.contraindicaciones,
        cultivo_objetivo: cultivoObjetivo.length > 0 ? cultivoObjetivo : null,
        ciclo: ciclo.length > 0 ? ciclo : null,
        certificaciones: certificaciones.length > 0 ? certificaciones : null,
      })
      .eq("id", id);

    if (error) return { error: "No se pudo actualizar el producto: " + error.message };

    revalidatePath("/tienda-mia/productos");
    return { success: "Producto actualizado" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error inesperado" };
  }
}

export async function toggleProductActiveAction(
  id: string,
  activo: boolean
): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const store = await getUserStore(supabase, user.id);

    const { error } = await supabase
      .from("products")
      .update({ activo })
      .eq("id", id)
      .eq("store_id", store.id);

    if (error) return { error: "No se pudo actualizar: " + error.message };

    revalidatePath("/tienda-mia/productos");
    return { success: "Estado actualizado" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error inesperado" };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    const store = await getUserStore(supabase, user.id);

    // Check there are no orders for this product
    const { count } = await supabase
      .from("order_items")
      .select("*", { count: "exact", head: true })
      .eq("product_id", id);

    if ((count ?? 0) > 0) {
      return {
        error:
          "No se puede eliminar: el producto tiene pedidos asociados. Desactívalo en su lugar.",
      };
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("store_id", store.id);

    if (error) return { error: "No se pudo eliminar: " + error.message };

    revalidatePath("/tienda-mia/productos");
    return { success: "Producto eliminado" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error inesperado" };
  }
}
