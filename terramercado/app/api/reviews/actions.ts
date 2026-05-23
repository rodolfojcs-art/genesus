"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  success: boolean;
  error?: string;
};

interface ReviewContext {
  productId: string;
  orderId: string;
  rating: number;
}

export async function submitReviewAction(
  context: ReviewContext,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para dejar una reseña." };
  }

  const { productId, orderId, rating } = context;

  // Validate rating
  const ratingNum = Number(rating);
  if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
    return { success: false, error: "La calificación debe ser entre 1 y 5 estrellas." };
  }

  const titulo = (formData.get("titulo") as string | null)?.trim() ?? null;
  const contenido = (formData.get("contenido") as string | null)?.trim() ?? null;

  if (contenido && contenido.length > 2000) {
    return { success: false, error: "La reseña no puede superar 2000 caracteres." };
  }

  // Verify the user actually bought this product
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .eq("comprador_id", user.id)
    .in("status", ["liberado", "entregado"])
    .single();

  if (!order) {
    return {
      success: false,
      error: "Solo puedes dejar una reseña después de recibir tu pedido.",
    };
  }

  // Check if the user already reviewed this product for this order
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("order_id", orderId)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "Ya dejaste una reseña para este pedido." };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    order_id: orderId,
    reviewer_id: user.id,
    rating: ratingNum,
    titulo: titulo || null,
    contenido: contenido || null,
    compra_verificada: true,
    fotos: [],
  });

  if (error) {
    return { success: false, error: "Error al guardar tu reseña. Intenta de nuevo." };
  }

  return { success: true };
}
