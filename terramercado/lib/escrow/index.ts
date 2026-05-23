/**
 * TerraMercado — Escrow utility functions
 * Pure logic only — no DB calls.
 */

export type EscrowMilestone =
  | "pago_confirmado"
  | "despacho_confirmado"
  | "entrega_confirmada";

export interface EscrowTransition {
  from: string;
  to: string;
  milestone: EscrowMilestone;
  actor: "comprador" | "vendedor" | "admin";
}

export const ESCROW_TRANSITIONS: EscrowTransition[] = [
  {
    from: "pendiente",
    to: "fondos_recibidos",
    milestone: "pago_confirmado",
    actor: "comprador",
  },
  {
    from: "fondos_recibidos",
    to: "fondos_recibidos",
    milestone: "despacho_confirmado",
    actor: "vendedor",
  },
  {
    from: "fondos_recibidos",
    to: "liberado",
    milestone: "entrega_confirmada",
    actor: "comprador",
  },
];

export function canTransition(
  currentStatus: string,
  milestone: EscrowMilestone,
  actorRole: string
): boolean {
  return ESCROW_TRANSITIONS.some(
    (t) =>
      t.from === currentStatus &&
      t.milestone === milestone &&
      t.actor === actorRole
  );
}

export function getEscrowStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: "Pendiente de pago",
    fondos_recibidos: "Fondos en escrow",
    liberacion_parcial: "Liberación parcial",
    liberado: "Fondos liberados",
    en_disputa: "En disputa",
    reembolsado: "Reembolsado",
  };
  return labels[status] ?? status;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    creado: "Creado",
    pagado_en_escrow: "Pago en escrow",
    en_preparacion: "En preparación",
    en_transito: "En tránsito",
    entregado: "Entregado",
    liberado: "Completado",
    en_disputa: "En disputa",
    reembolsado: "Reembolsado",
  };
  return labels[status] ?? status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    creado:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    pagado_en_escrow:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    en_preparacion:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    en_transito:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    entregado:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
    liberado:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    en_disputa:
      "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    reembolsado:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  };
  return (
    colors[status] ??
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  );
}
