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
};

export default function ProjectForm({
  interest,
  backgroundImage,
  heading = "Descubri una nueva forma de vivir.",
  subtitle = "Comunicate con nosotros:",
  submitLabel = "Quiero invertir",
  id = "formulario",
}: ProjectFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchemaDefinition),
    defaultValues: {
      email: "",
      interesting: interest,
      message: "",
      name: "",
      phone: "",
    },
  });
  const { handleSubmit, control, formState: { errors, isSubmitting } } = form;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    try {
      if (!executeRecaptcha) throw new Error("Debes completar el captcha.");
      const token = await executeRecaptcha("form_submit");
      const verifyCaptcha = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const verifyCaptchaJson = await verifyCaptcha.json();
      if (!verifyCaptchaJson.ok) throw new Error(verifyCaptchaJson.error);
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
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Redirigir a página de agradecimiento para que GTM detecte la conversión
      router.push('/gracias');
    } catch (error) {
      const err = error as Error;
      console.log(err);
      setLoading(false);
      setSubmitMessage({
        type: "error",
        text: "Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.",
      });
    }
    setLoading(false);
  };

  const labelClassName = "text-blue text-xl md:text-3xl 2xl:w-full xl:text-right font-bold";
  const inputClassName = "bg-white text-blue w-full md:w-[80%] 2xl:w-full h-12 rounded-md mb-5 pl-4";

  const inputs: InputForm[] = [
    {
      name: "name",
      label: "Nombre y apellido",
      type: "text",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "email",
      label: "Correo electronico",
      type: "email",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "phone",
      label: "Celular",
      type: "tel",
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName,
    },
    {
      name: "message",
      label: "Tu mensaje (opcional)",
      type: "textarea",
      ref: useRef<HTMLTextAreaElement>(null),
      inputClassName,
      labelClassName,
    },
  ];

  return (
    <section
      className="relative w-full flex items-center justify-center bg-white min-h-[90vh]"
      style={{
        backgroundImage: backgroundImage ? `url(\"${backgroundImage}\")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      id={id}
    >
      <div className="w-full h-full absolute top-0 left-0 bg-white/70 z-0" />
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 w-full max-w-3xl px-6 py-12 flex flex-col xl:flex-row items-center md:items-start justify-center gap-6 text-white container"
        >
          <section className="h-full w-full flex flex-col items-center md:items-start md:justify-start gap-2 xl:gap-20">
            <h2 className="text-4xl md:text-6xl xl:text-7xl 2xl:text-9xl text-blue w-full font-playfair xl:text-left text-center leading-tight font-bold">
              {heading}
            </h2>

            <p className="text-center w-full text-xl md:text-3xl text-black font-raleway font-semibold md:font-extrabold xl:text-left">
              {subtitle}
            </p>
            {submitMessage.type === "error" && (
              <div className="mb-6 p-4 rounded-md text-sm bg-red-900/60 text-red-300 md:text-xl mx-auto">
                {submitMessage.text}
              </div>
            )}
          </section>
          <section className="w-full 2xl:w-[70%] flex flex-col items-center justify-center xl:pt-56">
            {inputs.map((input) => (
              <CustomInput
                key={input.name}
                {...input}
                control={control}
                errors={errors}
              />
            ))}
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`bg-blue text-white max-w-96 mx-auto text-2xl md:text-3xl py-3 px-16 rounded-full transition uppercase cursor-pointer ${isSubmitting || Object.keys(errors).length > 0
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue/70 cursor-pointer"
                }`}
            >
              {isSubmitting ? "Enviando..." : submitLabel}
            </button>
          </section>
        </form>
      )}
    </section>
  );
}
