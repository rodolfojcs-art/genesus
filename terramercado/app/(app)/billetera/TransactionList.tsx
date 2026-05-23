"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/catalog";

interface WalletTransaction {
  id: string;
  created_at: string;
  wallet_id: string;
  tipo: string;
  monto: number;
  moneda: "USD" | "VES";
  referencia?: string | null;
  descripcion?: string | null;
}

interface TransactionListProps {
  transactions: WalletTransaction[];
}

const TIPO_LABELS: Record<string, string> = {
  deposito: "Depósito",
  retiro: "Retiro",
  pago_escrow: "Pago Escrow",
  liberacion: "Liberación",
  reembolso: "Reembolso",
  credito_aprobado: "Crédito",
  comision: "Comisión",
};

const TIPO_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  deposito: "default",
  credito_aprobado: "default",
  liberacion: "default",
  retiro: "destructive",
  pago_escrow: "secondary",
  reembolso: "outline",
  comision: "secondary",
};

function isPositive(tipo: string): boolean {
  return ["deposito", "liberacion", "reembolso", "credito_aprobado"].includes(tipo);
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e4d8c]/30 bg-[#eff6ff]/50 dark:border-white/10 dark:bg-white/5 py-12 text-center">
        <p className="text-sm text-muted-foreground">Sin movimientos aún</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {transactions.map((tx) => {
        const positive = isPositive(tx.tipo);
        const label = TIPO_LABELS[tx.tipo] ?? tx.tipo;
        const variant = TIPO_VARIANT[tx.tipo] ?? "outline";
        const date = new Date(tx.created_at).toLocaleDateString("es-VE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={variant}>{label}</Badge>
                {tx.referencia && (
                  <span className="text-xs text-muted-foreground truncate">
                    Ref: {tx.referencia}
                  </span>
                )}
              </div>
              {tx.descripcion && (
                <p className="text-xs text-muted-foreground truncate">{tx.descripcion}</p>
              )}
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
            <div
              className={`font-mono text-sm font-semibold tabular-nums shrink-0 ${
                positive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {positive ? "+" : "-"}
              {formatPrice(Math.abs(tx.monto), tx.moneda)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
