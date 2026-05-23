import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/catalog";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/escrow";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function PedidosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "*, store:stores(nombre, slug), order_items(cantidad, product:products(nombre))"
    )
    .eq("comprador_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Package className="h-6 w-6 text-[#1e4d8c] dark:text-[#60a5f5]" />
        <h1 className="font-heading text-2xl font-semibold text-[#1e293b] dark:text-[#eff6ff]">
          Mis pedidos
        </h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] bg-white py-20 text-center ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
          <ShoppingBag className="h-14 w-14 text-[#94a3b8]" />
          <p className="text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            No tienes pedidos aún
          </p>
          <p className="max-w-xs text-sm text-[#64748b] dark:text-[#94a3b8]">
            Cuando realices una compra, aparecerá aquí con seguimiento en tiempo
            real.
          </p>
          <Link
            href="/catalogo"
            className="rounded-[8px] bg-[#1e4d8c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240]"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            type OrderItemRef = {
              cantidad: number;
              product: { nombre: string } | null;
            };
            type StoreRef = { nombre: string; slug: string } | null;

            const store = order.store as StoreRef;
            const items = (order.order_items ?? []) as OrderItemRef[];
            const firstItem = items[0];

            return (
              <Link
                key={order.id}
                href={`/pedidos/${order.id}`}
                className="group flex items-center justify-between gap-4 rounded-[12px] bg-white p-4 ring-1 ring-[#dbeafe] transition-shadow hover:shadow-md dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Order ID */}
                  <p className="terra-score text-xs text-[#64748b] dark:text-[#94a3b8]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>

                  {/* Store + product summary */}
                  <p className="truncate font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                    {store?.nombre ?? "Tienda"}
                  </p>
                  {firstItem && (
                    <p className="truncate text-xs text-[#64748b] dark:text-[#94a3b8]">
                      {firstItem.product?.nombre}
                      {items.length > 1 && ` +${items.length - 1} más`}
                    </p>
                  )}

                  {/* Date + total */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      {format(new Date(order.created_at), "d MMM yyyy", {
                        locale: es,
                      })}
                    </span>
                    <span className="font-semibold text-sm text-[#f59e0b]">
                      {formatPrice(
                        Number(order.total),
                        order.moneda as "USD" | "VES"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#94a3b8] transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
