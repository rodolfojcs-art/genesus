"use client";

import { useActionState } from "react";
import type { Category } from "@/types";
import { createProductAction } from "../../actions";

interface ProductFormProps {
  categories: Category[];
}

const CICLOS = ["siembra", "desarrollo", "cosecha"] as const;
const CULTIVOS = [
  "Maíz",
  "Caña de azúcar",
  "Arroz",
  "Soja",
  "Café",
  "Cacao",
  "Ganadería",
  "Hortalizas",
  "Frutas",
  "Cereales",
] as const;

type ActionState = { error?: string; success?: string } | null;

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-white dark:bg-[#1a3a6a] text-[#1e293b] dark:text-[#eff6ff] text-sm px-3 py-2 focus:outline-none focus:border-[#60a5f5] focus:ring-1 focus:ring-[#60a5f5]/40 placeholder-[#94a3b8]";

export function ProductForm({ categories }: ProductFormProps) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createProductAction,
    null
  );

  const rootCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id);

  return (
    <form action={action} className="space-y-6">
      {/* Basic info */}
      <section className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] p-4 sm:p-5 space-y-4">
        <h2 className="font-heading font-semibold text-[#0d2240] dark:text-[#eff6ff]">
          Información básica
        </h2>

        <FormField label="Nombre del producto" required>
          <input
            name="nombre"
            type="text"
            placeholder="Ej: Fertilizante NPK 15-15-15 — Saco 50 kg"
            required
            className={inputClass}
          />
        </FormField>

        <FormField label="Descripción">
          <textarea
            name="descripcion"
            rows={4}
            placeholder="Describe tu producto: beneficios, modo de uso, presentaciones disponibles..."
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Precio base" required>
            <input
              name="precio_base"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              required
              className={inputClass}
            />
          </FormField>

          <FormField label="Moneda" required>
            <select name="moneda" required className={inputClass}>
              <option value="USD">USD ($)</option>
              <option value="VES">VES (Bs.)</option>
            </select>
          </FormField>

          <FormField label="Unidad" required>
            <input
              name="unidad"
              type="text"
              placeholder="Ej: saco, litro, kg"
              required
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Stock disponible" required>
          <input
            name="stock"
            type="number"
            min={0}
            placeholder="0"
            required
            className={inputClass}
          />
        </FormField>

        <FormField label="Categoría" required>
          <select name="category_id" required className={inputClass}>
            <option value="">Seleccionar categoría</option>
            {rootCategories.map((root) => (
              <optgroup key={root.id} label={root.nombre}>
                <option value={root.id}>{root.nombre}</option>
                {subCategories
                  .filter((s) => s.parent_id === root.id)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      &nbsp;&nbsp;{sub.nombre}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </FormField>
      </section>

      {/* Agronomic info */}
      <section className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] p-4 sm:p-5 space-y-4">
        <h2 className="font-heading font-semibold text-[#0d2240] dark:text-[#eff6ff]">
          Ficha agronómica / veterinaria
        </h2>

        {/* Cultivo objetivo */}
        <FormField label="Cultivo objetivo">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {CULTIVOS.map((cultivo) => (
              <label
                key={cultivo}
                className="flex items-center gap-2 text-sm text-[#1e293b] dark:text-[#eff6ff] cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="cultivo_objetivo"
                  value={cultivo}
                  className="rounded border-[#dbeafe] dark:border-[#1e4d8c] text-[#1e4d8c] focus:ring-[#60a5f5]/40"
                />
                {cultivo}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Principio activo">
          <input
            name="principio_activo"
            type="text"
            placeholder="Ej: Glifosato 48%"
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Dosis recomendada">
            <input
              name="dosis_recomendada"
              type="text"
              placeholder="Ej: 2 L/ha en 200 L de agua"
              className={inputClass}
            />
          </FormField>

          <FormField label="Período de carencia">
            <input
              name="periodo_carencia"
              type="text"
              placeholder="Ej: 15 días antes de cosecha"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Contraindicaciones">
          <textarea
            name="contraindicaciones"
            rows={2}
            placeholder="No aplicar en presencia de viento fuerte..."
            className={inputClass}
          />
        </FormField>

        {/* Ciclo */}
        <FormField label="Ciclo de aplicación">
          <div className="flex flex-wrap gap-4 mt-1">
            {CICLOS.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2 text-sm text-[#1e293b] dark:text-[#eff6ff] cursor-pointer capitalize"
              >
                <input
                  type="checkbox"
                  name="ciclo"
                  value={c}
                  className="rounded border-[#dbeafe] dark:border-[#1e4d8c] text-[#1e4d8c] focus:ring-[#60a5f5]/40"
                />
                {c}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Certificaciones">
          <input
            name="certificaciones"
            type="text"
            placeholder="SENCAMER, INIA, SENASA (separados por coma)"
            className={inputClass}
          />
          <p className="text-xs text-[#94a3b8] mt-1">Separados por coma</p>
        </FormField>
      </section>

      {/* Submit */}
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          {state.success}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 transition-colors"
        >
          {pending ? "Publicando..." : "Publicar producto"}
        </button>
        <a
          href="/tienda-mia/productos"
          className="text-sm text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#eff6ff] transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
