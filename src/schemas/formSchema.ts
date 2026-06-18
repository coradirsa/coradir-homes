import z from 'zod';

export const Interests = z.enum([
    "inversiones",
    "instituciones",
    "corporativos",
    "juana-64",
    "san-luis",
    "terrenos",
    "la-torre-ii",
    "locales-comerciales",
    "contacto-general"
]);

export const TransactionTypes = z.enum([
    "comprar",
    "alquilar"
]);

export const TransactionTypeLabels: Record<string, string> = {
    "comprar": "Quiero comprar",
    "alquilar": "Quiero alquilar"
};

export const FormSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Debes ingresar un email válido"),
    phone: z.string()
        .min(10, "El teléfono debe tener al menos 10 dígitos")
        .regex(/^\+?\d{10,15}$/, "El teléfono solo puede contener números y un '+' inicial opcional")
        .optional(),
    interesting: Interests.optional(),
    transactionType: TransactionTypes,
    message: z.string().optional()
});
export type InputForm = {
    name: keyof FormSchema;
    label: string;
    type: string;
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    options?: string[] | Array<{ value: string; label: string }>;
    inputClassName?: string;
    labelClassName?: string;
    placeholder?: string;
}

export type Interests = z.infer<typeof Interests>;
export type TransactionType = z.infer<typeof TransactionTypes>;
export type FormSchema = z.infer<typeof FormSchema>;
