"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/app/saber-mas/[interes]/components/customInput";
import Loader from "@/app/saber-mas/[interes]/components/loader";
import { FormSchema as FormSchemaDefinition } from "@/schemas/formSchema";
import type { FormSchema as FormSchemaType, Interests as InterestType, InputForm } from "@/schemas/formSchema";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type ProjectFormProps = {
  interest: InterestType;
  backgroundImage?: string;
  heading?: string;
  subtitle?: string;
  submitLabel?: string;
  id?: string;
  profileTypes?: { label: string; value: string }[];
  transactionTypes?: string[];
};

export default function ProjectForm({
  interest,
  backgroundImage,
  heading = "Descubri una nueva forma de vivir.",
  subtitle = "Comunicate con nosotros:",
  submitLabel = "Quiero invertir",
  id = "formulario",
  profileTypes,
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
      profileType: profileTypes ? profileTypes[0].value : undefined,
      transactionType: transactionTypes ? transactionTypes[0] : undefined,
    },
  });
  const { handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = form;
  const currentProfileType = watch("profileType");
  const currentTransactionType = watch("transactionType");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    setSubmitMessage({ type: "", text: "" }); // Limpiar mensajes previos

    try {
      if (!executeRecaptcha) {
        throw new Error("El sistema de verificación no está listo. Por favor recarga la página e intenta nuevamente.");
      }

      const token = await executeRecaptcha("form_submit");

      if (!token) {
        throw new Error("No se pudo generar el token de verificación. Por favor recarga la página e intenta nuevamente.");
      }

      const verifyCaptcha = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const verifyCaptchaJson = await verifyCaptcha.json();
      if (!verifyCaptchaJson.ok) {
        throw new Error(verifyCaptchaJson.error || "Error en la verificación. Por favor intenta nuevamente.");
      }
    } catch (error) {
      const err = error as Error;
      setSubmitMessage({
        type: "error",
        text: err.message,
      });
      setLoading(false);
      return;
    }

    const dataToSend = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      interesting: data.interesting.trim(),
      message: data.message?.trim() || null,
      timestamp: new Date().toISOString(),
      source: "website_coradir_homes_form",
      profileType: data.profileType,
      transactionType: data.transactionType,
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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
      setSubmitMessage({
        type: "error",
        text: "Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.",
      });
    }
  };

  // Standard styles
  const labelClassName = "text-blue text-lg font-bold mb-1 xl:text-right w-full block";
  const inputClassName = "bg-white text-blue w-full md:w-[90%] xl:w-full h-11 rounded-md mb-3 pl-4 text-base border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm";

  const inputs: InputForm[] = [
    {
      name: "name",
      label: "Nombre y apellido",
      placeholder: "Nombre y apellido",
      type: "text",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "email",
      label: "Correo electronico",
      placeholder: "nombre@email.com",
      type: "email",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "phone",
      label: "Celular",
      placeholder: "+54 9 ...",
      type: "tel",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "message",
      label: "Tu mensaje (opcional)",
      placeholder: "Escribe tu consulta...",
      type: "textarea",
      ref: useRef<HTMLTextAreaElement>(null),
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

              {/* Profile Type Selector */}
              {profileTypes && (
                <div className="w-full md:w-[90%] xl:w-full mb-5">
                  <label className="block text-blue text-lg font-bold mb-2 xl:text-right">Perfil de Interesado:</label>
                  <div className="flex gap-6 xl:justify-end justify-center">
                    {profileTypes.map((type, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`relative flex items-center justify-center w-5 h-5 border-2 rounded-full transition-colors ${currentProfileType === type.value ? 'border-blue' : 'border-gray-400 group-hover:border-blue'}`}>
                          <input
                            type="radio"
                            value={type.value}
                            checked={currentProfileType === type.value}
                            onChange={() => setValue("profileType", type.value)}
                            className="appearance-none absolute inset-0 cursor-pointer"
                          />
                          {currentProfileType === type.value && (
                            <div className="w-2.5 h-2.5 bg-blue rounded-full"></div>
                          )}
                        </div>
                        <span className={`text-base font-medium transition-colors ${currentProfileType === type.value ? 'text-blue' : 'text-gray-600 group-hover:text-blue'}`}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction Type Selector (Buttons) */}
              {transactionTypes && (
                <div className="w-full md:w-[90%] xl:w-full mb-6 grid grid-cols-2 gap-3">
                  {transactionTypes.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setValue("transactionType", opt)}
                      className={`py-2.5 text-sm font-bold uppercase tracking-wider border-2 rounded-lg transition-all
                        ${currentTransactionType === opt
                          ? 'bg-blue text-white border-blue shadow-md'
                          : 'bg-transparent text-blue border-blue/30 hover:border-blue'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

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
