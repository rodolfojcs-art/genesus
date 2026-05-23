"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  success: boolean;
  error?: string;
  message?: {
    id: string;
    contenido: string;
    sender_id: string;
    receiver_id: string;
    created_at: string;
    leido: boolean;
    product_id: string | null;
  };
};

export async function sendMessageAction(
  receiverId: string,
  contenido: string,
  productId?: string
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autorizado." };
  }

  const trimmed = contenido.trim();
  if (!trimmed) {
    return { success: false, error: "El mensaje no puede estar vacío." };
  }
  if (trimmed.length > 2000) {
    return { success: false, error: "El mensaje no puede superar 2000 caracteres." };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      contenido: trimmed,
      product_id: productId ?? null,
      leido: false,
    })
    .select("id, contenido, sender_id, receiver_id, created_at, leido, product_id")
    .single();

  if (error) {
    return { success: false, error: "Error al enviar el mensaje. Intenta de nuevo." };
  }

  return { success: true, message: data };
}
