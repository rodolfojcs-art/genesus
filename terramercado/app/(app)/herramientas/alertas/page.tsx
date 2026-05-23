import { redirect } from "next/navigation";
import { Bell, Package, DollarSign, AlertCircle, RefreshCw, MessageSquare, Loader } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/types";

export const metadata = {
  title: "TerraAlertas",
};

const TIPO_CONFIG: Record<
  Notification["tipo"],
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  precio: { label: "Precio", Icon: DollarSign },
  stock: { label: "Stock", Icon: Package },
  disputa: { label: "Disputa", Icon: AlertCircle },
  ciclo: { label: "Ciclo", Icon: RefreshCw },
  pedido: { label: "Pedido", Icon: Loader },
  mensaje: { label: "Mensaje", Icon: MessageSquare },
};

async function markAllReadAction(): Promise<void> {
  "use server";
  const { createClient: createServerClient } = await import("@/lib/supabase/server");
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("notifications")
    .update({ leida: true })
    .eq("user_id", user.id)
    .eq("leida", false);
}

export default async function AlertasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (notifications as Notification[]) ?? [];
  const unreadCount = items.filter((n) => !n.leida).length;

  // Group by tipo
  const grouped = items.reduce<Partial<Record<Notification["tipo"], Notification[]>>>((acc, n) => {
    const arr = acc[n.tipo] ?? [];
    arr.push(n);
    acc[n.tipo] = arr;
    return acc;
  }, {});

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
            <Bell className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
              TerraAlertas
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-[#94a3b8]">{unreadCount} sin leer</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <form action={markAllReadAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-xs border-[#1e4d8c] text-[#1e4d8c] dark:border-[#60a5f5] dark:text-[#60a5f5]"
            >
              Marcar todas como leídas
            </Button>
          </form>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Bell className="h-12 w-12 text-[#93c5fd]" />
          <p className="text-[#94a3b8]">No tienes notificaciones.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(grouped) as [Notification["tipo"], Notification[]][]).map(
            ([tipo, nots]) => {
              const config = TIPO_CONFIG[tipo];
              const Icon = config.Icon;
              return (
                <section key={tipo} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
                    <h2 className="text-sm font-semibold text-[#1e293b] dark:text-[#eff6ff]">
                      {config.label}
                    </h2>
                    <Badge className="text-[10px] px-1.5 py-0 bg-[#eff6ff] dark:bg-[#1a3a6a] text-[#94a3b8] border-0">
                      {nots.length}
                    </Badge>
                  </div>

                  <ul className="space-y-2">
                    {nots.map((n) => (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 rounded-xl p-3 border transition-colors ${
                          n.leida
                            ? "border-[#dbeafe] dark:border-[rgba(96,165,245,0.1)] bg-white dark:bg-transparent"
                            : "border-[#bfdbfe] dark:border-[rgba(96,165,245,0.25)] bg-[#eff6ff] dark:bg-[#1a3a6a]/30"
                        }`}
                      >
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
                            {n.titulo}
                          </p>
                          <p className="text-xs text-[#94a3b8]">{n.contenido}</p>
                          <p className="text-[11px] text-[#cbd5e1]">
                            {format(new Date(n.created_at), "d MMM yyyy HH:mm", { locale: es })}
                          </p>
                        </div>
                        {!n.leida && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1e4d8c] dark:bg-[#60a5f5]" />
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
