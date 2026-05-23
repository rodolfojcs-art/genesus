"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/catalog";

interface Variant {
  id: string;
  nombre: string;
  precio?: number;
}

interface AddToCartProps {
  productId: string;
  variants: Variant[];
  precio: number;
  moneda: "USD" | "VES";
}

export function AddToCart({ productId, variants, precio, moneda }: AddToCartProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentPrice =
    variants.find((v) => v.id === selectedVariant)?.precio ?? precio;

  async function handleAddToCart() {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get or create cart
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "activo")
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from("carts")
          .insert({ user_id: user.id, status: "activo" })
          .select("id")
          .single();
        cart = newCart;
      }

      if (!cart) {
        setMessage("Error al acceder al carrito.");
        return;
      }

      // Upsert cart item
      const { error } = await supabase.from("cart_items").upsert(
        {
          cart_id: cart.id,
          product_id: productId,
          variant_id: selectedVariant || null,
          cantidad: quantity,
          precio_unitario: currentPrice,
        },
        { onConflict: "cart_id,product_id,variant_id" }
      );

      if (error) {
        setMessage("No se pudo agregar al carrito.");
      } else {
        setMessage("¡Agregado al carrito!");
      }
    } catch {
      setMessage("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function handleBuyNow() {
    handleAddToCart().then(() => {
      router.push("/checkout");
    });
  }

  return (
    <div className="space-y-4">
      {/* Variant selector */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
            Presentación
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v.id)}
                className={`px-3 py-1.5 rounded-[8px] border text-sm font-medium transition-colors ${
                  selectedVariant === v.id
                    ? "border-[#1e4d8c] bg-[#dbeafe] dark:bg-[#1a3a6a] text-[#1e4d8c] dark:text-[#60a5f5]"
                    : "border-[#dbeafe] dark:border-[#1e4d8c] text-[#1e293b] dark:text-[#eff6ff] hover:border-[#60a5f5]"
                }`}
              >
                {v.nombre}
                {v.precio && v.precio !== precio && (
                  <span className="ml-1 text-[#94a3b8]">
                    ({formatPrice(v.precio, moneda)})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide block">
          Cantidad
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] flex items-center justify-center hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] disabled:opacity-40 transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3.5 w-3.5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          </button>
          <span className="w-10 text-center font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-8 w-8 rounded-[8px] border border-[#dbeafe] dark:border-[#1e4d8c] flex items-center justify-center hover:bg-[#dbeafe] dark:hover:bg-[#1a3a6a] transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3.5 w-3.5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#1e4d8c] hover:bg-[#0d2240] disabled:opacity-60 text-white font-semibold text-sm py-3 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          {loading ? "Agregando..." : "Agregar al carrito"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-white font-semibold text-sm py-3 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Comprar ahora
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <p
          className={`text-xs text-center font-medium ${
            message.includes("!") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
