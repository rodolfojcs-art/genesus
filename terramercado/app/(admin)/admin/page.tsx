import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/catalog";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

interface RecentOrder {
  id: string;
  created_at: string;
  status: string;
  total: number;
  moneda: "USD" | "VES";
  comprador: { nombre: string; apellido: string } | null;
  store: { nombre: string } | null;
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  creado: "outline",
  pagado_en_escrow: "secondary",
  en_preparacion: "secondary",
  en_transito: "default",
  entregado: "default",
  liberado: "default",
  en_disputa: "destructive",
  reembolsado: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  creado: "Creado",
  pagado_en_escrow: "En escrow",
  en_preparacion: "Preparando",
  en_transito: "En tránsito",
  entregado: "Entregado",
  liberado: "Liberado",
  en_disputa: "Disputa",
  reembolsado: "Reembolsado",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [usersResult, productsResult, ordersResult, disputesResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("disputes")
        .select("id", { count: "exact", head: true })
        .is("resuelto_at", null),
    ]);

  const usersCount = usersResult.count ?? 0;
  const productsCount = productsResult.count ?? 0;
  const ordersCount = ordersResult.count ?? 0;
  const disputesCount = disputesResult.count ?? 0;

  const { data: recentOrdersRaw } = await supabase
    .from("orders")
    .select(
      "*, comprador:profiles!comprador_id(nombre, apellido), store:stores(nombre)"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  const recentOrders: RecentOrder[] = (recentOrdersRaw as RecentOrder[] | null) ?? [];

  const stats = [
    {
      label: "Usuarios registrados",
      value: usersCount.toLocaleString("es-VE"),
      color: "text-[#1e4d8c]",
    },
    {
      label: "Productos activos",
      value: productsCount.toLocaleString("es-VE"),
      color: "text-[#1e4d8c]",
    },
    {
      label: "Pedidos totales",
      value: ordersCount.toLocaleString("es-VE"),
      color: "text-[#1e4d8c]",
    },
    {
      label: "Disputas abiertas",
      value: disputesCount.toLocaleString("es-VE"),
      color: disputesCount > 0 ? "text-red-600 dark:text-red-400" : "text-[#1e4d8c]",
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0d2240] dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen operativo de TerraMercado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`font-mono text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin pedidos aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border dark:border-white/10 text-left">
                    <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">
                      Pedido
                    </th>
                    <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">
                      Comprador
                    </th>
                    <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">
                      Tienda
                    </th>
                    <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">
                      Total
                    </th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 dark:border-white/5 last:border-0"
                    >
                      <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                        {order.id.slice(0, 8)}…
                      </td>
                      <td className="py-2 pr-4">
                        {order.comprador
                          ? `${order.comprador.nombre} ${order.comprador.apellido}`
                          : "—"}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {order.store?.nombre ?? "—"}
                      </td>
                      <td className="py-2 pr-4 font-mono font-medium">
                        {formatPrice(order.total, order.moneda)}
                      </td>
                      <td className="py-2">
                        <Badge variant={STATUS_VARIANT[order.status] ?? "outline"}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
