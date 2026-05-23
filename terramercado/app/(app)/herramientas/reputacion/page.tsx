import { redirect } from "next/navigation";
import { Star, Truck, ShieldCheck, TrendingDown, ShoppingBag, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "TerraReputación",
};

interface SellerReputation {
  id: string;
  store_id: string;
  terra_score: number;
  entregas_a_tiempo: number;
  calidad_promedio: number;
  tasa_disputa: number;
  total_ventas: number;
}

interface Store {
  id: string;
  nombre: string;
  terra_score: number;
  verificada: boolean;
}

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 1000) / 1000;
  const color =
    score >= 800
      ? "#22c55e"
      : score >= 600
      ? "#f59e0b"
      : "#ef4444";

  const circumference = 2 * Math.PI * 44;
  const dash = pct * circumference;

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="terra-score text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-[#94a3b8]">/ 1000</span>
      </div>
    </div>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9] dark:border-[rgba(96,165,245,0.08)] last:border-0">
      <div className="flex items-center gap-2 text-sm text-[#475569] dark:text-[#94a3b8]">
        <Icon className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
        {label}
      </div>
      <span className="text-sm font-semibold text-[#1e293b] dark:text-[#eff6ff]">{value}</span>
    </div>
  );
}

export default async function ReputacionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: store } = await supabase
    .from("stores")
    .select("id, nombre, terra_score, verificada")
    .eq("owner_id", user.id)
    .single();

  if (!store) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
            <Star className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
            TerraReputación
          </h1>
        </div>
        <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Star className="h-12 w-12 text-[#93c5fd]" />
            <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              Crea tu tienda para ver tu reputación
            </p>
            <p className="text-sm text-[#94a3b8] max-w-sm">
              El TerraScore mide la confianza que genera tu tienda en el ecosistema TerraMercado.
            </p>
            <Link
              href="/tienda-mia"
              className="inline-flex items-center justify-center rounded-lg bg-[#1e4d8c] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3a6a] transition-colors"
            >
              Crear mi tienda
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: reputation } = await supabase
    .from("seller_reputation")
    .select("*")
    .eq("store_id", (store as Store).id)
    .single();

  const rep = reputation as SellerReputation | null;
  const score = rep?.terra_score ?? (store as Store).terra_score ?? 0;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
          <Star className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
            TerraReputación
          </h1>
          <p className="text-sm text-[#94a3b8]">{(store as Store).nombre}</p>
        </div>
      </div>

      {/* Score card */}
      <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreGauge score={score} />
            <div className="flex-1 w-full space-y-1">
              <h2 className="font-heading font-bold text-lg text-[#1e293b] dark:text-[#eff6ff]">
                TerraScore
              </h2>
              <p className="text-xs text-[#94a3b8] mb-4">
                Índice de confianza calculado a partir de tus métricas de venta.
              </p>
              {rep ? (
                <>
                  <MetricRow
                    icon={Truck}
                    label="Entregas a tiempo"
                    value={`${(rep.entregas_a_tiempo * 100).toFixed(0)}%`}
                  />
                  <MetricRow
                    icon={Star}
                    label="Calidad promedio"
                    value={`${rep.calidad_promedio.toFixed(1)} / 5`}
                  />
                  <MetricRow
                    icon={TrendingDown}
                    label="Tasa de disputas"
                    value={`${(rep.tasa_disputa * 100).toFixed(1)}%`}
                  />
                  <MetricRow
                    icon={ShoppingBag}
                    label="Total de ventas"
                    value={rep.total_ventas.toString()}
                  />
                </>
              ) : (
                <p className="text-sm text-[#94a3b8]">
                  Aún no hay métricas disponibles. Completa tus primeras ventas.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it's calculated */}
      <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#1e4d8c] dark:text-[#60a5f5]" />
            <h3 className="text-sm font-semibold text-[#1e293b] dark:text-[#eff6ff]">
              ¿Cómo se calcula tu TerraScore?
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-[#475569] dark:text-[#94a3b8]">
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#22c55e] shrink-0 mt-0.5" />
              <span>
                <strong>Entregas a tiempo (40%)</strong> — porcentaje de pedidos entregados antes de la fecha
                comprometida.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-3.5 w-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
              <span>
                <strong>Calidad promedio (35%)</strong> — promedio de estrellas otorgadas por compradores
                verificados.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingDown className="h-3.5 w-3.5 text-[#ef4444] shrink-0 mt-0.5" />
              <span>
                <strong>Tasa de disputas (25%)</strong> — penalización por disputas abiertas. Menor es mejor.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
