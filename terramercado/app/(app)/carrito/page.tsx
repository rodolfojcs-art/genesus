import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CartContent } from "./CartContent";
import type { CartItemWithProduct } from "./CartContent";

export default async function CarritoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // layout redirects unauthenticated users
  }

  const { data: cart } = await supabase
    .from("carts")
    .select(
      "*, cart_items(*, product:products(id, nombre, precio_base, moneda, store:stores(nombre, slug), product_images(*)))"
    )
    .eq("user_id", user.id)
    .single();

  const cartItems = (cart?.cart_items ?? []) as CartItemWithProduct[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading mb-6 text-2xl font-semibold text-[#1e293b] dark:text-[#eff6ff]">
        Tu carrito
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[12px] bg-white py-20 text-center ring-1 ring-[#dbeafe] dark:bg-[#1a2e4a] dark:ring-[#1e4d8c]">
          <ShoppingCart className="h-14 w-14 text-[#94a3b8]" />
          <p className="text-lg font-semibold text-[#1e293b] dark:text-[#eff6ff]">
            Tu carrito está vacío
          </p>
          <p className="max-w-xs text-sm text-[#64748b] dark:text-[#94a3b8]">
            Explora nuestro catálogo y agrega productos para comenzar.
          </p>
          <Link
            href="/catalogo"
            className="rounded-[8px] bg-[#1e4d8c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2240]"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <CartContent
          cart={{
            id: cart!.id as string,
            cart_items: cartItems,
          }}
        />
      )}
    </div>
  );
}
