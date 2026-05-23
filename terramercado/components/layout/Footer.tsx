import Link from "next/link";
import { Logo } from "./Logo";
import { Shield, Truck, CreditCard, HeadphonesIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0d2240] text-[#93c5fd] mt-auto">
      {/* Trust bar */}
      <div className="border-b border-[#1a3a6a]">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Shield,
                title: "Escrow garantizado",
                desc: "Tu dinero protegido hasta confirmar entrega",
              },
              {
                icon: Truck,
                title: "TerraTransporte",
                desc: "Seguimiento GPS en tiempo real",
              },
              {
                icon: CreditCard,
                title: "Reembolso real",
                desc: "Devolución en moneda real, nunca en saldo",
              },
              {
                icon: HeadphonesIcon,
                title: "Soporte 7 días",
                desc: "Expertos agronómicos y arbitraje neutral",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <item.icon className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">{item.title}</p>
                  <p className="text-[11px] text-[#93c5fd]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size={48} linkHref="/" />
            <p className="text-sm text-[#93c5fd] leading-relaxed">
              Comercio agropecuario con confianza. La plataforma B2B que el sector agrícola de Venezuela y LATAM necesitaba.
            </p>
            <p className="text-xs text-[#60a5f5]">
              Cadet Holdings Corp. · Delaware, 2026
            </p>
          </div>

          {/* Comprar */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Comprar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Catálogo de insumos", href: "/catalogo" },
                { label: "Maquinaria agrícola", href: "/catalogo?cat=maquinaria" },
                { label: "Genética pecuaria", href: "/catalogo?cat=genetica" },
                { label: "Ofertas de zafra", href: "/catalogo?ofertas=true" },
                { label: "Lista de ciclo", href: "/listas" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Vender</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Abrir mi tienda", href: "/tienda-mia" },
                { label: "TerraReputación", href: "/herramientas/reputacion" },
                { label: "TerraPrecios", href: "/herramientas/precios" },
                { label: "TerraAnalítica", href: "/herramientas/analitica" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Soporte</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Copiloto agronómico IA", href: "/herramientas" },
                { label: "Terra-Lens (diagnóstico)", href: "/herramientas" },
                { label: "TerraBanca (crédito)", href: "/billetera" },
                { label: "Disputas y arbitraje", href: "/pedidos" },
                { label: "soporte@terramercado.com", href: "mailto:soporte@terramercado.com" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a3a6a] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#60a5f5]">
          <p>© 2026 Cadet Holdings Corp. · TerraMercado es una marca de Terra Platform LLC.</p>
          <div className="flex gap-4">
            <Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/legal/terminos" className="hover:text-white">Términos</Link>
            <Link href="/legal/escrow" className="hover:text-white">Política de escrow</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
