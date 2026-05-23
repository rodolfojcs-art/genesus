"use client";

import {
  ShieldCheck,
  Truck,
  PackageCheck,
  AlertTriangle,
  RefreshCcw,
  Plus,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EscrowEvent {
  id: string;
  created_at: string;
  tipo: string;
  monto?: number | null;
  descripcion?: string | null;
}

interface EscrowTimelineProps {
  events: EscrowEvent[];
}

function eventIcon(tipo: string) {
  switch (tipo) {
    case "orden_creada":
      return <Plus className="h-4 w-4" />;
    case "pago_confirmado":
    case "fondos_recibidos":
      return <ShieldCheck className="h-4 w-4" />;
    case "despacho_confirmado":
      return <Truck className="h-4 w-4" />;
    case "entrega_confirmada":
      return <PackageCheck className="h-4 w-4" />;
    case "disputa_abierta":
      return <AlertTriangle className="h-4 w-4" />;
    case "reembolso":
      return <RefreshCcw className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function eventColor(tipo: string): string {
  switch (tipo) {
    case "disputa_abierta":
      return "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
    case "entrega_confirmada":
      return "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";
    case "despacho_confirmado":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400";
    case "pago_confirmado":
    case "fondos_recibidos":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
    default:
      return "bg-[#dbeafe] text-[#1e4d8c] dark:bg-[#1a3a6a] dark:text-[#60a5f5]";
  }
}

function eventLabel(tipo: string): string {
  const labels: Record<string, string> = {
    orden_creada: "Orden creada",
    pago_confirmado: "Pago confirmado",
    fondos_recibidos: "Fondos en escrow",
    despacho_confirmado: "Pedido despachado",
    entrega_confirmada: "Entrega confirmada",
    disputa_abierta: "Disputa abierta",
    reembolso: "Reembolso procesado",
  };
  return labels[tipo] ?? tipo;
}

export function EscrowTimeline({ events }: EscrowTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
        Sin eventos registrados.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 pl-6">
      {events.map((event, idx) => (
        <li key={event.id} className="relative">
          {/* Vertical line */}
          {idx < events.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[-1.25rem] top-8 h-full w-px bg-[#dbeafe] dark:bg-[#1e4d8c]"
            />
          )}

          {/* Icon */}
          <span
            className={`absolute left-[-1.75rem] flex h-7 w-7 items-center justify-center rounded-full ${eventColor(event.tipo)}`}
          >
            {eventIcon(event.tipo)}
          </span>

          {/* Content */}
          <div className="rounded-[8px] bg-white p-3 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
            <p className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff]">
              {eventLabel(event.tipo)}
            </p>
            {event.descripcion && (
              <p className="mt-0.5 text-xs text-[#475569] dark:text-[#94a3b8]">
                {event.descripcion}
              </p>
            )}
            <p className="mt-1 text-xs text-[#94a3b8]">
              {format(new Date(event.created_at), "d MMM yyyy 'a las' HH:mm", {
                locale: es,
              })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
