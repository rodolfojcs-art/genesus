import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  if (!q || q.trim() === "") {
    redirect("/catalogo");
  }

  const supabase = await createClient();

  const { data: products, count } = await supabase
    .from("products")
    .select(
      `
      id,
      nombre,
      precio_base,
      moneda,
      cultivo_objetivo,
      stores(nombre, terra_score)
    `,
      { count: "exact" }
    )
    .eq("activo", true)
    .or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%`)
    .limit(20)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff] mb-1">
          Resultados para &ldquo;{q}&rdquo;
        </h1>
        <p className="text-sm text-[#94a3b8] mb-6">
          {count ?? 0} producto{count !== 1 ? "s" : ""} encontrado{count !== 1 ? "s" : ""}
        </p>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => {
              const store = product.stores as unknown as {
                nombre: string;
                terra_score: number;
              } | null;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  nombre={product.nombre}
                  precio={product.precio_base}
                  moneda={product.moneda}
                  vendedor={store?.nombre ?? "Vendedor"}
                  terraScore={store?.terra_score ?? 0}
                  rating={0}
                  reviews={0}
                  cultivo={product.cultivo_objetivo?.[0] ?? null}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#94a3b8] text-base mb-2">
              No encontramos productos para &ldquo;{q}&rdquo;.
            </p>
            <p className="text-[#94a3b8] text-sm mb-6">
              Intenta con otros términos o explora nuestro catálogo completo.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/catalogo"
                className="inline-flex items-center rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-5 py-2.5 transition-colors"
              >
                Ver todo el catálogo
              </Link>
              <Link
                href="/catalogo?cat=insumos"
                className="inline-flex items-center rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] text-[#1e4d8c] dark:text-[#60a5f5] hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] font-medium text-sm px-5 py-2.5 transition-colors"
              >
                Insumos agrícolas
              </Link>
              <Link
                href="/catalogo?cat=maquinaria"
                className="inline-flex items-center rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] text-[#1e4d8c] dark:text-[#60a5f5] hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] font-medium text-sm px-5 py-2.5 transition-colors"
              >
                Maquinaria
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
