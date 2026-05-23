"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations/auth";

export type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    rol: formData.get("rol"),
    ubicacion: formData.get("ubicacion"),
    aceptaTerminos: formData.get("aceptaTerminos") === "on" ? true : undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      data: {
        nombre: parsed.data.nombre,
        apellido: parsed.data.apellido,
        rol: parsed.data.rol,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este email ya está registrado. ¿Quieres iniciar sesión?" };
    }
    return { error: "Error al crear tu cuenta. Intenta nuevamente." };
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message:
        "Cuenta creada. Revisa tu email para verificar tu cuenta antes de continuar.",
    };
  }

  // Auto-confirm (dev mode) — create profile immediately
  if (data.user && data.session) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: parsed.data.email,
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      telefono: parsed.data.telefono ?? null,
      rol: parsed.data.rol,
      ubicacion: parsed.data.ubicacion ?? null,
    });
  }

  return {
    success: true,
    message: "Cuenta creada. Revisa tu email para verificar tu cuenta.",
  };
}
