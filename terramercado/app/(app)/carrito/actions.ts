"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: boolean;
};

/** Update a cart item's quantity. Deletes the item if cantidad = 0. */
export async function updateCartItemAction(
  cartItemId: string,
  cantidad: number
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verify ownership: cart must belong to the current user
  const { data: item } = await supabase
    .from("cart_items")
    .select("id, cart:carts(user_id)")
    .eq("id", cartItemId)
    .single();

  type CartRef = { user_id: string } | null;
  const cart = (item?.cart as unknown) as CartRef;

  if (!item || cart?.user_id !== user.id) {
    return { error: "Item no encontrado" };
  }

  if (cantidad <= 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) return { error: "No se pudo eliminar el item" };
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ cantidad })
      .eq("id", cartItemId);

    if (error) return { error: "No se pudo actualizar la cantidad" };
  }

  revalidatePath("/carrito");
  return { success: true };
}

/** Remove a single cart item. */
export async function removeCartItemAction(
  cartItemId: string
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verify ownership
  const { data: item } = await supabase
    .from("cart_items")
    .select("id, cart:carts(user_id)")
    .eq("id", cartItemId)
    .single();

  type CartRef = { user_id: string } | null;
  const cart = (item?.cart as unknown) as CartRef;

  if (!item || cart?.user_id !== user.id) {
    return { error: "Item no encontrado" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) return { error: "No se pudo eliminar el item" };

  revalidatePath("/carrito");
  return { success: true };
}

/** Clear all items from the current user's cart. */
export async function clearCartAction(): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!cart) return { error: "Carrito no encontrado" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (error) return { error: "No se pudo vaciar el carrito" };

  revalidatePath("/carrito");
  return { success: true };
}
