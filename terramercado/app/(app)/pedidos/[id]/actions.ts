"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: boolean;
};

/** Buyer confirms delivery — liberates escrow funds */
export async function confirmDeliveryAction(
  orderId: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verify buyer
  const { data: order } = await supabase
    .from("orders")
    .select("id, comprador_id, status")
    .eq("id", orderId)
    .single();

  if (!order || order.comprador_id !== user.id) {
    return { error: "Pedido no encontrado" };
  }

  // Update order status
  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "liberado" })
    .eq("id", orderId);

  if (orderError) return { error: "No se pudo actualizar el pedido" };

  // Update escrow status
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("id")
    .eq("order_id", orderId)
    .single();

  if (escrow) {
    await supabase
      .from("escrow_accounts")
      .update({ status: "liberado", liberado_at: new Date().toISOString() })
      .eq("id", escrow.id);

    // Log escrow event
    await supabase.from("escrow_events").insert({
      escrow_id: escrow.id,
      tipo: "entrega_confirmada",
      actor_id: user.id,
      descripcion: "El comprador confirmó la recepción. Fondos liberados al vendedor.",
    });
  }

  revalidatePath(`/pedidos/${orderId}`);
  return { success: true };
}

/** Vendor marks order as dispatched (en_transito) */
export async function markDispatchedAction(
  orderId: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verify vendor
  const { data: order } = await supabase
    .from("orders")
    .select("id, vendedor_id, status")
    .eq("id", orderId)
    .single();

  if (!order || order.vendedor_id !== user.id) {
    return { error: "Pedido no encontrado" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "en_transito" })
    .eq("id", orderId);

  if (error) return { error: "No se pudo actualizar el estado" };

  // Log escrow event
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("id")
    .eq("order_id", orderId)
    .single();

  if (escrow) {
    await supabase.from("escrow_events").insert({
      escrow_id: escrow.id,
      tipo: "despacho_confirmado",
      actor_id: user.id,
      descripcion: "Vendedor marcó el pedido como despachado.",
    });
  }

  revalidatePath(`/pedidos/${orderId}`);
  return { success: true };
}

/** Buyer opens a dispute */
export async function openDisputeAction(
  orderId: string,
  motivo: string,
  descripcion: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verify buyer
  const { data: order } = await supabase
    .from("orders")
    .select("id, comprador_id, status")
    .eq("id", orderId)
    .single();

  if (!order || order.comprador_id !== user.id) {
    return { error: "Pedido no encontrado" };
  }

  // Create dispute record
  const { error: disputeError } = await supabase.from("disputes").insert({
    order_id: orderId,
    iniciado_por: user.id,
    motivo,
    descripcion,
  });

  if (disputeError) return { error: "No se pudo abrir la disputa" };

  // Update order status
  await supabase
    .from("orders")
    .update({ status: "en_disputa" })
    .eq("id", orderId);

  // Update escrow status
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("id")
    .eq("order_id", orderId)
    .single();

  if (escrow) {
    await supabase
      .from("escrow_accounts")
      .update({ status: "en_disputa" })
      .eq("id", escrow.id);

    await supabase.from("escrow_events").insert({
      escrow_id: escrow.id,
      tipo: "disputa_abierta",
      actor_id: user.id,
      descripcion: `Disputa abierta: ${motivo}`,
    });
  }

  revalidatePath(`/pedidos/${orderId}`);
  return { success: true };
}
