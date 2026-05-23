import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, MapPin, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/catalog";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  getEscrowStatusLabel,
} from "@/lib/escrow";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EscrowTimeline } from "./EscrowTimeline";
import { OrderActions } from "./OrderActions";
import type { OrderStatus } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nuevo?: string }>;
}

export default async function PedidoDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { nuevo } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch order with related data
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      store:stores(id, nombre, slug),
      order_items(
        id, cantidad, precio_unitario,
        product:products(id, nombre, moneda)
      )
    `
    )
    .eq("id", id)
    .single();

  if (!order) notFound();

  // Must be comprador or vendedor
  if (order.comprador_id !== user.id && order.vendedor_id !== user.id) {
    notFound();
  }

  const userRole =
    order.comprador_id === user.id
      ? ("comprador" as const)
      : order.vendedor_id === user.id
        ? ("vendedor" as const)
        : ("other" as const);

  // Fetch escrow
  const { data: escrow } = await supabase
    .from("escrow_accounts")
    .select("*, escrow_events(*)")
    .eq("order_id", id)
    .single();

  type EscrowEventRow = {
    id: string;
    created_at: string;
    tipo: string;
    monto?: number | null;
    descripcion?: string | null;
  };

  const escrowEvents = ((escrow?.escrow_events ?? []) as EscrowEventRow[]).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  type StoreRef = { id: string; nombre: string; slug: string } | null;
  type ProductRef = { id: string; nombre: string; moneda: "USD" | "VES" } | null;
  type OrderItemRow = {
    id: string;
    cantidad: number;
    precio_unitario: number;
    product: ProductRef;
  };

  const store = order.store as StoreRef;
  const orderItems = (order.order_items ?? []) as OrderItemRow[];
  const moneda = (order.moneda as "USD" | "VES") ?? "USD";

  // Escrow "what happens next" hint
  function getNextStep(status: string, role: string): string {
    if (status === "pendiente" && role === "comprador")
      return "Realiza la transferencia para activar el escrow.";
    if (status === "fondos_recibidos" && role === "vendedor")
      return "Prepara y despacha el pedido.";
    if (status === "fondos_recibidos" && role === "comprador")
      return "Espera el despacho del vendedor.";
    if (status === "liberado") return "Fondos liberados. ¡Gracias por tu compra!";
    if (status === "en_disputa") return "El equipo de TerraMercado revisará la disputa.";
    return "";
  }

  const nextStep = getNextStep(escrow?.status ?? "pendiente", userRole);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/pedidos"
        className="mb-6 flex items-center gap-1.5 text-sm text-[#64748b] transition-colors hover:text-[#1e4d8c] dark:text-[#94a3b8] dark:hover:text-[#60a5f5]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis pedidos
      </Link>

      {/* New order banner */}
      {nuevo === "true" && (
        <div className="mb-5 flex items-center gap-3 rounded-[12px] bg-green-50 px-4 py-3 dark:bg-green-900/20">
          <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            ¡Pedido creado con éxito! Ahora realiza el pago para activar el
            escrow.
          </p>
        </div>
      )}

      {/* Order header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="terra-score text-xs text-[#64748b] dark:text-[#94a3b8]">
            Pedido #{id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="font-heading mt-0.5 text-xl font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            {store?.nombre ?? "Tienda"}
          </h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
            {format(new Date(order.created_at), "d 'de' MMMM yyyy", {
              locale: es,
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getOrderStatusColor(order.status)}`}
        >
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_300px]">
        {/* ── Left column ── */}
        <div className="space-y-5">
          {/* Order items */}
          <section className="rounded-[12px] bg-white p-5 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
            <h2 className="font-heading mb-3 text-base font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              Productos
            </h2>
            <div className="space-y-2">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
                      {item.product?.nombre ?? "Producto"}
                    </p>
                    <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#f59e0b]">
                    {formatPrice(
                      item.precio_unitario * item.cantidad,
                      item.product?.moneda ?? "USD"
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-[#dbeafe] pt-3 dark:border-[#1e4d8c]">
              <div className="flex justify-between font-semibold">
                <span className="text-[#1e293b] dark:text-[#eff6ff]">
                  Total
                </span>
                <span className="text-[#f59e0b]">
                  {formatPrice(Number(order.total), moneda)}
                </span>
              </div>
            </div>
          </section>

          {/* Address */}
          {order.direccion_entrega && (
            <section className="rounded-[12px] bg-white p-5 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
                <h2 className="font-heading text-base font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                  Dirección de entrega
                </h2>
              </div>
              <p className="whitespace-pre-wrap text-sm text-[#475569] dark:text-[#94a3b8]">
                {order.direccion_entrega}
              </p>
            </section>
          )}

          {/* Escrow timeline */}
          <section className="rounded-[12px] bg-white p-5 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
            <h2 className="font-heading mb-4 text-base font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              Historial del escrow
            </h2>
            <EscrowTimeline events={escrowEvents} />
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Escrow status card */}
          <section className="rounded-[12px] bg-white p-5 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
              <h2 className="font-heading text-base font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                Escrow
              </h2>
            </div>

            <div className="mb-3 rounded-[8px] bg-[#dbeafe] px-3 py-2 dark:bg-[#0d2240]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Estado actual
              </p>
              <p className="mt-0.5 font-semibold text-[#1e4d8c] dark:text-[#60a5f5]">
                {getEscrowStatusLabel(escrow?.status ?? "pendiente")}
              </p>
            </div>

            {nextStep && (
              <p className="text-xs leading-relaxed text-[#475569] dark:text-[#94a3b8]">
                {nextStep}
              </p>
            )}

            <div className="mt-3 border-t border-[#dbeafe] pt-3 dark:border-[#1e4d8c]">
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Monto protegido
              </p>
              <p className="font-semibold text-[#f59e0b]">
                {escrow
                  ? formatPrice(Number(escrow.monto), escrow.moneda as "USD" | "VES")
                  : formatPrice(Number(order.total), moneda)}
              </p>
            </div>
          </section>

          {/* Action buttons */}
          <OrderActions
            orderId={id}
            orderStatus={order.status as OrderStatus}
            escrowStatus={escrow?.status ?? "pendiente"}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
}
