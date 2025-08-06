import { z } from "zod"
export const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  celular: z.string().min(6, "Celular requerido"),
  mensaje: z.string().optional(),
})

export type FormData = z.infer<typeof schema>