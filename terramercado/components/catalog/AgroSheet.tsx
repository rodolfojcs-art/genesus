import { Leaf, Droplets, AlertTriangle, Shield } from "lucide-react";

interface AgroSheetProps {
  principioActivo?: string | null;
  dosisRecomendada?: string | null;
  periodoCarencia?: string | null;
  contraindicaciones?: string | null;
  certificaciones?: string[] | null;
  cultivoObjetivo?: string[] | null;
  especieObjetivo?: string[] | null;
  ciclo?: string[] | null;
}

interface SheetRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SheetRow({ icon, label, value }: SheetRowProps) {
  return (
    <div className="flex gap-3 items-start">
      <span className="mt-0.5 flex-shrink-0 text-[#1e4d8c] dark:text-[#60a5f5]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm text-[#1e293b] dark:text-[#eff6ff]">{value}</p>
      </div>
    </div>
  );
}

export function AgroSheet({
  principioActivo,
  dosisRecomendada,
  periodoCarencia,
  contraindicaciones,
  certificaciones,
  cultivoObjetivo,
  especieObjetivo,
  ciclo,
}: AgroSheetProps) {
  const hasData =
    principioActivo ||
    dosisRecomendada ||
    periodoCarencia ||
    contraindicaciones ||
    (certificaciones && certificaciones.length > 0) ||
    (cultivoObjetivo && cultivoObjetivo.length > 0) ||
    (especieObjetivo && especieObjetivo.length > 0) ||
    (ciclo && ciclo.length > 0);

  if (!hasData) {
    return (
      <div className="rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-[#eff6ff] dark:bg-[#1a3a6a] p-4">
        <p className="text-sm text-[#94a3b8] italic">
          No hay información técnica disponible para este producto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#dbeafe] dark:border-[#1e4d8c] bg-[#eff6ff] dark:bg-[#1a3a6a] p-4 sm:p-5">
      <h3 className="font-heading font-semibold text-[#0d2240] dark:text-[#eff6ff] mb-4">
        Ficha Agronómica / Veterinaria
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principioActivo && (
          <SheetRow
            icon={<Leaf className="h-4 w-4" />}
            label="Principio activo"
            value={principioActivo}
          />
        )}

        {dosisRecomendada && (
          <SheetRow
            icon={<Droplets className="h-4 w-4" />}
            label="Dosis recomendada"
            value={dosisRecomendada}
          />
        )}

        {periodoCarencia && (
          <SheetRow
            icon={<Shield className="h-4 w-4" />}
            label="Período de carencia"
            value={periodoCarencia}
          />
        )}

        {contraindicaciones && (
          <SheetRow
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            label="Contraindicaciones"
            value={contraindicaciones}
          />
        )}

        {cultivoObjetivo && cultivoObjetivo.length > 0 && (
          <SheetRow
            icon={<Leaf className="h-4 w-4" />}
            label="Cultivo objetivo"
            value={cultivoObjetivo.join(", ")}
          />
        )}

        {especieObjetivo && especieObjetivo.length > 0 && (
          <SheetRow
            icon={<Leaf className="h-4 w-4" />}
            label="Especie objetivo"
            value={especieObjetivo.join(", ")}
          />
        )}

        {ciclo && ciclo.length > 0 && (
          <SheetRow
            icon={<Leaf className="h-4 w-4" />}
            label="Ciclo de aplicación"
            value={ciclo.join(", ")}
          />
        )}

        {certificaciones && certificaciones.length > 0 && (
          <SheetRow
            icon={<Shield className="h-4 w-4" />}
            label="Certificaciones"
            value={certificaciones.join(", ")}
          />
        )}
      </div>
    </div>
  );
}
