"use client";

import { useActionState, useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { submitReviewAction, type ActionState } from "@/app/api/reviews/actions";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  compraVerificada?: boolean;
}

const initialState: ActionState = { success: false };

export function ReviewForm({ productId, orderId, compraVerificada = true }: ReviewFormProps) {
  const [rating, setRating] = useState(0);

  const boundAction = submitReviewAction.bind(null, { productId, orderId, rating });

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-[#22c55e]" />
        <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
          ¡Gracias por tu reseña!
        </p>
        <p className="text-sm text-[#94a3b8]">
          Tu opinión ayuda a otros agricultores a elegir mejor.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Rating */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Calificación <span className="text-red-500">*</span>
        </Label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
        <input type="hidden" name="rating" value={rating} />
      </div>

      {/* Titulo */}
      <div className="space-y-1.5">
        <Label
          htmlFor="titulo"
          className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]"
        >
          Título
        </Label>
        <Input
          id="titulo"
          name="titulo"
          placeholder="Resumen de tu experiencia"
          maxLength={120}
          className="bg-white dark:bg-[#1a3a6a] border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)]"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-1.5">
        <Label
          htmlFor="contenido"
          className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]"
        >
          Reseña
        </Label>
        <textarea
          id="contenido"
          name="contenido"
          rows={4}
          maxLength={2000}
          placeholder="Describe tu experiencia con el producto…"
          className="w-full rounded-md border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] bg-white dark:bg-[#1a3a6a] px-3 py-2 text-sm text-[#1e293b] dark:text-[#eff6ff] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] resize-none"
        />
      </div>

      {/* Compra verificada badge */}
      {compraVerificada && (
        <Badge className="flex w-fit items-center gap-1.5 text-xs px-2 py-1 bg-[#dcfce7] dark:bg-[#14532d] text-[#15803d] dark:text-[#4ade80] border-0 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5" />
          Compra verificada
        </Badge>
      )}

      {/* Error */}
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full bg-[#1e4d8c] hover:bg-[#1a3a6a] text-white"
      >
        {isPending ? "Enviando…" : "Publicar reseña"}
      </Button>
    </form>
  );
}
