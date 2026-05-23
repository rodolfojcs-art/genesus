"use client";

import { useState, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CreditCard, ChevronRight, ChevronLeft, Check, Building2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/catalog";
import { createOrderAction } from "./actions";
import type { CartItemWithProduct } from "@/app/(app)/carrito/CartContent";

const VENEZUELA_STATES = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Distrito Capital",
  "Falcón",
  "Guárico",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Vargas",
  "Yaracuy",
  "Zulia",
];

type PaymentMethod = "transferencia" | "stripe" | "paypal";

interface CheckoutFlowProps {
  cartItems: CartItemWithProduct[];
}

const STEPS = ["Dirección", "Pago", "Confirmar"] as const;

export function CheckoutFlow({ cartItems }: CheckoutFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [actionState, formAction] = useActionState(createOrderAction, {});

  // Address form state
  const [address, setAddress] = useState({
    nombre_completo: "",
    telefono: "",
    estado: "",
    municipio: "",
    direccion: "",
    referencias: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("transferencia");

  const moneda = cartItems[0]?.product?.moneda ?? "USD";
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !address.nombre_completo ||
      !address.estado ||
      !address.municipio ||
      !address.direccion
    )
      return;
    setStep(1);
  }

  function handleConfirm() {
    if (isPending) return;
    const formData = new FormData();
    Object.entries(address).forEach(([key, value]) =>
      formData.set(key, value)
    );
    formData.set("payment_method", paymentMethod);

    startTransition(async () => {
      const result = await createOrderAction({}, formData);
      if (result.success && result.orderId) {
        router.push(`/pedidos/${result.orderId}?nuevo=true`);
      }
    });
  }

  // ── Progress bar ───────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl">
      {/* Steps indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                idx < step
                  ? "bg-[#1e4d8c] text-white"
                  : idx === step
                    ? "bg-[#f59e0b] text-white"
                    : "bg-[#dbeafe] text-[#64748b] dark:bg-[#1a3a6a] dark:text-[#94a3b8]"
              }`}
            >
              {idx < step ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`hidden text-xs font-medium sm:block ${
                idx === step
                  ? "text-[#f59e0b]"
                  : "text-[#64748b] dark:text-[#94a3b8]"
              }`}
            >
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${
                  idx < step
                    ? "bg-[#1e4d8c]"
                    : "bg-[#dbeafe] dark:bg-[#1e4d8c]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0: Dirección ────────────────────────────────── */}
      {step === 0 && (
        <form
          onSubmit={handleAddressSubmit}
          className="space-y-4 rounded-[12px] bg-white p-6 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]"
        >
          <h2 className="font-heading text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            Dirección de entrega
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Nombre completo *
              </label>
              <input
                required
                value={address.nombre_completo}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, nombre_completo: e.target.value }))
                }
                placeholder="Tu nombre completo"
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-transparent px-3 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:text-[#eff6ff]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Teléfono
              </label>
              <input
                value={address.telefono}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, telefono: e.target.value }))
                }
                placeholder="+58 412 000 0000"
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-transparent px-3 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:text-[#eff6ff]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Estado *
              </label>
              <select
                required
                value={address.estado}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, estado: e.target.value }))
                }
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-white px-3 text-sm text-[#1e293b] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:bg-[#0d2240] dark:text-[#eff6ff]"
              >
                <option value="">Seleccionar estado…</option>
                {VENEZUELA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Municipio *
              </label>
              <input
                required
                value={address.municipio}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, municipio: e.target.value }))
                }
                placeholder="Municipio"
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-transparent px-3 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:text-[#eff6ff]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Dirección *
              </label>
              <input
                required
                value={address.direccion}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, direccion: e.target.value }))
                }
                placeholder="Calle, número, urbanización"
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-transparent px-3 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:text-[#eff6ff]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Referencias
              </label>
              <input
                value={address.referencias}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, referencias: e.target.value }))
                }
                placeholder="Punto de referencia, color de casa, etc."
                className="h-10 w-full rounded-[8px] border border-[#dbeafe] bg-transparent px-3 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-colors focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 dark:border-[#1e4d8c] dark:text-[#eff6ff]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#1e4d8c] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240]"
          >
            Continuar
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* ── Step 1: Método de pago ───────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4 rounded-[12px] bg-white p-6 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
          <h2 className="font-heading text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            Método de pago
          </h2>

          {/* Escrow explanation */}
          <div className="flex items-start gap-3 rounded-[8px] bg-[#dbeafe] p-3 dark:bg-[#0d2240]">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#1e4d8c] dark:text-[#60a5f5]" />
            <p className="text-sm leading-relaxed text-[#1e4d8c] dark:text-[#93c5fd]">
              Tu pago va a <strong>escrow TerraMercado</strong>. El vendedor
              recibe el dinero solo cuando confirmas la entrega.
            </p>
          </div>

          {/* Payment options */}
          <div className="space-y-3">
            {/* Transferencia bancaria */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-[8px] border-2 p-4 transition-colors ${
                paymentMethod === "transferencia"
                  ? "border-[#1e4d8c] bg-[#dbeafe]/50 dark:border-[#3b82f6] dark:bg-[#1a3a6a]/50"
                  : "border-[#dbeafe] hover:border-[#94a3b8] dark:border-[#1e4d8c]"
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value="transferencia"
                checked={paymentMethod === "transferencia"}
                onChange={() => setPaymentMethod("transferencia")}
                className="mt-1 shrink-0 accent-[#1e4d8c]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
                  <span className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                    Transferencia bancaria
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    Disponible
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
                  Transferencia local en Venezuela (VES / USD)
                </p>
                {paymentMethod === "transferencia" && (
                  <div className="mt-3 rounded-[8px] bg-white p-3 text-xs ring-1 ring-[#dbeafe] dark:bg-[#0d2240] dark:ring-[#1e4d8c]">
                    <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                      Datos bancarios
                    </p>
                    <p className="mt-1 text-[#475569] dark:text-[#94a3b8]">
                      Banco: Banco de Venezuela
                    </p>
                    <p className="text-[#475569] dark:text-[#94a3b8]">
                      Cuenta: 0102-xxxx-xxxx-xxxx
                    </p>
                    <p className="text-[#475569] dark:text-[#94a3b8]">
                      RIF: J-xxxxxxxxx-x
                    </p>
                    <p className="mt-1 text-[#f59e0b]">
                      Envía el comprobante al vendedor por mensajería.
                    </p>
                  </div>
                )}
              </div>
            </label>

            {/* Stripe — próximamente */}
            <label className="flex cursor-not-allowed items-start gap-3 rounded-[8px] border-2 border-[#dbeafe] p-4 opacity-50 dark:border-[#1e4d8c]">
              <input
                type="radio"
                name="payment_method"
                value="stripe"
                disabled
                className="mt-1 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#64748b]" />
                  <span className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                    Tarjeta de crédito (Stripe)
                  </span>
                  <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs font-medium text-[#64748b] dark:bg-[#1a3a6a] dark:text-[#94a3b8]">
                    Próximamente — Sprint 6
                  </span>
                </div>
              </div>
            </label>

            {/* PayPal — próximamente */}
            <label className="flex cursor-not-allowed items-start gap-3 rounded-[8px] border-2 border-[#dbeafe] p-4 opacity-50 dark:border-[#1e4d8c]">
              <input
                type="radio"
                name="payment_method"
                value="paypal"
                disabled
                className="mt-1 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                    PayPal
                  </span>
                  <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs font-medium text-[#64748b] dark:bg-[#1a3a6a] dark:text-[#94a3b8]">
                    Próximamente — Sprint 6
                  </span>
                </div>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1 rounded-[8px] border border-[#dbeafe] px-4 py-2.5 text-sm font-semibold text-[#1e293b] transition-colors hover:bg-[#dbeafe] dark:border-[#1e4d8c] dark:text-[#eff6ff] dark:hover:bg-[#1a3a6a]"
            >
              <ChevronLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#1e4d8c] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240]"
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Confirmar pedido ─────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-[12px] bg-white p-6 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
            <h2 className="font-heading mb-4 text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              Confirmar pedido
            </h2>

            {/* Items summary */}
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#475569] dark:text-[#94a3b8]">
                    {item.product?.nombre ?? "Producto"} × {item.cantidad}
                  </span>
                  <span className="font-medium text-[#1e293b] dark:text-[#eff6ff]">
                    {formatPrice(
                      item.precio_unitario * item.cantidad,
                      item.product?.moneda ?? "USD"
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-[#dbeafe] pt-3 dark:border-[#1e4d8c]">
              <div className="flex justify-between font-semibold">
                <span className="text-[#1e293b] dark:text-[#eff6ff]">
                  Total
                </span>
                <span className="text-[#f59e0b]">
                  {formatPrice(subtotal, moneda)}
                </span>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-4 border-t border-[#dbeafe] pt-4 dark:border-[#1e4d8c]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Método de pago
              </p>
              <p className="mt-1 text-sm text-[#1e293b] dark:text-[#eff6ff]">
                {paymentMethod === "transferencia"
                  ? "Transferencia bancaria (Venezuela)"
                  : paymentMethod}
              </p>
            </div>

            {/* Address */}
            <div className="mt-4 border-t border-[#dbeafe] pt-4 dark:border-[#1e4d8c]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">
                Dirección de entrega
              </p>
              <p className="mt-1 text-sm text-[#1e293b] dark:text-[#eff6ff]">
                {address.nombre_completo}
              </p>
              <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                {address.direccion}, {address.municipio}, {address.estado}
              </p>
              {address.referencias && (
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                  {address.referencias}
                </p>
              )}
            </div>
          </div>

          {/* Error state from action */}
          {actionState?.error && (
            <p className="rounded-[8px] bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {actionState.error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 rounded-[8px] border border-[#dbeafe] px-4 py-2.5 text-sm font-semibold text-[#1e293b] transition-colors hover:bg-[#dbeafe] dark:border-[#1e4d8c] dark:text-[#eff6ff] dark:hover:bg-[#1a3a6a]"
            >
              <ChevronLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#f59e0b] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d97706] disabled:opacity-60"
            >
              {isPending ? "Procesando…" : "Confirmar y pagar"}
              {!isPending && <Check className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
