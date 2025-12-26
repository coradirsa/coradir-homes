"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/app/saber-mas/[interes]/components/customInput";
import Loader from "@/app/saber-mas/[interes]/components/loader";
import { FormSchema as FormSchemaDefinition } from "@/schemas/formSchema";
import type { FormSchema as FormSchemaType, Interests as InterestType, InputForm, TransactionType } from "@/schemas/formSchema";
import { TransactionTypeLabels } from "@/schemas/formSchema";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type ProjectFormProps = {
  interest: InterestType;
  backgroundImage?: string;
  heading?: string;
  subtitle?: string;
  submitLabel?: string;
  id?: string;
  transactionTypes?: string[];
};

export default function ProjectForm({
  interest,
  backgroundImage,
  heading = "Descubri una nueva forma de vivir.",
  subtitle = "Comunicate con nosotros:",
  submitLabel = "Enviar",
  id = "formulario",
  transactionTypes,
}: ProjectFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchemaDefinition),
    defaultValues: {
      email: "",
      interesting: interest,
      message: "",
      name: "",
      phone: "",
      transactionType: transactionTypes ? transactionTypes[0] as TransactionType : undefined,
    },
  });
  const { handleSubmit, control, formState: { errors, isSubmitting } } = form;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    setSubmitMessage({ type: "", text: "" }); // Limpiar mensajes previos

    console.log("Iniciando envío de formulario...");

    try {
      if (!executeRecaptcha) {
        console.error("executeRecaptcha no está disponible");
        throw new Error("El sistema de verificación no está listo. Por favor recarga la página e intenta nuevamente.");
      }

      console.log("Ejecutando reCAPTCHA...");
      const token = await executeRecaptcha("form_submit");

      if (!token) {
        console.error("No se generó token de reCAPTCHA");
        throw new Error("No se pudo generar el token de verificación. Por favor recarga la página e intenta nuevamente.");
      }

      console.log("Token de reCAPTCHA generado, verificando...");
      const verifyCaptcha = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, action: "form_submit" }),
      });

      console.log("Respuesta de verify-captcha:", {
        status: verifyCaptcha.status,
        statusText: verifyCaptcha.statusText,
      });

      const verifyCaptchaJson = await verifyCaptcha.json();
      console.log("Resultado de verificación:", verifyCaptchaJson);

      if (!verifyCaptchaJson.ok) {
        console.error("reCAPTCHA falló:", verifyCaptchaJson.error);
        throw new Error(verifyCaptchaJson.error || "Error en la verificación. Por favor intenta nuevamente.");
      }

      console.log("reCAPTCHA verificado exitosamente");
    } catch (error) {
      const err = error as Error;
      console.error("Error en validación de reCAPTCHA:", err);
      setSubmitMessage({
        type: "error",
        text: err.message,
      });
      setLoading(false);
      return;
    }

    const dataToSend: Record<string, unknown> = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      interesting: data.interesting?.trim() || interest,
      message: data.message?.trim() || null,
      timestamp: new Date().toISOString(),
      source: "website_coradir_homes_form",
    };

    // Add optional fields only if they exist
    if (data.transactionType) {
      dataToSend.transactionType = data.transactionType;
    }

    try {
      // Timeout controller to prevent hanging
      // 30 seconds to allow time for AI validation, DB insert, and email sending
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      console.log("Enviando formulario a N8N:", {
        url: webhookUrl,
        data: dataToSend,
      });

      const response = await fetch(webhookUrl!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Respuesta de N8N:", {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("Error al enviar formulario:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setLoading(false);
      router.push('/gracias');
    } catch (error) {
      const err = error as Error;
      console.error("Error en envío de formulario:", err);
      setLoading(false);

      // Better error message for timeout
      const errorMessage = err.name === 'AbortError'
        ? "La solicitud tardó demasiado. Por favor, intenta nuevamente."
        : "Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.";

      setSubmitMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  // Standard styles
  const labelClassName = "text-blue text-lg font-bold mb-1 xl:text-right w-full block";
  const inputClassName = "bg-white text-blue w-full md:w-[90%] xl:w-full h-11 rounded-md mb-3 pl-4 text-base border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm";

  // Create refs outside of conditional logic
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const transactionTypeRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const inputs: InputForm[] = [
    {
      name: "name",
      label: "Nombre y apellido",
      placeholder: "Nombre y apellido",
      type: "text",
      ref: nameRef,
      inputClassName,
      labelClassName,
    },
    {
      name: "email",
      label: "Correo electronico",
      placeholder: "nombre@email.com",
      type: "email",
      ref: emailRef,
      inputClassName,
      labelClassName,
    },
    {
      name: "phone",
      label: "Celular",
      placeholder: "+54 9 ...",
      type: "tel",
      ref: phoneRef,
      inputClassName,
      labelClassName,
    },
    ...(transactionTypes ? [{
      name: "transactionType" as keyof FormSchemaType,
      label: "¿Qué te interesa?",
      type: "select",
      ref: transactionTypeRef,
      options: transactionTypes.map(opt => ({ value: opt, label: TransactionTypeLabels[opt] || opt })),
      inputClassName,
      labelClassName,
    }] : []),
    {
      name: "message",
      label: "Tu mensaje (opcional)",
      placeholder: "Escribe tu consulta...",
      type: "textarea",
      ref: messageRef,
      inputClassName: "bg-white text-blue w-full md:w-[90%] xl:w-full h-24 rounded-md mb-3 pl-4 pt-3 text-base border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm resize-none",
      labelClassName,
    },
  ];

  return (
    <section
      className="relative w-full flex items-center justify-center bg-white py-16"
      style={{
        backgroundImage: backgroundImage ? `url(\"${backgroundImage}\")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      id={id}
    >
      <div className="w-full h-full absolute top-0 left-0 bg-white/80 backdrop-blur-[2px] z-0" />
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 w-full max-w-7xl px-6 flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 container mx-auto"
        >
          <section className="w-full xl:w-5/12 flex flex-col items-center xl:items-start text-center xl:text-left gap-6 pt-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-blue font-playfair font-bold leading-tight">
              {heading}
            </h2>

            <p className="text-xl md:text-2xl text-gray-800 font-raleway font-medium">
              {subtitle}
            </p>
            {submitMessage.type === "error" && (
              <div className="w-full p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-200">
                {submitMessage.text}
              </div>
            )}
          </section>

          <section className="w-full xl:w-1/2 flex flex-col items-center xl:items-end">
            <div className="w-full max-w-lg">
              {inputs.map((input) => (
                <CustomInput
                  key={input.name}
                  {...input}
                  control={control}
                  errors={errors}
                />
              ))}

              <div className="w-full md:w-[90%] xl:w-full flex justify-center xl:justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className={`bg-blue text-white text-xl font-bold py-3 px-10 rounded-full transition-all uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isSubmitting || Object.keys(errors).length > 0
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue/90 cursor-pointer"
                    }`}
                >
                  {isSubmitting ? "Enviando..." : submitLabel}
                </button>
              </div>
            </div>
          </section>
        </form>
      )}
    </section>
  );
}
