"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types";

interface CurrentFilters {
  cat?: string;
  q?: string;
  precio_min?: string;
  precio_max?: string;
  ubicacion?: string;
  ciclo?: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  currentFilters: CurrentFilters;
}

export function CatalogFilters({ categories, currentFilters }: CatalogFiltersProps) {
  const router = useRouter();

  const [cat, setCat] = useState(currentFilters.cat ?? "");
  const [precioMin, setPrecioMin] = useState(currentFilters.precio_min ?? "");
  const [precioMax, setPrecioMax] = useState(currentFilters.precio_max ?? "");
  const [ubicacion, setUbicacion] = useState(currentFilters.ubicacion ?? "");
  const [ciclo, setCiclo] = useState(currentFilters.ciclo ?? "");

  function handleApply() {
    const params = new URLSearchParams();
    if (currentFilters.q) params.set("q", currentFilters.q);
    if (cat) params.set("cat", cat);
    if (precioMin) params.set("precio_min", precioMin);
    if (precioMax) params.set("precio_max", precioMax);
    if (ubicacion) params.set("ubicacion", ubicacion);
    if (ciclo) params.set("ciclo", ciclo);
    router.push(`/catalogo?${params.toString()}`);
  }

  function handleClear() {
    setCat("");
    setPrecioMin("");
    setPrecioMax("");
    setUbicacion("");
    setCiclo("");
    router.push("/catalogo");
  }

  const hasFilters = cat || precioMin || precioMax || ubicacion || ciclo;

  // Build hierarchical category options
  const rootCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id);

  return (
    <aside className="space-y-5">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
          Categoría
        </label>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40"
        >
          <option value="">Todas las categorías</option>
          {rootCategories.map((root) => (
            <optgroup key={root.id} label={root.nombre}>
              <option value={root.slug}>{root.nombre}</option>
              {subCategories
                .filter((s) => s.parent_id === root.id)
                .map((sub) => (
                  <option key={sub.id} value={sub.slug}>
                    &nbsp;&nbsp;{sub.nombre}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
          Precio (USD)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Mín"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40"
          />
          <span className="text-[#94a3b8] text-sm flex-shrink-0">—</span>
          <input
            type="number"
            min={0}
            placeholder="Máx"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40"
          />
        </div>
      </div>

      {/* Ciclo */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
          Ciclo productivo
        </label>
        <select
          value={ciclo}
          onChange={(e) => setCiclo(e.target.value)}
          className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40"
        >
          <option value="">Todos los ciclos</option>
          <option value="siembra">Siembra</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="cosecha">Cosecha</option>
        </select>
      </div>

      {/* Ubicación */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
          Ubicación
        </label>
        <input
          type="text"
          placeholder="Ej: Aragua, Lara..."
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40"
        />
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleApply}
          className="w-full rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm py-2.5 transition-colors"
        >
          Aplicar filtros
        </button>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#eff6ff] font-medium text-sm py-2.5 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}
