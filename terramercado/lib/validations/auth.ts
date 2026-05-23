import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z
  .object({
    nombre: z.string().min(2, "Mínimo 2 caracteres").max(50),
    apellido: z.string().min(2, "Mínimo 2 caracteres").max(50),
    email: z.string().email("Email inválido"),
    telefono: z
      .string()
      .regex(/^\+?[\d\s\-()]{7,20}$/, "Teléfono inválido")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmPassword: z.string(),
    rol: z.enum(["comprador", "vendedor"]).default("comprador"),
    ubicacion: z.string().max(100).optional().or(z.literal("")),
    aceptaTerminos: z.literal(true, {
      error: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const recoverSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RecoverInput = z.infer<typeof recoverSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
