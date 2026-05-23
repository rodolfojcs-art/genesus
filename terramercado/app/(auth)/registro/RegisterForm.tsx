"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction, type ActionState } from "./actions";

const initialState: ActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <div>
          <p className="font-semibold text-[#0d2240] dark:text-[#eff6ff] mb-1">
            ¡Cuenta creada!
          </p>
          <p className="text-sm text-[#94a3b8]">{state.message}</p>
        </div>
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

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="nombre" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Carlos"
            className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apellido" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            id="apellido"
            name="apellido"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Martínez"
            className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="carlos@finca.com"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
          disabled={isPending}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="telefono" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Teléfono <span className="text-[#94a3b8] font-normal">(opcional)</span>
        </Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          placeholder="+58 412 000 0000"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
          disabled={isPending}
        />
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="ubicacion" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Ubicación <span className="text-[#94a3b8] font-normal">(estado / municipio)</span>
        </Label>
        <Input
          id="ubicacion"
          name="ubicacion"
          type="text"
          placeholder="Ej: Aragua, Venezuela"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
          disabled={isPending}
        />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Tipo de cuenta <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "comprador", label: "Comprador", desc: "Compra insumos y servicios" },
            { value: "vendedor", label: "Vendedor", desc: "Vende productos en TerraMercado" },
          ].map((role) => (
            <label
              key={role.value}
              className="relative flex flex-col gap-1 cursor-pointer rounded-lg border border-[#dbeafe] dark:border-[#1e4d8c] p-3 hover:border-[#1e4d8c] dark:hover:border-[#60a5f5] has-[:checked]:border-[#1e4d8c] dark:has-[:checked]:border-[#60a5f5] has-[:checked]:bg-[#eff6ff] dark:has-[:checked]:bg-[#0d2240] transition-colors"
            >
              <input
                type="radio"
                name="rol"
                value={role.value}
                defaultChecked={role.value === "comprador"}
                className="sr-only"
              />
              <span className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff]">
                {role.label}
              </span>
              <span className="text-xs text-[#94a3b8]">{role.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Contraseña <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mínimo 8 caracteres"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
          disabled={isPending}
        />
        <p className="text-xs text-[#94a3b8]">
          Debe contener al menos una mayúscula y un número
        </p>
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
          Confirmar contraseña <span className="text-red-500">*</span>
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repite tu contraseña"
          className="rounded-lg border-[#dbeafe] dark:border-[#1e4d8c] h-10"
          disabled={isPending}
        />
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="aceptaTerminos"
          required
          className="mt-0.5 h-4 w-4 rounded border-[#dbeafe] accent-[#1e4d8c]"
        />
        <span className="text-xs text-[#94a3b8] leading-relaxed">
          Acepto los{" "}
          <a
            href="/legal/terminos"
            target="_blank"
            className="text-[#2563b0] dark:text-[#60a5f5] hover:underline"
          >
            Términos y Condiciones
          </a>
          {" "}y la{" "}
          <a
            href="/legal/privacidad"
            target="_blank"
            className="text-[#2563b0] dark:text-[#60a5f5] hover:underline"
          >
            Política de Privacidad
          </a>
          . Entiendo que TerraMercado usa escrow obligatorio y que mi dinero
          siempre está protegido.
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-[#1e4d8c] hover:bg-[#2563b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creando cuenta…
          </>
        ) : (
          "Crear cuenta gratuita"
        )}
      </button>
    </form>
  );
}
