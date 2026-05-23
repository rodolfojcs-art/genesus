import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CatalogFilters } from "./CatalogFilters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/types";

const PAGE_SIZE = 20;

interface CatalogPageProps {
  searchParams: Promise<{
    cat?: string;
    q?: string;
    precio_min?: string;
    precio_max?: string;
    ubicacion?: string;
    ciclo?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const { cat, q, precio_min, precio_max, ubicacion, ciclo, page } = params;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();

  // Fetch categories for sidebar
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("orden");

  // Build product query
  let query = supabase
    .from("products")
    .select(
      `
      id,
      nombre,
      precio_base,
      moneda,
      cultivo_objetivo,
      ciclo,
      stores!inner(nombre, terra_score)
    `,
      { count: "exact" }
    )
    .eq("activo", true);

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,descripcion.ilike.%${q}%`);
  }

  if (cat) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", cat)
      .single();
    if (categoryData) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  if (precio_min) {
    query = query.gte("precio_base", parseFloat(precio_min));
  }
  if (precio_max) {
    query = query.lte("precio_base", parseFloat(precio_max));
  }

  if (ciclo) {
    query = query.contains("ciclo", [ciclo]);
  }

  if (ubicacion) {
    // Filter via store ubicacion via a separate approach
    const { data: storeIds } = await supabase
      .from("stores")
      .select("id")
      .ilike("ubicacion", `%${ubicacion}%`);
    if (storeIds && storeIds.length > 0) {
      query = query.in(
        "store_id",
        storeIds.map((s: { id: string }) => s.id)
      );
    } else {
      // No stores match — return empty
      query = query.eq("store_id", "no-match-impossible-id");
    }
  }

  const { data: products, count } = await query
    .range(offset, offset + PAGE_SIZE - 1)
    .order("created_at", { ascending: false });

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Active filter pills
  const activeFilters: Array<{ label: string; removeKey: string }> = [];
  if (q) activeFilters.push({ label: `Búsqueda: "${q}"`, removeKey: "q" });
  if (cat) activeFilters.push({ label: `Categoría: ${cat}`, removeKey: "cat" });
  if (precio_min) activeFilters.push({ label: `Desde $${precio_min}`, removeKey: "precio_min" });
  if (precio_max) activeFilters.push({ label: `Hasta $${precio_max}`, removeKey: "precio_max" });
  if (ubicacion) activeFilters.push({ label: `Ubicación: ${ubicacion}`, removeKey: "ubicacion" });
  if (ciclo) activeFilters.push({ label: `Ciclo: ${ciclo}`, removeKey: "ciclo" });

  function buildFilterRemoveUrl(removeKey: string) {
    const p = new URLSearchParams();
    if (q && removeKey !== "q") p.set("q", q);
    if (cat && removeKey !== "cat") p.set("cat", cat);
    if (precio_min && removeKey !== "precio_min") p.set("precio_min", precio_min);
    if (precio_max && removeKey !== "precio_max") p.set("precio_max", precio_max);
    if (ubicacion && removeKey !== "ubicacion") p.set("ubicacion", ubicacion);
    if (ciclo && removeKey !== "ciclo") p.set("ciclo", ciclo);
    return `/catalogo?${p.toString()}`;
  }

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams(params as Record<string, string>);
    sp.set("page", String(p));
    return `/catalogo?${sp.toString()}`;
  }

  const currentFilters = { cat, q, precio_min, precio_max, ubicacion, ciclo };

  return (
    <div className="bg-[#eff6ff] dark:bg-[#0d2240] min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
              {q ? `Resultados para "${q}"` : "Catálogo"}
            </h1>
            <p className="text-sm text-[#94a3b8] mt-0.5">
              {count ?? 0} producto{count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <Sheet>
            <SheetTrigger className="lg:hidden inline-flex items-center gap-2 rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] px-3 py-2 text-sm font-medium text-[#1e293b] dark:text-[#eff6ff] hover:border-[#60a5f5] transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFilters.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#1e4d8c] text-white text-[10px] font-bold">
                  {activeFilters.length}
                </span>
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-white dark:bg-[#0d2240] p-4 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <CatalogFilters
                  categories={(categories as Category[]) ?? []}
                  currentFilters={currentFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((f) => (
              <Link
                key={f.removeKey}
                href={buildFilterRemoveUrl(f.removeKey)}
                className="inline-flex items-center gap-1 text-xs font-medium bg-[#dbeafe] dark:bg-[#1a3a6a] text-[#1e4d8c] dark:text-[#60a5f5] border border-[#93c5fd] dark:border-[#1e4d8c] rounded-full px-2.5 py-1 hover:bg-[#bfdbfe] dark:hover:bg-[#0d2240] transition-colors"
              >
                {f.label}
                <X className="h-3 w-3 flex-shrink-0" />
              </Link>
            ))}
            <Link
              href="/catalogo"
              className="inline-flex items-center text-xs font-medium text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#eff6ff] transition-colors px-1"
            >
              Limpiar todo
            </Link>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] p-4">
              <h2 className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff] mb-4">
                Filtros
              </h2>
              <CatalogFilters
                categories={(categories as Category[]) ?? []}
                currentFilters={currentFilters}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                        cultivo={
                          product.cultivo_objetivo?.[0] ?? null
                        }
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {currentPage > 1 && (
                      <Link
                        href={buildPageUrl(currentPage - 1)}
                        className="px-3 py-1.5 rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] text-sm text-[#1e4d8c] dark:text-[#60a5f5] hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] transition-colors"
                      >
                        ← Anterior
                      </Link>
                    )}
                    <span className="text-sm text-[#94a3b8]">
                      Página {currentPage} de {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Link
                        href={buildPageUrl(currentPage + 1)}
                        className="px-3 py-1.5 rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] text-sm text-[#1e4d8c] dark:text-[#60a5f5] hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] transition-colors"
                      >
                        Siguiente →
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[#94a3b8] text-base mb-4">
                  No encontramos productos para esa búsqueda.
                </p>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-5 py-2.5 transition-colors"
                >
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
