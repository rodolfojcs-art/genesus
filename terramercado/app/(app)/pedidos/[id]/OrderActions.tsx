"use client";

import { useState, useTransition } from "react";
import { PackageCheck, Truck, AlertTriangle, Loader2 } from "lucide-react";
import {
  confirmDeliveryAction,
  markDispatchedAction,
  openDisputeAction,
} from "./actions";
import type { OrderStatus } from "@/types";

interface OrderActionsProps {
  orderId: string;
  orderStatus: OrderStatus;
  escrowStatus: string;
  userRole: "comprador" | "vendedor" | "other";
}

export function OrderActions({
  orderId,
  orderStatus,
  escrowStatus,
  userRole,
}: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Dispute modal state
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeMotivo, setDisputeMotivo] = useState("");
  const [disputeDesc, setDisputeDesc] = useState("");

  function handleAction(fn: () => Promise<{ error?: string; success?: boolean }>) {
    setFeedback(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({ type: "success", message: "Acción completada con éxito." });
      }
    });
  }

  function handleConfirmDelivery() {
    handleAction(() => confirmDeliveryAction(orderId));
  }

  function handleMarkDispatched() {
    handleAction(() => markDispatchedAction(orderId));
  }

  function handleOpenDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!disputeMotivo) return;
    setShowDisputeForm(false);
    handleAction(() => openDisputeAction(orderId, disputeMotivo, disputeDesc));
  }

  const canConfirmDelivery =
    userRole === "comprador" &&
    (orderStatus === "entregado" || orderStatus === "en_transito");

  const canDispatch =
    userRole === "vendedor" &&
    (orderStatus === "pagado_en_escrow" || orderStatus === "en_preparacion");

  const canDispute =
    userRole === "comprador" &&
    (orderStatus === "entregado" || orderStatus === "en_transito");

  // Nothing to show
  if (!canConfirmDelivery && !canDispatch && !canDispute) return null;

  void escrowStatus; // consumed in parent, passed here for potential future use

  return (
    <div className="space-y-3">
      {/* Confirm delivery */}
      {canConfirmDelivery && (
        <button
          onClick={handleConfirmDelivery}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PackageCheck className="h-4 w-4" />
          )}
          Confirmar entrega
        </button>
      )}

      {/* Mark dispatched */}
      {canDispatch && (
        <button
          onClick={handleMarkDispatched}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#1e4d8c] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240] disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
          Marcar como despachado
        </button>
      )}

      {/* Open dispute */}
      {canDispute && !showDisputeForm && (
        <button
          onClick={() => setShowDisputeForm(true)}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-red-300 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <AlertTriangle className="h-4 w-4" />
          Abrir disputa
        </button>
      )}

      {/* Dispute form */}
      {showDisputeForm && (
        <form
          onSubmit={handleOpenDispute}
          className="space-y-3 rounded-[8px] border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-900/10"
        >
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Abrir disputa
          </p>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#64748b] dark:text-[#94a3b8]">
              Motivo *
            </label>
            <input
              required
              value={disputeMotivo}
              onChange={(e) => setDisputeMotivo(e.target.value)}
              placeholder="Ej. Producto no llegó, Producto dañado…"
              className="h-9 w-full rounded-[8px] border border-red-200 bg-white px-3 text-sm text-[#1e293b] outline-none focus:border-red-400 dark:border-red-900/50 dark:bg-[#0d2240] dark:text-[#eff6ff]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#64748b] dark:text-[#94a3b8]">
              Descripción
            </label>
            <textarea
              value={disputeDesc}
              onChange={(e) => setDisputeDesc(e.target.value)}
              rows={3}
              placeholder="Describe el problema en detalle…"
              className="w-full rounded-[8px] border border-red-200 bg-white px-3 py-2 text-sm text-[#1e293b] outline-none focus:border-red-400 dark:border-red-900/50 dark:bg-[#0d2240] dark:text-[#eff6ff]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowDisputeForm(false)}
              className="flex-1 rounded-[8px] border border-[#dbeafe] py-2 text-sm font-medium text-[#475569] hover:bg-[#dbeafe] dark:border-[#1e4d8c] dark:text-[#94a3b8] dark:hover:bg-[#1a3a6a]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-[8px] bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              Enviar disputa
            </button>
          </div>
        </form>
      )}

      {/* Feedback */}
      {feedback && (
        <p
          className={`rounded-[8px] px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
