"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  success: boolean;
  error?: string;
}

export async function resolveDisputeAction(
  disputeId: string,
  resolution: "reembolsar" | "liberar",
  notas: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (profile?.rol !== "admin") {
    return { success: false, error: "Acceso denegado: se requiere rol de administrador" };
  }

  // Fetch dispute with order
  const { data: dispute } = await supabase
    .from("disputes")
    .select("*, order:orders(id, store_id)")
    .eq("id", disputeId)
    .single();

  if (!dispute) return { success: false, error: "Disputa no encontrada" };
  if (dispute.resuelto_at) return { success: false, error: "Disputa ya resuelta" };

  const orderId = dispute.order?.id ?? (dispute as { order_id: string }).order_id;

  const newOrderStatus = resolution === "reembolsar" ? "reembolsado" : "liberado";
  const newEscrowStatus = resolution === "reembolsar" ? "reembolsado" : "liberado";

  // Update dispute
  const { error: disputeError } = await supabase
    .from("disputes")
    .update({
      resolucion: `${resolution === "reembolsar" ? "Reembolso al comprador" : "Liberación al vendedor"}: ${notas}`,
      resuelto_por: user.id,
      resuelto_at: new Date().toISOString(),
    })
    .eq("id", disputeId);

  if (disputeError) {
    return { success: false, error: "Error al actualizar la disputa" };
  }

  // Update order status
  await supabase
    .from("orders")
    .update({ status: newOrderStatus })
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
      .update({
        status: newEscrowStatus,
        ...(resolution === "liberar" ? { liberado_at: new Date().toISOString() } : {}),
        notas,
      })
      .eq("id", escrow.id);

    // Add escrow event
    await supabase.from("escrow_events").insert({
      escrow_id: escrow.id,
      tipo: resolution === "reembolsar" ? "reembolso_disputa" : "liberacion_disputa",
      actor_id: user.id,
      descripcion: notas,
    });
  }

  // Add audit log entry
  await supabase.from("audit_log").insert({
    actor_id: user.id,
    accion: `resolve_dispute_${resolution}`,
    tabla: "disputes",
    registro_id: disputeId,
    datos_nuevos: {
      resolution,
      notas,
      order_id: orderId,
      resolved_at: new Date().toISOString(),
    },
  });

  return { success: true };
}
