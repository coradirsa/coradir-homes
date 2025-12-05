"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CustomInput from "./customInput";
import Loader from "./loader";
import { FormSchema, InputForm, Interests } from "../../../../schemas/formSchema";
import type { SaberMasLandingCopy } from "@/content/seo/copy";

type Props = {
  copy: SaberMasLandingCopy;
};

export default function SaberMas({ copy }: Props) {
  const { interes } = useParams();
  const interesResult = Interests.safeParse(interes);

  const form = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      interesting: interesResult.data,
      message: "",
      name: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      if (!executeRecaptcha) {
        throw new Error("Debes completar el captcha.");
      }
      const token = await executeRecaptcha("form_submit");
      const verifyCaptcha = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const verifyCaptchaJson = await verifyCaptcha.json();
      if (!verifyCaptchaJson.ok) {
        throw new Error(verifyCaptchaJson.error);
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

    const payload = {
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
        body: JSON.stringify(payload),
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

      setSubmitMessage({
        type: "success",
        text: "Gracias por tu interes. Nos contactaremos muy pronto.",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error en envío de formulario:", err);
      setLoading(false);
      setSubmitMessage({
        type: "error",
        text: "Hubo un error al enviar tu solicitud. Intenta nuevamente en unos minutos.",
      });
      return;
    }

    setTimeout(() => {
      setSubmitMessage({ type: "", text: "" });
      reset();
    }, 5000);
    setLoading(false);
  };

  const inputs: InputForm[] = [
    { name: "name", label: "Nombre y apellido", type: "text", ref: useRef<HTMLInputElement>(null) },
    { name: "email", label: "Correo electronico", type: "email", ref: useRef<HTMLInputElement>(null) },
    { name: "phone", label: "Celular", type: "tel", ref: useRef<HTMLInputElement>(null) },
    {
      name: "interesting",
      label: "Selecciona la opcion que te interesa",
      type: "select",
      ref: useRef<HTMLInputElement>(null),
      options: Interests.options,
    },
    { name: "message", label: "Tu mensaje (opcional)", type: "textarea", ref: useRef<HTMLInputElement>(null) },
  ];

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSubmitMessage({
        type: "error",
        text: "Por favor corrige los errores antes de enviar.",
      });
      const firstError = Object.keys(errors)[0];
      inputs.forEach((input) => {
        if (input.name === firstError && input.ref.current) {
          input.ref.current.focus();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  if (!interes || !interesResult.success) {
    return <div>Interes no encontrado</div>;
  }

  return (
    <section className="container flex flex-col items-center justify-start py-10 pt-14 min-h-[73vh] gap-10">
      <header className="flex flex-col items-center gap-4 text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl text-blue font-playfair">{copy.heroTitle}</h1>
        <p className="text-gray md:text-xl font-raleway">{copy.heroSubtitle}</p>
        <p className="text-gray/80 md:text-lg font-raleway">{copy.description}</p>
      </header>

      <section className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
        {copy.clusters.map((cluster) => (
          <article
            key={cluster.title}
            className="flex flex-col gap-4 rounded-3xl border border-blue/15 bg-white p-6 shadow-[0_15px_35px_-25px_rgba(0,36,82,0.45)]"
          >
            <h2 className="text-2xl font-playfair text-blue">{cluster.title}</h2>
            <p className="text-sm md:text-base font-raleway text-black/80">{cluster.summary}</p>
            <ul className="flex flex-col gap-2 pl-4 text-sm md:text-base font-raleway text-black/75 list-disc">
              {cluster.bulletPoints.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {cluster.cta && (
              <Link
                href={cluster.cta.href}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-blue px-4 py-2 text-sm font-raleway uppercase tracking-wide text-blue transition hover:bg-blue hover:text-white"
              >
                {cluster.cta.label}
              </Link>
            )}
          </article>
        ))}
      </section>

      {loading ? (
        <Loader />
      ) : submitMessage.type === "success" ? (
        <section className="flex flex-col items-center justify-center gap-5 bg-blue p-10 rounded-2xl text-center">
          <h2 className="w-full text-base md:text-xl text-white font-raleway">{submitMessage.text}</h2>
          <h3 className="w-full text-lg md:text-2xl text-white font-raleway font-bold">Vivir bien nunca fue tan sencillo.</h3>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-10 px-4 rounded-2xl bg-blue w-[90%] xs:w-[80%] md:w-[60%] lg:w-[50%] flex flex-col items-center justify-center gap-5"
        >
          {submitMessage.type === "error" && (
            <div className="mb-6 w-full rounded-md bg-red-900/30 p-4 text-sm text-red-200 md:text-base">
              {submitMessage.text}
            </div>
          )}
          {inputs.map((input) => (
            <CustomInput<FormSchema> key={input.name} {...input} control={control} errors={errors} />
          ))}
          <button
            id="boton-homes-contacto"
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`xl:text-2xl text-xl z-10 text-blue bg-white md:px-20 px-10 py-2 xl:py-4 rounded-full uppercase transition-all duration-300 ease-in-out ${
              isSubmitting || Object.keys(errors).length > 0
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-transparent hover:text-white border-white border-2 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}
    </section>
  );
}
