import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RecoverForm } from "./RecoverForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function RecoverPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] shadow-sm p-8 space-y-6">
        <div className="space-y-1">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-[#1e4d8c] dark:hover:text-[#60a5f5] mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>
          <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>

        <RecoverForm />
      </div>
    </div>
  );
}
