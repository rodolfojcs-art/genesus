import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/catalog";
import { ProductTableActions } from "./ProductTableActions";

export default async function MisProductosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!store) {
    return (
      <div className="text-center py-16">
        <p className="text-[#94a3b8] text-sm mb-4">
          Necesitas crear una tienda antes de gestionar productos.
        </p>
        <Link
          href="/tienda-mia"
          className="inline-flex items-center rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-5 py-2.5 transition-colors"
        >
          Ir a Mi Tienda
        </Link>
      </div>
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, nombre, precio_base, moneda, stock, unidad, activo")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
          Mis Productos
        </h1>
        <Link
          href="/tienda-mia/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-4 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dbeafe] dark:border-[#1e4d8c]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                    Producto
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                    Precio
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                    Stock
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                    Activo
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbeafe] dark:divide-[#1e4d8c]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#eff6ff] dark:hover:bg-[#0d2240] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1e293b] dark:text-[#eff6ff] line-clamp-1">
                        {p.nombre}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-[#1e4d8c] dark:text-[#60a5f5] font-semibold whitespace-nowrap">
                      {formatPrice(p.precio_base, p.moneda)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#1e293b] dark:text-[#eff6ff] whitespace-nowrap">
                      {p.stock} {p.unidad}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ProductTableActions
                        id={p.id}
                        activo={p.activo}
                        nombre={p.nombre}
                        compact
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tienda-mia/productos/${p.id}/editar`}
                          className="text-xs text-[#1e4d8c] dark:text-[#60a5f5] hover:underline font-medium"
                        >
                          Editar
                        </Link>
                        <ProductTableActions
                          id={p.id}
                          activo={p.activo}
                          nombre={p.nombre}
                          showDelete
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-[#dbeafe] dark:divide-[#1e4d8c]">
            {products.map((p) => (
              <div key={p.id} className="px-4 py-3 space-y-1.5">
                <p className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff] line-clamp-2">
                  {p.nombre}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#1e4d8c] dark:text-[#60a5f5] font-semibold text-sm">
                    {formatPrice(p.precio_base, p.moneda)}
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    Stock: {p.stock} {p.unidad}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProductTableActions id={p.id} activo={p.activo} nombre={p.nombre} compact />
                  <Link
                    href={`/tienda-mia/productos/${p.id}/editar`}
                    className="text-xs text-[#1e4d8c] dark:text-[#60a5f5] hover:underline font-medium"
                  >
                    Editar
                  </Link>
                  <ProductTableActions id={p.id} activo={p.activo} nombre={p.nombre} showDelete />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-[#1a3a6a] rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c]">
          <p className="text-[#94a3b8] text-sm mb-4">
            Aún no has publicado ningún producto.
          </p>
          <Link
            href="/tienda-mia/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] text-white font-semibold text-sm px-4 py-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear primer producto
          </Link>
        </div>
      )}
    </div>
  );
}
