"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, CreditCard, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OfertaCredito {
  offer_id: string;
  entidad: string;
  tasa: number;
  plazo_dias: number;
  cuota_estimada: number;
  repago_post_cosecha: boolean;
}

interface FinancieroOutput {
  ofertasDisponibles: OfertaCredito[];
  recomendacion: string;
  terraScoreRequerido: number;
}

interface FinancieroWidgetProps {
  productId?: string;
  precioProducto?: number;
}

export function FinancieroWidget({ productId, precioProducto }: FinancieroWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [monto, setMonto] = useState<string>(
    precioProducto ? String(precioProducto) : ""
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinancieroOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConsultar() {
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ia/financiero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          montoAFinanciar: montoNum,
          productId: productId ?? undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as FinancieroOutput;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar opciones.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1a3a6a]/40 hover:bg-[#eff6ff] dark:hover:bg-[#1a3a6a]/60 transition-colors"
      >
        <CreditCard className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5] shrink-0" />
        <span className="flex-1 text-left text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Financiar esta compra
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[#94a3b8]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-4 bg-white dark:bg-[#0d2240]/50 border-t border-[#dbeafe] dark:border-[rgba(96,165,245,0.1)]">
          {/* Amount input */}
          <div className="space-y-1.5">
            <Label className="text-xs text-[#475569] dark:text-[#94a3b8]">
              Monto a financiar (USD)
            </Label>
            <Input
              type="number"
              min={1}
              step={0.01}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              className="bg-white dark:bg-[#1a3a6a] border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] text-sm"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <Button
            onClick={() => void handleConsultar()}
            disabled={loading || !monto}
            className="w-full bg-[#1e4d8c] hover:bg-[#1a3a6a] text-white"
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                Consultando…
              </>
            ) : (
              "Consultar opciones"
            )}
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-3">
              {result.recomendacion && (
                <p className="text-xs text-[#475569] dark:text-[#94a3b8] italic">
                  {result.recomendacion}
                </p>
              )}

              {result.ofertasDisponibles.length === 0 ? (
                <p className="text-sm text-[#94a3b8] text-center py-4">
                  No hay opciones de financiamiento disponibles en este momento.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.ofertasDisponibles.map((oferta) => (
                    <div
                      key={oferta.offer_id}
                      className="rounded-lg border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] p-3 space-y-2 bg-[#f8fafc] dark:bg-[#1a3a6a]/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff]">
                          {oferta.entidad}
                        </span>
                        {oferta.repago_post_cosecha && (
                          <Badge className={cn(
                            "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border-0",
                            "bg-[#fef3c7] dark:bg-[#78350f]/40 text-[#92400e] dark:text-[#f59e0b]"
                          )}>
                            <Leaf className="h-2.5 w-2.5" />
                            Repago post-cosecha
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-[#94a3b8]">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide">Tasa</p>
                          <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                            {oferta.tasa}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide">Plazo</p>
                          <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                            {oferta.plazo_dias}d
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide">Cuota est.</p>
                          <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                            ${oferta.cuota_estimada.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs border-[#1e4d8c] text-[#1e4d8c] dark:border-[#60a5f5] dark:text-[#60a5f5] hover:bg-[#eff6ff] dark:hover:bg-[#1a3a6a]"
                      >
                        Aplicar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
