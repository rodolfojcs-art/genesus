import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "TerraPrecios",
};

interface PriceRow {
  producto: string;
  categoria: string;
  precio: number;
  moneda: "USD";
  unidad: string;
  variacion: number; // percentage, positive = up
  tendencia: "up" | "down" | "stable";
}

const SAMPLE_PRICES: PriceRow[] = [
  {
    producto: "Fertilizante NPK 15-15-15",
    categoria: "Fertilizantes",
    precio: 42.5,
    moneda: "USD",
    unidad: "saco 50kg",
    variacion: 2.3,
    tendencia: "up",
  },
  {
    producto: "Glifosato 48% SL",
    categoria: "Herbicidas",
    precio: 8.9,
    moneda: "USD",
    unidad: "litro",
    variacion: -1.5,
    tendencia: "down",
  },
  {
    producto: "Urea 46%",
    categoria: "Fertilizantes",
    precio: 38.0,
    moneda: "USD",
    unidad: "saco 50kg",
    variacion: 0,
    tendencia: "stable",
  },
  {
    producto: "Semilla de Maíz Híbrido",
    categoria: "Semillas",
    precio: 55.0,
    moneda: "USD",
    unidad: "saco 25kg",
    variacion: 4.1,
    tendencia: "up",
  },
  {
    producto: "Cipermectrina 25% EC",
    categoria: "Insecticidas",
    precio: 12.5,
    moneda: "USD",
    unidad: "litro",
    variacion: -0.8,
    tendencia: "down",
  },
  {
    producto: "Sulfato de Amonio",
    categoria: "Fertilizantes",
    precio: 28.0,
    moneda: "USD",
    unidad: "saco 50kg",
    variacion: 0,
    tendencia: "stable",
  },
];

function TrendIcon({ tendencia }: { tendencia: PriceRow["tendencia"] }) {
  if (tendencia === "up")
    return <TrendingUp className="h-4 w-4 text-[#ef4444]" />;
  if (tendencia === "down")
    return <TrendingDown className="h-4 w-4 text-[#22c55e]" />;
  return <Minus className="h-4 w-4 text-[#94a3b8]" />;
}

export default function PreciosPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
          <TrendingUp className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
            TerraPrecios
          </h1>
          <p className="text-sm text-[#94a3b8]">Monitor de precios de insumos agropecuarios</p>
        </div>
      </div>

      <Badge className="text-xs bg-[#fef3c7] dark:bg-[#78350f]/40 text-[#92400e] dark:text-[#f59e0b] border-0 rounded-full px-3 py-1">
        Datos de referencia — actualización semanal próximamente
      </Badge>

      {/* Price table */}
      <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl overflow-hidden">
        {/* Mobile: stacked cards */}
        <div className="sm:hidden divide-y divide-[#f1f5f9] dark:divide-[rgba(96,165,245,0.08)]">
          {SAMPLE_PRICES.map((row, i) => (
            <div key={i} className="p-4 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
                    {row.producto}
                  </p>
                  <Badge className="mt-0.5 text-[10px] px-1.5 py-0 bg-[#eff6ff] dark:bg-[#1a3a6a] text-[#94a3b8] border-0">
                    {row.categoria}
                  </Badge>
                </div>
                <TrendIcon tendencia={row.tendencia} />
              </div>
              <div className="flex items-center justify-between">
                <span className="terra-score text-lg font-bold text-[#f59e0b]">
                  ${row.precio.toFixed(2)}
                </span>
                <span className="text-xs text-[#94a3b8]">por {row.unidad}</span>
              </div>
              {row.variacion !== 0 && (
                <p
                  className={`text-xs ${
                    row.variacion > 0 ? "text-[#ef4444]" : "text-[#22c55e]"
                  }`}
                >
                  {row.variacion > 0 ? "+" : ""}
                  {row.variacion}% esta semana
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#dbeafe] dark:border-[rgba(96,165,245,0.1)] bg-[#f8fafc] dark:bg-[#1a3a6a]/20">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Producto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Categoría
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Precio ref.
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Unidad
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-[rgba(96,165,245,0.08)]">
              {SAMPLE_PRICES.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-[#f8fafc] dark:hover:bg-[#1a3a6a]/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[#1e293b] dark:text-[#eff6ff]">
                    {row.producto}
                  </td>
                  <td className="px-4 py-3 text-[#94a3b8]">{row.categoria}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="terra-score font-bold text-[#f59e0b]">
                      ${row.precio.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#94a3b8] text-xs">por {row.unidad}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <TrendIcon tendencia={row.tendencia} />
                      {row.variacion !== 0 && (
                        <span
                          className={`text-xs ${
                            row.variacion > 0 ? "text-[#ef4444]" : "text-[#22c55e]"
                          }`}
                        >
                          {row.variacion > 0 ? "+" : ""}
                          {row.variacion}%
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-[11px] text-[#94a3b8] text-center">
        Los precios mostrados son de referencia para el mercado venezolano. Pueden variar por región,
        proveedor y condiciones de mercado.
      </p>
    </div>
  );
}
