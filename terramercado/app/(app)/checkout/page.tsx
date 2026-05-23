import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutFlow } from "./CheckoutFlow";
import type { CartItemWithProduct } from "@/app/(app)/carrito/CartContent";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cart } = await supabase
    .from("carts")
    .select(
      "*, cart_items(*, product:products(id, nombre, precio_base, moneda, store:stores(nombre, slug), product_images(*)))"
    )
    .eq("user_id", user.id)
    .single();

  const cartItems = (cart?.cart_items ?? []) as CartItemWithProduct[];

  if (cartItems.length === 0) {
    redirect("/carrito");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading mb-6 text-2xl font-semibold text-[#1e293b] dark:text-[#eff6ff]">
        Finalizar compra
      </h1>
      <CheckoutFlow cartItems={cartItems} />
    </div>
  );
}
