import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { n8n } from "@/lib/ai/n8n-client";

const inputSchema = z.object({
  montoAFinanciar: z.number().positive().max(1_000_000),
  productId: z.string().uuid().optional(),
  cicloProductivo: z.string().optional(),
  notas: z.string().max(500).optional(),
});

interface FinancieroOutput {
  ofertasDisponibles: Array<{
    offer_id: string;
    entidad: string;
    tasa: number;
    plazo_dias: number;
    cuota_estimada: number;
    repago_post_cosecha: boolean;
  }>;
  recomendacion: string;
  terraScoreRequerido: number;
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
    .select("terra_score, cultivo_principal, ciclo_productivo_activo")
    .eq("id", user.id)
    .single();

  const n8nInput = {
    userId: user.id,
    montoAFinanciar: parsed.data.montoAFinanciar,
    productId: parsed.data.productId,
    cicloProductivo: parsed.data.cicloProductivo ?? profile?.ciclo_productivo_activo,
    terraScore: profile?.terra_score ?? 500,
    cultivoPrincipal: profile?.cultivo_principal,
    notas: parsed.data.notas,
  };

  const result = await n8n.financiero<typeof n8nInput, FinancieroOutput>(n8nInput);

  return NextResponse.json(result);
}
