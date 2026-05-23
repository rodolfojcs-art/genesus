import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/catalog";
import { DisputeResolveForm } from "./DisputeResolveForm";

export const metadata: Metadata = {
  title: "Resolver Disputa · Admin",
};

interface DisputeDetail {
  id: string;
  created_at: string;
  motivo: string;
  descripcion?: string | null;
  evidencias?: string[] | null;
  resolucion?: string | null;
  resuelto_at?: string | null;
  order_id: string;
  order: {
    id: string;
    total: number;
    moneda: "USD" | "VES";
    status: string;
    comprador: { nombre: string; apellido: string; email: string } | null;
    vendedor: { nombre: string; apellido: string; email: string } | null;
    store: { nombre: string } | null;
  } | null;
  iniciado: { nombre: string; apellido: string } | null;
}

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: disputeRaw } = await supabase
    .from("disputes")
    .select(
      `*,
      order:orders(
        id, total, moneda, status,
        comprador:profiles!comprador_id(nombre, apellido, email),
        vendedor:profiles!vendedor_id(nombre, apellido, email),
        store:stores(nombre)
      ),
      iniciado:profiles!iniciado_por(nombre, apellido)`
    )
    .eq("id", id)
    .single();

  if (!disputeRaw) notFound();

  const dispute = disputeRaw as unknown as DisputeDetail;

  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <a
          href="/admin/disputas"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Disputas
        </a>
        {dispute.resuelto_at ? (
          <Badge variant="secondary">Resuelta</Badge>
        ) : (
          <Badge variant="destructive">Abierta</Badge>
        )}
      </div>

      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0d2240] dark:text-white">
          {dispute.motivo}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Disputa #{id.slice(0, 8)}… ·{" "}
          {new Date(dispute.created_at).toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Order info */}
      {dispute.order && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Información del pedido</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Pedido</p>
              <p className="font-mono">{dispute.order.id.slice(0, 12)}…</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-mono font-semibold">
                {formatPrice(dispute.order.total, dispute.order.moneda)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Comprador</p>
              <p>
                {dispute.order.comprador
                  ? `${dispute.order.comprador.nombre} ${dispute.order.comprador.apellido}`
                  : "—"}
              </p>
              {dispute.order.comprador?.email && (
                <p className="text-xs text-muted-foreground">
                  {dispute.order.comprador.email}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendedor</p>
              <p>
                {dispute.order.vendedor
                  ? `${dispute.order.vendedor.nombre} ${dispute.order.vendedor.apellido}`
                  : "—"}
              </p>
              {dispute.order.vendedor?.email && (
                <p className="text-xs text-muted-foreground">
                  {dispute.order.vendedor.email}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tienda</p>
              <p>{dispute.order.store?.nombre ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estado del pedido</p>
              <Badge variant="outline">{dispute.order.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivo y descripción */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Descripción de la disputa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Iniciada por</p>
            <p className="text-sm">
              {dispute.iniciado
                ? `${dispute.iniciado.nombre} ${dispute.iniciado.apellido}`
                : "—"}
            </p>
          </div>
          {dispute.descripcion && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Descripción</p>
              <p className="text-sm text-muted-foreground">{dispute.descripcion}</p>
            </div>
          )}
          {dispute.evidencias && dispute.evidencias.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Evidencias ({dispute.evidencias.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {dispute.evidencias.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-muted dark:bg-white/5 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Evidencia ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolution form or resolved state */}
      {dispute.resuelto_at ? (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-sm text-green-700 dark:text-green-400">
              Disputa resuelta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{dispute.resolucion}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resolver disputa</CardTitle>
          </CardHeader>
          <CardContent>
            <DisputeResolveForm disputeId={id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
