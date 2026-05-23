"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type ActionState } from "./actions";

const initialState: ActionState = {};

export function LoginForm() {
  const urlParams = useSearchParams();
  const urlError = urlParams.get("error");

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* URL error (e.g. from email verification failure) */}
      {urlError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{decodeURIComponent(urlError)}</span>
        </div>
      )}

      {/* Server error */}
      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="carlos@finca.com"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-11"
          disabled={isPending}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
            Contraseña
          </Label>
          <Link
            href="/recuperar"
            className="text-xs text-[#2563b0] dark:text-[#60a5f5] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-11"
          disabled={isPending}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-[#1e4d8c] hover:bg-[#2563b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ingresando…
          </>
        ) : (
          "Ingresar"
        )}
      </button>
    </form>
  );
}
