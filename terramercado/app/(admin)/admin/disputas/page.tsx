import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Disputas · Admin",
};

interface DisputeWithRelations {
  id: string;
  created_at: string;
  motivo: string;
  descripcion?: string | null;
  order: {
    id: string;
    total: number;
    moneda: "USD" | "VES";
    comprador: { nombre: string } | null;
  } | null;
  iniciado: { nombre: string; apellido: string } | null;
}

export default async function AdminDisputasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: disputesRaw } = await supabase
    .from("disputes")
    .select(
      "*, order:orders(*, comprador:profiles!comprador_id(nombre)), iniciado:profiles!iniciado_por(nombre, apellido)"
    )
    .is("resuelto_at", null)
    .order("created_at", { ascending: false });

  const disputes: DisputeWithRelations[] =
    (disputesRaw as DisputeWithRelations[] | null) ?? [];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-[#0d2240] dark:text-white">
            Disputas abiertas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {disputes.length} disputa{disputes.length !== 1 ? "s" : ""} pendiente
            {disputes.length !== 1 ? "s" : ""}
          </p>
        </div>
        {disputes.length > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {disputes.length} abierta{disputes.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {disputes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border dark:border-white/10 py-16 text-center">
          <p className="text-lg font-medium text-[#0d2240] dark:text-white mb-1">
            Sin disputas abiertas
          </p>
          <p className="text-sm text-muted-foreground">Todo está en orden.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {disputes.map((dispute) => {
            const date = new Date(dispute.created_at).toLocaleDateString("es-VE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            const iniciador = dispute.iniciado
              ? `${dispute.iniciado.nombre} ${dispute.iniciado.apellido}`
              : "Desconocido";
            const comprador = dispute.order?.comprador?.nombre ?? "—";

            return (
              <Card key={dispute.id} className="border-red-200/50 dark:border-red-800/30">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <CardTitle className="text-base">{dispute.motivo}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Iniciada por {iniciador} · Comprador: {comprador} · {date}
                      </p>
                    </div>
                    <Badge variant="destructive">Abierta</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {dispute.descripcion && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {dispute.descripcion}
                    </p>
                  )}
                  {dispute.order && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Pedido: {dispute.order.id.slice(0, 8)}…
                    </p>
                  )}
                  <Link
                    href={`/admin/disputas/${dispute.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-[#1e4d8c] text-white text-sm font-medium px-4 py-2 hover:bg-[#1e4d8c]/90 transition-colors w-fit"
                  >
                    Resolver disputa →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
