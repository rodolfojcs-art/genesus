import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] shadow-sm p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
            Bienvenido a TerraMercado
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Suspense required for useSearchParams */}
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-[#eff6ff] dark:bg-[#1e4d8c]" />}>
          <LoginForm />
        </Suspense>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#dbeafe] dark:border-[#1e4d8c]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#1a3a6a] px-2 text-[#94a3b8]">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        <Link
          href="/registro"
          className="flex w-full items-center justify-center rounded-lg border border-[#1e4d8c] px-4 py-2.5 text-sm font-semibold text-[#1e4d8c] dark:border-[#60a5f5] dark:text-[#60a5f5] hover:bg-[#eff6ff] dark:hover:bg-[#1e4d8c] transition-colors"
        >
          Crear cuenta gratuita
        </Link>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#94a3b8]">
          <Shield className="h-3.5 w-3.5 text-[#f59e0b]" />
          <span>Tus datos están protegidos y nunca se venden</span>
        </div>
      </div>
    </div>
  );
}
