"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: boolean;
  orderId?: string;
};

export async function createOrderAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // ── 1. Get user's cart + items ────────────────────────────────
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select(
      "id, cart_items(id, product_id, variant_id, cantidad, precio_unitario, product:products(store_id, moneda))"
    )
    .eq("user_id", user.id)
    .single();

  if (cartError || !cart) {
    return { error: "No se pudo obtener el carrito" };
  }

  type ProductRef = { store_id: string; moneda: "USD" | "VES" } | null;
  type RawCartItem = {
    id: string;
    product_id: string;
    variant_id: string | null;
    cantidad: number;
    precio_unitario: number;
    product: ProductRef;
  };

  const rawItems = (cart.cart_items ?? []) as RawCartItem[];

  if (rawItems.length === 0) {
    return { error: "El carrito está vacío" };
  }

  // ── 2. Derive store and vendedor from first item ───────────────
  const storeId = rawItems[0]?.product?.store_id;
  if (!storeId) return { error: "No se pudo identificar la tienda" };

  const { data: store } = await supabase
    .from("stores")
    .select("id, created_by")
    .eq("id", storeId)
    .single();

  if (!store) return { error: "Tienda no encontrada" };

  const moneda: "USD" | "VES" = rawItems[0]?.product?.moneda ?? "USD";

  // ── 3. Build address ──────────────────────────────────────────
  const nombreCompleto = String(formData.get("nombre_completo") ?? "");
  const telefono = String(formData.get("telefono") ?? "");
  const estado = String(formData.get("estado") ?? "");
  const municipio = String(formData.get("municipio") ?? "");
  const direccion = String(formData.get("direccion") ?? "");
  const referencias = String(formData.get("referencias") ?? "");

  const direccionEntrega = [
    nombreCompleto,
    telefono,
    direccion,
    municipio,
    estado,
    referencias,
  ]
    .filter(Boolean)
    .join(" | ");

  // ── 4. Calculate total ────────────────────────────────────────
  const total = rawItems.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  // ── 5. Create order ───────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      comprador_id: user.id,
      vendedor_id: store.created_by,
      store_id: storeId,
      status: "creado",
      total,
      moneda,
      direccion_entrega: direccionEntrega,
      notas: formData.get("notas") ? String(formData.get("notas")) : null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "No se pudo crear la orden" };
  }

  // ── 6. Create order_items ─────────────────────────────────────
  const orderItems = rawItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id ?? null,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: "No se pudo guardar los items de la orden" };
  }

  // ── 7. Create escrow_account ──────────────────────────────────
  const { data: escrow, error: escrowError } = await supabase
    .from("escrow_accounts")
    .insert({
      order_id: order.id,
      monto: total,
      moneda,
      status: "pendiente",
    })
    .select("id")
    .single();

  if (escrowError || !escrow) {
    return { error: "No se pudo crear la cuenta escrow" };
  }

  // ── 8. Create initial escrow_event ───────────────────────────
  await supabase.from("escrow_events").insert({
    escrow_id: escrow.id,
    tipo: "orden_creada",
    monto: total,
    actor_id: user.id,
    descripcion: "Orden creada. Esperando confirmación de pago.",
  });

  // ── 9. Clear cart ─────────────────────────────────────────────
  await supabase.from("cart_items").delete().eq("cart_id", cart.id as string);

  return { success: true, orderId: order.id };
}
