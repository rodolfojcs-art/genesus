import Link from "next/link";
import { Scan, Bot, CreditCard, BarChart2, Users, Bell, Star, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { TerraLensUpload } from "@/components/ai/TerraLensUpload";
import { CopilotoSidebar } from "@/components/ai/CopilotoSidebar";
import type { Profile } from "@/types";

export const metadata = {
  title: "Herramientas IA",
};

const SUB_TOOLS = [
  {
    href: "/herramientas/analitica",
    icon: BarChart2,
    label: "TerraAnalítica",
    description: "Datos de mercado y tendencias",
  },
  {
    href: "/herramientas/comunidad",
    icon: Users,
    label: "TerraComunidad",
    description: "Foros y preguntas de agricultores",
  },
  {
    href: "/herramientas/alertas",
    icon: Bell,
    label: "TerraAlertas",
    description: "Notificaciones personalizadas",
  },
  {
    href: "/herramientas/reputacion",
    icon: Star,
    label: "TerraReputación",
    description: "Tu TerraScore y métricas",
  },
  {
    href: "/herramientas/precios",
    icon: TrendingUp,
    label: "TerraPrecios",
    description: "Monitor de precios de mercado",
  },
];

export default async function HerramientasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Pick<Profile, "cultivo_principal" | "ubicacion" | "ciclo_productivo_activo"> | null =
    null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("cultivo_principal, ubicacion, ciclo_productivo_activo")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const userContext = profile
    ? {
        cultivo: profile.cultivo_principal ?? undefined,
        ubicacion: profile.ubicacion ?? undefined,
        ciclo: profile.ciclo_productivo_activo ?? undefined,
      }
    : undefined;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-10">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
          Inteligencia artificial para tu finca
        </h1>
        <p className="text-[#475569] dark:text-[#94a3b8]">
          Herramientas de IA especializadas en el sector agropecuario para ayudarte a producir más y mejor.
        </p>
      </div>

      {/* Main AI tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Terra-Lens */}
        <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#1e4d8c] dark:hover:border-[#60a5f5] transition-colors rounded-xl overflow-hidden">
          <CardContent className="p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
              <Scan className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[#1e293b] dark:text-[#eff6ff]">
                Terra-Lens
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Diagnostica plagas y enfermedades con una foto
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Copiloto */}
        <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#1e4d8c] dark:hover:border-[#60a5f5] transition-colors rounded-xl overflow-hidden cursor-pointer">
          <CardContent className="p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
              <Bot className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[#1e293b] dark:text-[#eff6ff]">
                Copiloto Agronómico
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Tu asesor agronómico y veterinario 24/7
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financiero */}
        <Link href="/herramientas/analitica">
          <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#1e4d8c] dark:hover:border-[#60a5f5] transition-colors rounded-xl overflow-hidden h-full">
            <CardContent className="p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
                <CreditCard className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-[#1e293b] dark:text-[#eff6ff]">
                  Agente Financiero
                </h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Crédito atado a tu ciclo productivo
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Terra-Lens upload */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
          Terra-Lens — Diagnóstico visual
        </h2>
        <div className="rounded-xl border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] p-5 bg-white dark:bg-[#1a3a6a]/20">
          <TerraLensUpload userContext={userContext} />
        </div>
      </section>

      {/* Sub-tools grid */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
          Más herramientas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SUB_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}>
                <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] hover:border-[#1e4d8c] dark:hover:border-[#60a5f5] transition-colors rounded-xl h-full">
                  <CardContent className="p-3 space-y-2 text-center">
                    <Icon className="h-6 w-6 text-[#1e4d8c] dark:text-[#60a5f5] mx-auto" />
                    <p className="text-xs font-semibold text-[#1e293b] dark:text-[#eff6ff] leading-tight">
                      {tool.label}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] leading-tight">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Copiloto sidebar (always mounted) */}
      <CopilotoSidebar />
    </div>
  );
}
