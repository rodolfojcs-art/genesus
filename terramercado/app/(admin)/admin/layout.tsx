import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  AlertTriangle,
  ScrollText,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getDisputeCount(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { count } = await supabase
    .from("disputes")
    .select("id", { count: "exact", head: true })
    .is("resuelto_at", null);
  return count ?? 0;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/disputas", label: "Disputas", icon: AlertTriangle, badge: true },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (profile?.rol !== "admin") redirect("/");

  const disputeCount = await getDisputeCount(supabase);

  return (
    <div className="flex min-h-screen bg-[#eff6ff] dark:bg-[#0d2240]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-[#0d2240] text-white shrink-0 min-h-screen">
        <div className="px-4 py-5 border-b border-white/10">
          <p className="font-heading text-lg font-semibold text-white">TerraMercado</p>
          <p className="text-xs text-white/50 mt-0.5">Panel de Administración</p>
        </div>

        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const count = item.badge ? disputeCount : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && count > 0 && (
                  <span className="flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[10px] text-white/30">v1.0 · Sprint 7</p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#0d2240] text-white px-4 py-3 flex items-center gap-3">
        <p className="font-heading text-base font-semibold">Admin</p>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 md:pt-0 pt-12">
        {children}
      </main>
    </div>
  );
}
