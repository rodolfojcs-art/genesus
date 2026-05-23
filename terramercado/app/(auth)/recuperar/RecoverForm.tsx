"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recoverAction, type ActionState } from "./actions";

const initialState: ActionState = {};

export function RecoverForm() {
  const [state, formAction, isPending] = useActionState(recoverAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="h-14 w-14 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-[#0d2240] dark:text-[#eff6ff] mb-1">
            Email enviado
          </p>
          <p className="text-sm text-[#94a3b8] leading-relaxed">{state.message}</p>
        </div>
        <p className="text-xs text-[#94a3b8]">
          Revisa también tu carpeta de spam.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Email registrado
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="carlos@finca.com"
            className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-11 pl-9"
            disabled={isPending}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-[#1e4d8c] hover:bg-[#2563b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          "Enviar instrucciones"
        )}
      </button>
    </form>
  );
}
