import Link from "next/link";
import { CheckCircle2, MapPin, Package, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TerraScoreBadge } from "@/components/catalog/TerraScoreBadge";
import { ProductCard } from "@/components/catalog/ProductCard";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

interface SellerReputation {
  total_ventas: number;
  calidad_promedio: number;
  tasa_disputa: number;
  entregas_a_tiempo: number;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!store) {
    return (
      <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <Package className="h-16 w-16 text-[#dbeafe] mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff] mb-2">
            Tienda no encontrada
          </h1>
          <p className="text-[#94a3b8] mb-6">
            Esta tienda no existe o fue eliminada.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-5 py-2.5 transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Fetch seller reputation
  const { data: reputation } = await supabase
    .from("seller_reputations")
    .select("total_ventas, calidad_promedio, tasa_disputa, entregas_a_tiempo")
    .eq("store_id", store.id)
    .single();

  const rep = reputation as SellerReputation | null;

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      nombre,
      precio_base,
      moneda,
      cultivo_objetivo
    `
    )
    .eq("store_id", store.id)
    .eq("activo", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen">
      {/* Store header / banner */}
      <div className="bg-gradient-to-r from-[#0d2240] via-[#1a3a6a] to-[#1e4d8c] h-36 sm:h-48 relative">
        {store.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.banner_url}
            alt={`Banner de ${store.nombre}`}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        {/* Logo + name row */}
        <div className="flex items-end gap-4 -mt-10 mb-5">
          <div className="h-20 w-20 rounded-[12px] border-4 border-white dark:border-[#0d2240] bg-white dark:bg-[#1a3a6a] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
            {store.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logo_url}
                alt={store.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-heading text-2xl font-bold text-[#1e4d8c]">
                {store.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="pb-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
                {store.nombre}
              </h1>
              {store.verificada && (
                <CheckCircle2
                  className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5] flex-shrink-0"
                  aria-label="Tienda verificada"
                />
              )}
              <TerraScoreBadge score={store.terra_score} size="md" />
            </div>
            {store.ubicacion && (
              <p className="flex items-center gap-1 text-sm text-[#94a3b8] mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {store.ubicacion}
              </p>
            )}
          </div>

          <button className="hidden sm:inline-flex items-center rounded-[8px] border border-[#1e4d8c] dark:border-[#60a5f5] text-[#1e4d8c] dark:text-[#60a5f5] hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] font-medium text-sm px-4 py-2 transition-colors flex-shrink-0">
            + Seguir tienda
          </button>
        </div>

        {store.descripcion && (
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-5 max-w-2xl">
            {store.descripcion}
          </p>
        )}

        {/* Stats row */}
        {rep && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            <StatCard
              label="Ventas totales"
              value={rep.total_ventas.toLocaleString("es-VE")}
            />
            <StatCard
              label="Calidad promedio"
              value={
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                  {rep.calidad_promedio.toFixed(1)}
                </span>
              }
            />
            <StatCard
              label="Tasa de disputa"
              value={`${(rep.tasa_disputa * 100).toFixed(1)}%`}
              hint={rep.tasa_disputa < 0.02 ? "Excelente" : undefined}
            />
            <StatCard
              label="Entregas a tiempo"
              value={`${(rep.entregas_a_tiempo * 100).toFixed(0)}%`}
            />
          </div>
        )}

        {/* Products */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#0d2240] dark:text-[#eff6ff]">
            Productos
          </h2>
          <Link
            href={`/catalogo?store=${store.id}`}
            className="text-sm text-[#1e4d8c] dark:text-[#60a5f5] hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                nombre={product.nombre}
                precio={product.precio_base}
                moneda={product.moneda}
                vendedor={store.nombre}
                terraScore={store.terra_score}
                rating={0}
                reviews={0}
                cultivo={product.cultivo_objetivo?.[0] ?? null}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#94a3b8] text-sm pb-12">
            Esta tienda no tiene productos disponibles.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] p-3">
      <p className="text-xs text-[#94a3b8] uppercase tracking-wide mb-1">{label}</p>
      <p className="font-heading font-bold text-lg text-[#0d2240] dark:text-[#eff6ff] flex items-center gap-1">
        {value}
      </p>
      {hint && <p className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">{hint}</p>}
    </div>
  );
}
