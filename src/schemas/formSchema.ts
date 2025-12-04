import z from 'zod';
export const Interests = z.enum([
    "inversiones",
    "instituciones",
    "corporativos",
    "juana-64",
    "terrenos",
    "la-torre-ii"
]);
export const FormSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Debes ingresar un email valido"),
    phone: z.string()
    .min(10, "El telefono debe tener al menos 10 digitos")
    .regex(/^\+?\d{10,15}$/, "El telefono solo puede contener numeros y un '+' inicial opcional"),
    interesting: Interests,
    message: z.string().optional() 
});
export type InputForm = {
    name: keyof FormSchema;
    label: string;
    type: string;
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    options?: string[];
    inputClassName?:string;
    labelClassName?:string;
}

export type Interests = z.infer<typeof Interests>;
export type FormSchema = z.infer< typeof FormSchema >;
