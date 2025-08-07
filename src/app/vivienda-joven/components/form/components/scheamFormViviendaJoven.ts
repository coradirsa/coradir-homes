import { z } from "zod"
export const SchemaFormViviendaJoven = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  celular: z.string().min(6, "Celular requerido"),
  mensaje: z.string().optional(),
})
export type InputForm = {
    name: keyof SchemaFormViviendaJoven;
    label: string;
    type: string;
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    options?: string[];
    inputClassName?: string;
    labelClassName?: string;
}
export type SchemaFormViviendaJoven = z.infer<typeof SchemaFormViviendaJoven>