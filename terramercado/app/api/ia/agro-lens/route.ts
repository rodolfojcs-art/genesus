import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { n8n } from "@/lib/ai/n8n-client";

const inputSchema = z.object({
  imagenBase64: z.string().min(1),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  cultivoActivo: z.string().optional(),
  ubicacion: z.string().optional(),
  ciclo: z.string().optional(),
});

interface LensOutput {
  identificacion: string;
  probabilidad: number;
  diagnostico: string;
  recomendaciones: Array<{ producto_id?: string; descripcion: string }>;
  alertas: string[];
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input inválido", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cultivo_principal, ubicacion, ciclo_productivo_activo")
    .eq("id", user.id)
    .single();

  const n8nInput = {
    ...parsed.data,
    userId: user.id,
    cultivoActivo: parsed.data.cultivoActivo ?? profile?.cultivo_principal,
    ubicacion: parsed.data.ubicacion ?? profile?.ubicacion,
    ciclo: parsed.data.ciclo ?? profile?.ciclo_productivo_activo,
  };

  const result = await n8n.terraLens<typeof n8nInput, LensOutput>(n8nInput);

  // Persist diagnosis for model improvement
  await supabase.from("ai_diagnoses").insert({
    user_id: user.id,
    imagen_url: `data:${parsed.data.mimeType};base64,${parsed.data.imagenBase64.slice(0, 20)}...`,
    cultivo: parsed.data.cultivoActivo,
    diagnostico: result.diagnostico,
    confianza: result.probabilidad,
    recomendaciones: result.recomendaciones,
    alertas: result.alertas,
  });

  return NextResponse.json(result);
}
