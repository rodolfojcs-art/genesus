import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Star, CreditCard } from "lucide-react";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-lg">
      <div className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] shadow-sm p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
            Crear tu cuenta
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Únete a miles de productores que ya confían en TerraMercado
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Escrow garantizado" },
            { icon: Star, label: "TerraScore público" },
            { icon: CreditCard, label: "Crédito por ciclo" },
          ].map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1 text-center text-xs text-[#94a3b8] p-2 rounded-lg bg-[#eff6ff] dark:bg-[#0d2240]"
            >
              <b.icon className="h-4 w-4 text-[#f59e0b]" />
              {b.label}
            </div>
          ))}
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-[#94a3b8]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[#2563b0] dark:text-[#60a5f5] hover:underline font-medium"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
