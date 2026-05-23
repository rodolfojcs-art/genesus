import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLogTable } from "./AuditLogTable";

export const metadata: Metadata = {
  title: "Audit Log · Admin",
};

interface AuditLogEntry {
  id: string;
  created_at: string;
  actor_id: string | null;
  accion: string;
  tabla: string;
  registro_id: string | null;
  datos_previos: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  ip_address: string | null;
  actor: { nombre: string; apellido: string } | null;
}

export default async function AuditLogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: logsRaw } = await supabase
    .from("audit_log")
    .select("*, actor:profiles(nombre, apellido)")
    .order("created_at", { ascending: false })
    .limit(100);

  const logs: AuditLogEntry[] = (logsRaw as AuditLogEntry[] | null) ?? [];

  const tablas = Array.from(new Set(logs.map((l) => l.tabla))).sort();

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-[#0d2240] dark:text-white">
          Audit Log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Últimas 100 entradas de auditoría del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registro de actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogTable logs={logs} tablas={tablas} />
        </CardContent>
      </Card>
    </div>
  );
}
