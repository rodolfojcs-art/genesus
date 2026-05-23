import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, MapPin, Leaf, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Mi Perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile
    ? `${profile.nombre} ${profile.apellido}`.trim()
    : user.email;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="font-heading text-2xl font-bold text-[#0d2240] dark:text-[#eff6ff]">
        Mi Perfil
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Identity card */}
        <Card className="md:col-span-1 border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] rounded-[12px]">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-20 w-20 rounded-full bg-[#1e4d8c] flex items-center justify-center text-3xl font-heading font-bold text-white">
              {displayName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-heading font-bold text-lg text-[#0d2240] dark:text-[#eff6ff]">
                {displayName}
              </p>
              <p className="text-sm text-[#94a3b8]">{user.email}</p>
            </div>
            {profile?.terra_score && (
              <span className="terra-score text-sm bg-[#fde68a] text-[#92400e] px-3 py-1 rounded-full">
                TerraScore {profile.terra_score}
              </span>
            )}
            <Badge className="bg-[#eff6ff] text-[#1e4d8c] border-[#dbeafe] capitalize">
              {profile?.rol ?? "comprador"}
            </Badge>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2 border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] rounded-[12px]">
          <CardContent className="p-6 space-y-5">
            <h2 className="font-heading font-semibold text-[#0d2240] dark:text-[#eff6ff]">
              Información del productor
            </h2>

            <div className="space-y-3">
              {[
                {
                  icon: User,
                  label: "Nombre completo",
                  value: displayName,
                },
                {
                  icon: MapPin,
                  label: "Ubicación",
                  value: profile?.ubicacion ?? "Sin especificar",
                },
                {
                  icon: Leaf,
                  label: "Cultivo principal",
                  value: profile?.cultivo_principal ?? "Sin especificar",
                },
                {
                  icon: Shield,
                  label: "Ciclo productivo activo",
                  value: profile?.ciclo_productivo_activo ?? "Sin especificar",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2 border-b border-[#eff6ff] dark:border-[#1a3a6a] last:border-0">
                  <item.icon className="h-4 w-4 text-[#f59e0b] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#94a3b8]">{item.label}</p>
                    <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full sm:w-auto inline-flex items-center justify-center h-9 px-4 rounded-lg bg-[#1e4d8c] hover:bg-[#2563b0] text-white text-sm font-semibold transition-colors">
              Editar perfil
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
