import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "./MessageThread";
import type { Profile } from "@/types";

interface MessageThreadPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ product?: string }>;
}

export default async function MessageThreadPage({
  params,
  searchParams,
}: MessageThreadPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { id: otherId } = await params;
  const sp = searchParams ? await searchParams : {};
  const productId = sp?.product;

  // Fetch other user's profile
  const { data: otherUser } = await supabase
    .from("profiles")
    .select("id, nombre, apellido, avatar_url")
    .eq("id", otherId)
    .single();

  if (!otherUser) notFound();

  // Fetch message thread between current user and other user
  const { data: messages } = await supabase
    .from("messages")
    .select("id, contenido, sender_id, receiver_id, created_at, leido, product_id")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  // Mark received messages as read
  await supabase
    .from("messages")
    .update({ leido: true })
    .eq("sender_id", otherId)
    .eq("receiver_id", user.id)
    .eq("leido", false);

  return (
    <div className="container mx-auto max-w-2xl px-0 sm:px-4 py-0 sm:py-8">
      <MessageThread
        messages={messages ?? []}
        currentUserId={user.id}
        otherUser={otherUser as Pick<Profile, "id" | "nombre" | "apellido" | "avatar_url">}
        productId={productId}
      />
    </div>
  );
}
