"use client";

import { useActionState, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils/catalog";
import { createFinancingAgreementAction, type ActionState } from "./actions";

interface FinancingOffer {
  id: string;
  created_at: string;
  financiera_id: string;
  nombre: string;
  descripcion?: string | null;
  tasa_interes: number;
  plazo_dias: number;
  monto_min: number;
  monto_max: number;
  terra_score_min: number;
  activa: boolean;
  financiera?: { nombre: string } | null;
}

interface FinancingOfferCardProps {
  offer: FinancingOffer;
}

const initialState: ActionState = { success: false };

export function FinancingOfferCard({ offer }: FinancingOfferCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createFinancingAgreementAction,
    initialState
  );

  const entidad =
    typeof offer.financiera === "object" && offer.financiera !== null
      ? offer.financiera.nombre
      : offer.nombre;

  if (state.success) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
          <span className="text-2xl">✓</span>
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Solicitud enviada exitosamente
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Tu solicitud de crédito está siendo procesada. Te notificaremos pronto.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{offer.nombre}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {offer.tasa_interes}% anual
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{entidad}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/50 dark:bg-white/5 p-2">
            <p className="text-xs text-muted-foreground">Plazo</p>
            <p className="font-medium">{offer.plazo_dias} días</p>
          </div>
          <div className="rounded-lg bg-muted/50 dark:bg-white/5 p-2">
            <p className="text-xs text-muted-foreground">TerraScore min.</p>
            <p className="font-mono font-semibold text-[#f59e0b]">{offer.terra_score_min}</p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-xs text-muted-foreground mb-1">Monto financiable</p>
          <p className="font-medium">
            {formatPrice(offer.monto_min, "USD")} — {formatPrice(offer.monto_max, "USD")}
          </p>
        </div>

        {offer.descripcion && (
          <p className="text-xs text-muted-foreground line-clamp-2">{offer.descripcion}</p>
        )}

        {showForm && (
          <form action={formAction} className="flex flex-col gap-3 pt-2 border-t border-border dark:border-white/10">
            <input type="hidden" name="offer_id" value={offer.id} />

            <div className="flex flex-col gap-1">
              <Label htmlFor={`monto-${offer.id}`} className="text-xs">
                Monto solicitado (USD)
              </Label>
              <Input
                id={`monto-${offer.id}`}
                name="monto"
                type="number"
                min={offer.monto_min}
                max={offer.monto_max}
                step="0.01"
                placeholder={`${offer.monto_min} — ${offer.monto_max}`}
                required
                className="h-8 text-sm"
              />
            </div>

            {state.error && (
              <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="flex-1 bg-[#1e4d8c] hover:bg-[#1e4d8c]/90 text-white"
              >
                {isPending ? "Enviando…" : "Confirmar solicitud"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      {!showForm && (
        <CardFooter>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="w-full bg-[#1e4d8c] hover:bg-[#1e4d8c]/90 text-white"
          >
            Solicitar crédito
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
