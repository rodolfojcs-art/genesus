import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { n8n } from "@/lib/ai/n8n-client";

const inputSchema = z.object({
  pregunta: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
});

interface CopilotoOutput {
  respuesta: string;
  productosSugeridos: Array<{ product_id: string; nombre: string; razon: string }>;
  advertenciasRegulatorias: string[];
  requiereExpertoHumano: boolean;
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
    .select("nombre, cultivo_principal, ubicacion, ciclo_productivo_activo, terra_score")
    .eq("id", user.id)
    .single();

  // Load conversation history if continuing a session
  let historial: unknown[] = [];
  if (parsed.data.conversationId) {
    const { data: conv } = await supabase
      .from("ai_conversations")
      .select("mensajes")
      .eq("id", parsed.data.conversationId)
      .eq("user_id", user.id)
      .single();
    historial = (conv?.mensajes as unknown[]) ?? [];
  }

  const n8nInput = {
    userId: user.id,
    pregunta: parsed.data.pregunta,
    perfil: profile,
    historial,
  };

  const result = await n8n.copiloto<typeof n8nInput, CopilotoOutput>(n8nInput);

  // Persist / update conversation
  const nuevoMensaje = [
    ...historial,
    { rol: "user", contenido: parsed.data.pregunta, ts: new Date().toISOString() },
    { rol: "copiloto", contenido: result.respuesta, ts: new Date().toISOString() },
  ];

  if (parsed.data.conversationId) {
    await supabase
      .from("ai_conversations")
      .update({ mensajes: nuevoMensaje, updated_at: new Date().toISOString() })
      .eq("id", parsed.data.conversationId);
  } else {
    const { data: newConv } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, agente: "copiloto", mensajes: nuevoMensaje })
      .select("id")
      .single();

    return NextResponse.json({ ...result, conversationId: newConv?.id });
  }

  return NextResponse.json(result);
}
