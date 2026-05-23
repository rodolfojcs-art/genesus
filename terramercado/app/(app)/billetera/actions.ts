"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionState {
  success: boolean;
  error?: string;
}

export async function createFinancingAgreementAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const offerId = formData.get("offer_id") as string | null;
  const montoRaw = formData.get("monto") as string | null;

  if (!offerId || !montoRaw) {
    return { success: false, error: "Datos incompletos" };
  }

  const monto = parseFloat(montoRaw);
  if (isNaN(monto) || monto <= 0) {
    return { success: false, error: "Monto inválido" };
  }

  // Fetch the offer
  const { data: offer, error: offerError } = await supabase
    .from("financing_offers")
    .select("*")
    .eq("id", offerId)
    .eq("activa", true)
    .single();

  if (offerError || !offer) {
    return { success: false, error: "Oferta no encontrada o inactiva" };
  }

  if (monto < offer.monto_min || monto > offer.monto_max) {
    return {
      success: false,
      error: `El monto debe estar entre ${offer.monto_min} y ${offer.monto_max} USD`,
    };
  }

  // Fetch user profile to check TerraScore
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("terra_score")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Perfil no encontrado" };
  }

  if ((profile.terra_score ?? 0) < offer.terra_score_min) {
    return {
      success: false,
      error: `Tu TerraScore (${profile.terra_score}) es menor al mínimo requerido (${offer.terra_score_min})`,
    };
  }

  // Insert financing agreement
  const { data: agreement, error: agreementError } = await supabase
    .from("financing_agreements")
    .insert({
      offer_id: offerId,
      comprador_id: user.id,
      monto,
      tasa_acordada: offer.tasa_interes,
      cronograma: [],
      status: "pendiente",
    })
    .select("id")
    .single();

  if (agreementError || !agreement) {
    return { success: false, error: "Error al crear el acuerdo de financiamiento" };
  }

  // Create wallet transaction
  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (wallet) {
    await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      tipo: "credito_aprobado",
      monto,
      moneda: "USD",
      referencia: agreement.id,
      descripcion: `Crédito aprobado — ${offer.nombre}`,
    });

    // Update wallet balance
    await supabase.rpc("increment_wallet_usd", {
      p_wallet_id: wallet.id,
      p_amount: monto,
    });
  }

  return { success: true };
}
