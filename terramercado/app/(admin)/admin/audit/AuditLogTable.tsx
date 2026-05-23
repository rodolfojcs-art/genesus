"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AuditLogEntry {
  id: string;
  created_at: string;
  actor_id: string | null;
  accion: string;
  tabla: string;
  registro_id: string | null;
  ip_address: string | null;
  actor: { nombre: string; apellido: string } | null;
}

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  tablas: string[];
}

const TABLA_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  disputes: "destructive",
  orders: "secondary",
  profiles: "default",
  products: "outline",
  audit_log: "outline",
};

export function AuditLogTable({ logs, tablas }: AuditLogTableProps) {
  const [selectedTabla, setSelectedTabla] = useState<string>("todas");

  const filtered =
    selectedTabla === "todas" ? logs : logs.filter((l) => l.tabla === selectedTabla);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Filtrar por tabla:</span>
        <button
          type="button"
          onClick={() => setSelectedTabla("todas")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selectedTabla === "todas"
              ? "bg-[#1e4d8c] text-white"
              : "bg-muted dark:bg-white/10 text-muted-foreground hover:text-foreground"
          }`}
        >
          Todas
        </button>
        {tablas.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedTabla(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedTabla === t
                ? "bg-[#1e4d8c] text-white"
                : "bg-muted dark:bg-white/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Sin entradas para esta tabla
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border dark:border-white/10 text-left">
                <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">Actor</th>
                <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">Acción</th>
                <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">Tabla</th>
                <th className="pb-2 pr-4 font-medium text-muted-foreground text-xs">Fecha</th>
                <th className="pb-2 font-medium text-muted-foreground text-xs">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const date = new Date(log.created_at).toLocaleDateString("es-VE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const actorName = log.actor
                  ? `${log.actor.nombre} ${log.actor.apellido}`
                  : log.actor_id
                  ? log.actor_id.slice(0, 8) + "…"
                  : "Sistema";

                return (
                  <tr
                    key={log.id}
                    className="border-b border-border/50 dark:border-white/5 last:border-0"
                  >
                    <td className="py-2 pr-4 text-sm">{actorName}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                      {log.accion}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={TABLA_VARIANT[log.tabla] ?? "outline"}>
                        {log.tabla}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground">{date}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {log.ip_address ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
