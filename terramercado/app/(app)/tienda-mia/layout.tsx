import Link from "next/link";
import { BarChart2, Package, ShoppingBag, Star } from "lucide-react";

const NAV_LINKS = [
  { href: "/tienda-mia", label: "Resumen", icon: BarChart2 },
  { href: "/tienda-mia/productos", label: "Mis Productos", icon: Package },
  { href: "/tienda-mia/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/tienda-mia/reputacion", label: "Reputación", icon: Star },
] as const;

export default function TiendaMiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-5">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <nav className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] p-2 space-y-0.5">
            <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wide px-3 py-2">
              Mi Tienda
            </p>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-[#eff6ff] dark:hover:bg-[#0d2240] hover:text-[#1e4d8c] dark:hover:text-[#60a5f5] transition-colors"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile tab bar */}
          <div className="lg:hidden flex overflow-x-auto gap-1 bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] p-1.5 mb-5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-[#eff6ff] dark:hover:bg-[#0d2240] hover:text-[#1e4d8c] dark:hover:text-[#60a5f5] transition-colors whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
