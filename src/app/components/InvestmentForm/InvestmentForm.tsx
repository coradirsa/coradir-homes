"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema de validación con Zod
const investmentSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(8, "Teléfono inválido").regex(/^[0-9+\s()-]+$/, "Solo números y caracteres válidos"),
  monto: z.string().optional(),
  acepta_politica: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
});

export type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  whatsappNumber?: string;
  trackEvents?: boolean;
  showTitle?: boolean;
  onSubmitCallback?: (data: InvestmentFormData) => void;
}

export default function InvestmentForm({
  whatsappNumber = "5492664649967",
  trackEvents = true,
  showTitle = true,
  onSubmitCallback,
}: InvestmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
  });

  const onSubmit = (data: InvestmentFormData) => {
    // Construir mensaje de WhatsApp
    const mensaje = `Hola! Vengo del formulario de inversiones de la web homes.
Quiero que me contacten.

Mis datos son:
- *Nombre:* ${data.nombre}
- *Email:* ${data.email}
- *Teléfono:* ${data.telefono}
- *Monto estimado:* ${data.monto || "No especificado"}
`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWsp = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;

    // GTM Event: form submit
    if (trackEvents && typeof window !== "undefined") {
      const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
      if (dataLayer) {
        dataLayer.push({
          event: "investment_form_submit",
          form_name: "Inversiones Inmobiliarias",
          monto_estimado: data.monto || "no_especificado",
        });
      }
    }

    // Callback personalizado (si existe)
    if (onSubmitCallback) {
      onSubmitCallback(data);
    }

    // Abrir WhatsApp
    window.open(urlWsp, "_blank");
  };

  return (
    <div id="investment-form-container" className="bg-white rounded-2xl shadow-xl p-7 md:p-8">
      {showTitle && (
        <>
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-blue mb-3">
            Oportunidad de inversión con respaldo inmobiliario
          </h2>

          <p className="text-base md:text-lg text-gray leading-relaxed mb-5">
            CORADIR S.A. ofrece la posibilidad de participar en proyectos de construcción de
            departamentos con garantía real sobre inmuebles de la compañía. Las operaciones se
            instrumentan mediante <strong className="text-black">contratos privados</strong> e{" "}
            <strong className="text-black">hipotecas</strong> sobre unidades terminadas (escritura
            pública e inscripción registral).
          </p>
        </>
      )}

      {/* Form */}
      <form
        id="investment-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Grid de inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="text-sm font-medium text-black">
              Nombre y apellido
            </label>
            <input
              {...register("nombre")}
              id="nombre"
              type="text"
              autoComplete="name"
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            />
            {errors.nombre && (
              <span className="text-sm text-red-600">{errors.nombre.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Correo electrónico
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            />
            {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label htmlFor="telefono" className="text-sm font-medium text-black">
              Teléfono
            </label>
            <input
              {...register("telefono")}
              id="telefono"
              type="tel"
              autoComplete="tel"
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
            />
            {errors.telefono && (
              <span className="text-sm text-red-600">{errors.telefono.message}</span>
            )}
          </div>

          {/* Monto */}
          <div className="flex flex-col gap-2">
            <label htmlFor="monto" className="text-sm font-medium text-black">
              Monto estimado (opcional)
            </label>
            <input
              {...register("monto")}
              id="monto"
              type="text"
              inputMode="numeric"
              placeholder="Ej.: 50.000"
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Checkbox de consentimiento */}
        <div className="flex items-start gap-3 pt-2">
          <input
            {...register("acepta_politica")}
            id="acepta_politica"
            type="checkbox"
            className="mt-1 w-4 h-4 text-blue border-gray-300 rounded focus:ring-2 focus:ring-blue cursor-pointer"
          />
          <label htmlFor="acepta_politica" className="text-sm text-gray leading-relaxed cursor-pointer">
            Acepto ser contactado por CORADIR S.A. conforme a la{" "}
            <a
              href="/politica-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue underline hover:text-blue-light transition-colors"
            >
              Política de Privacidad
            </a>
            .
          </label>
        </div>
        {errors.acepta_politica && (
          <span className="text-sm text-red-600 block -mt-2">{errors.acepta_politica.message}</span>
        )}

        {/* Submit button */}
        <div className="pt-2">
          <button
            id="investment-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-blue text-white font-semibold text-base md:text-lg px-8 py-3 rounded-full hover:bg-blue-gray transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quiero que me contacten
          </button>
        </div>

        {/* Aviso legal */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs leading-relaxed text-gray">
            <strong className="text-black">Aviso legal:</strong> Esta comunicación tiene carácter
            exclusivamente informativo y no constituye una oferta pública de valores ni una
            captación de ahorro del público conforme a las Leyes 26.831 y 21.526. Las condiciones
            específicas (plazos, moneda, intereses, garantías) se acuerdan en contratos privados
            entre las partes, instrumentados en escritura pública con inscripción registral.
          </p>
        </div>
      </form>
    </div>
  );
}
