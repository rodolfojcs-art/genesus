import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface MessageRow {
  id: string;
  contenido: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  leido: boolean;
  product_id?: string | null;
  sender: { nombre: string; apellido: string; avatar_url?: string | null } | null;
  receiver: { nombre: string; apellido: string; avatar_url?: string | null } | null;
  product: { nombre: string } | null;
}

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string | null;
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  productName?: string | null;
}

function Initials({ name }: { name: string }) {
  const parts = name.split(" ");
  const initials =
    parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
      : parts[0].charAt(0);
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e4d8c] text-sm font-semibold text-white uppercase">
      {initials}
    </span>
  );
}

export default async function MensajesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: msgs } = await supabase
    .from("messages")
    .select(
      "*, sender:profiles!sender_id(nombre, apellido, avatar_url), receiver:profiles!receiver_id(nombre, apellido, avatar_url), product:products(nombre)"
    )
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  // Group by conversation partner (other user's ID)
  const convMap = new Map<string, Conversation>();

  for (const msg of (msgs as MessageRow[]) ?? []) {
    const isOwn = msg.sender_id === user.id;
    const partnerId = isOwn ? msg.receiver_id : msg.sender_id;
    const partnerProfile = isOwn ? msg.receiver : msg.sender;
    const partnerName = partnerProfile
      ? `${partnerProfile.nombre} ${partnerProfile.apellido}`
      : "Usuario";

    if (!convMap.has(partnerId)) {
      convMap.set(partnerId, {
        partnerId,
        partnerName,
        partnerAvatar: partnerProfile?.avatar_url,
        lastMessage: msg.contenido,
        lastDate: msg.created_at,
        unreadCount: !isOwn && !msg.leido ? 1 : 0,
        productName: msg.product?.nombre,
      });
    } else {
      const conv = convMap.get(partnerId)!;
      if (!isOwn && !msg.leido) {
        conv.unreadCount += 1;
      }
    }
  }

  const conversations = Array.from(convMap.values());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff] mb-6">
        Mensajes
      </h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <MessageSquare className="h-12 w-12 text-[#93c5fd]" />
          <p className="text-[#94a3b8]">No tienes conversaciones aún.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#dbeafe] dark:divide-[rgba(96,165,245,0.1)]">
          {conversations.map((conv) => (
            <li key={conv.partnerId}>
              <Link
                href={`/mensajes/${conv.partnerId}`}
                className="flex items-center gap-3 py-4 hover:bg-[#dbeafe] dark:hover:bg-[rgba(30,77,140,0.3)] rounded-lg px-2 transition-colors"
              >
                {conv.partnerAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={conv.partnerAvatar}
                    alt={conv.partnerName}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <Initials name={conv.partnerName} />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-[#1e293b] dark:text-[#eff6ff] truncate">
                      {conv.partnerName}
                    </span>
                    <span className="text-[11px] text-[#94a3b8] shrink-0">
                      {format(new Date(conv.lastDate), "d MMM", { locale: es })}
                    </span>
                  </div>
                  {conv.productName && (
                    <p className="text-[11px] text-[#60a5f5] truncate">{conv.productName}</p>
                  )}
                  <p className="text-xs text-[#94a3b8] truncate">{conv.lastMessage}</p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1e4d8c] text-[10px] font-bold text-white">
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
