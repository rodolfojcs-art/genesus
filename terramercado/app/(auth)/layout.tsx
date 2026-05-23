import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#eff6ff] dark:bg-[#0d2240]">
      {/* Top bar */}
      <header className="bg-[#1e4d8c] dark:bg-[#0d2240] border-b border-[#1a3a6a] px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Logo size={36} />
          <nav className="flex items-center gap-4 text-sm text-[#93c5fd]">
            <Link href="/catalogo" className="hover:text-white transition-colors hidden sm:inline">
              Ver catálogo
            </Link>
            <Link href="/herramientas" className="hover:text-white transition-colors hidden sm:inline">
              Herramientas IA
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-[#dbeafe] dark:border-[#1a3a6a] py-4 px-4 text-center">
        <p className="text-xs text-[#94a3b8]">
          © 2026 Cadet Holdings Corp. ·{" "}
          <Link href="/legal/privacidad" className="hover:text-[#1e4d8c] dark:hover:text-[#60a5f5]">
            Privacidad
          </Link>{" "}
          ·{" "}
          <Link href="/legal/terminos" className="hover:text-[#1e4d8c] dark:hover:text-[#60a5f5]">
            Términos
          </Link>
        </p>
      </footer>
    </div>
  );
}
