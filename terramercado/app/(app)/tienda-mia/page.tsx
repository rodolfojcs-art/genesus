import Link from "next/link";
import { Plus, ShoppingBag, Package, Star, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TerraScoreBadge } from "@/components/catalog/TerraScoreBadge";

export default async function TiendaMiaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the user's store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // No store: show CTA
  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-[#dbeafe] dark:bg-[#1a3a6a] flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-[#1e4d8c] dark:text-[#60a5f5]" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff] mb-2">
          Aún no tienes una tienda
        </h1>
        <p className="text-[#94a3b8] text-sm mb-7 max-w-sm">
          Crea tu tienda en TerraMercado y empieza a vender tus productos agropecuarios.
        </p>
        <Link
          href="/tienda-mia/nueva"
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-sm px-5 py-3 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Crear mi tienda
        </Link>
      </div>
    );
  }

  // Fetch stats
  const [{ count: productCount }, { count: pendingOrdersCount }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .eq("activo", true),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .in("status", ["creado", "pagado_en_escrow", "en_preparacion"]),
    ]);

  // Fetch reputation
  const { data: rep } = await supabase
    .from("seller_reputations")
    .select("total_ventas, calidad_promedio")
    .eq("store_id", store.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Store header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
            {store.nombre}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <TerraScoreBadge score={store.terra_score} size="md" />
            {store.verificada && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Verificada
              </span>
            )}
          </div>
        </div>
        <Link
          href="/tienda-mia/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-4 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Package}
          label="Productos activos"
          value={String(productCount ?? 0)}
        />
        <StatCard
          icon={ShoppingBag}
          label="Pedidos pendientes"
          value={String(pendingOrdersCount ?? 0)}
          highlight={(pendingOrdersCount ?? 0) > 0}
        />
        <StatCard
          icon={TrendingUp}
          label="Ventas totales"
          value={rep?.total_ventas ? String(rep.total_ventas) : "—"}
        />
        <StatCard
          icon={Star}
          label="Calidad promedio"
          value={rep?.calidad_promedio ? rep.calidad_promedio.toFixed(1) : "—"}
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/tienda-mia/productos"
          className="flex items-center gap-3 p-4 rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] hover:border-[#60a5f5] transition-colors"
        >
          <Package className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          <div>
            <p className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff]">Gestionar productos</p>
            <p className="text-xs text-[#94a3b8]">Agregar, editar o eliminar</p>
          </div>
        </Link>
        <Link
          href="/tienda-mia/pedidos"
          className="flex items-center gap-3 p-4 rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] hover:border-[#60a5f5] transition-colors"
        >
          <ShoppingBag className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          <div>
            <p className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff]">Ver pedidos</p>
            <p className="text-xs text-[#94a3b8]">Administra tus órdenes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
        <p className="text-xs text-[#94a3b8] uppercase tracking-wide">{label}</p>
      </div>
      <p
        className={`font-heading text-2xl font-bold ${
          highlight
            ? "text-[#f59e0b]"
            : "text-[#0d2240] dark:text-[#eff6ff]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
