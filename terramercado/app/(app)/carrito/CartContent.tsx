"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Shield, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils/catalog";
import { updateCartItemAction, removeCartItemAction } from "./actions";
import type { CartItem, Product } from "@/types";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  orden: number;
}

interface StoreRef {
  nombre: string;
  slug: string;
}

interface ProductWithStore extends Product {
  store: StoreRef | null;
  product_images: ProductImage[];
}

export interface CartItemWithProduct extends Omit<CartItem, "product"> {
  product: ProductWithStore | null;
}

interface CartContentProps {
  cart: {
    id: string;
    cart_items: CartItemWithProduct[];
  };
}

export function CartContent({ cart }: CartContentProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useState<CartItemWithProduct[]>(
    cart.cart_items
  );

  function handleQuantityChange(itemId: string, newQty: number) {
    setOptimisticItems((prev) =>
      newQty <= 0
        ? prev.filter((i) => i.id !== itemId)
        : prev.map((i) => (i.id === itemId ? { ...i, cantidad: newQty } : i))
    );

    startTransition(async () => {
      await updateCartItemAction(itemId, newQty);
    });
  }

  function handleRemove(itemId: string) {
    setOptimisticItems((prev) => prev.filter((i) => i.id !== itemId));
    startTransition(async () => {
      await removeCartItemAction(itemId);
    });
  }

  const subtotal = optimisticItems.reduce((acc, item) => {
    return acc + (item.precio_unitario ?? 0) * item.cantidad;
  }, 0);

  const moneda = optimisticItems[0]?.product?.moneda ?? "USD";

  if (optimisticItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingCart className="h-14 w-14 text-[#94a3b8]" />
        <p className="text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
          Tu carrito está vacío
        </p>
        <Link
          href="/catalogo"
          className="rounded-[8px] bg-[#1e4d8c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240]"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* ── Items list ── */}
      <div className="flex-1 space-y-4">
        {optimisticItems.map((item) => {
          const product = item.product;
          const imageUrl = product?.product_images?.[0]?.url ?? null;

          return (
            <div
              key={item.id}
              className="flex gap-4 rounded-[12px] bg-white p-4 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]"
            >
              {/* Image placeholder */}
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[8px] bg-[#dbeafe] dark:bg-[#0d2240]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={product?.nombre ?? "Producto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-[#94a3b8]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                  {product?.nombre ?? "Producto"}
                </p>
                {product?.store && (
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                    {product.store.nombre}
                  </p>
                )}
                <p className="font-semibold text-[#f59e0b]">
                  {formatPrice(
                    item.precio_unitario * item.cantidad,
                    product?.moneda ?? "USD"
                  )}
                </p>

                {/* Quantity controls + remove */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.cantidad - 1)
                    }
                    disabled={isPending}
                    aria-label="Disminuir cantidad"
                    className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#dbeafe] transition-colors hover:bg-[#dbeafe] disabled:opacity-40 dark:border-[#1e4d8c] dark:hover:bg-[#1a3a6a]"
                  >
                    <Minus className="h-3 w-3 text-[#1e4d8c] dark:text-[#60a5f5]" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.cantidad + 1)
                    }
                    disabled={isPending}
                    aria-label="Aumentar cantidad"
                    className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#dbeafe] transition-colors hover:bg-[#dbeafe] disabled:opacity-40 dark:border-[#1e4d8c] dark:hover:bg-[#1a3a6a]"
                  >
                    <Plus className="h-3 w-3 text-[#1e4d8c] dark:text-[#60a5f5]" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={isPending}
                    aria-label="Eliminar producto"
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-[8px] text-[#ef4444] transition-colors hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Order summary ── */}
      <div className="w-full rounded-[12px] bg-white p-6 ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c] lg:w-80 lg:shrink-0">
        <h2 className="font-heading mb-4 text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
          Resumen del pedido
        </h2>

        <div className="space-y-2 border-b border-[#dbeafe] pb-4 dark:border-[#1e4d8c]">
          <div className="flex justify-between text-sm text-[#475569] dark:text-[#94a3b8]">
            <span>Subtotal ({optimisticItems.length} productos)</span>
            <span>{formatPrice(subtotal, moneda)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#475569] dark:text-[#94a3b8]">
            <span>Envío</span>
            <span className="text-[#f59e0b]">Por definir</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between font-semibold text-[#1e293b] dark:text-[#eff6ff]">
          <span>Total estimado</span>
          <span className="text-[#f59e0b]">{formatPrice(subtotal, moneda)}</span>
        </div>

        {/* Escrow note */}
        <div className="mt-4 flex items-start gap-2 rounded-[8px] bg-[#dbeafe] p-3 dark:bg-[#0d2240]">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#1e4d8c] dark:text-[#60a5f5]" />
          <p className="text-xs leading-relaxed text-[#1e4d8c] dark:text-[#93c5fd]">
            Este pedido usa <strong>escrow obligatorio</strong>. Tu pago queda
            protegido hasta que confirmes la entrega.
          </p>
        </div>

        <Link
          href="/checkout"
          className="mt-5 flex w-full items-center justify-center rounded-[8px] bg-[#f59e0b] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d97706]"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  );
}
