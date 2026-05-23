"use server";

import { createClient } from "@/lib/supabase/server";
import { recoverSchema, resetPasswordSchema } from "@/lib/validations/auth";

export type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function recoverAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = recoverSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email inválido" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/recuperar/nueva-contrasena`,
  });

  if (error) {
    return { error: "Error al enviar el email. Intenta nuevamente." };
  }

  return {
    success: true,
    message: "Si el email está registrado, recibirás instrucciones para restablecer tu contraseña.",
  };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Error al actualizar la contraseña. El enlace puede haber expirado." };
  }

  return {
    success: true,
    message: "Contraseña actualizada correctamente. Ahora puedes iniciar sesión.",
  };
}
