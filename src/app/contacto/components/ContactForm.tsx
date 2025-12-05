"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CustomInput from "../../saber-mas/[interes]/components/customInput";
import Loader from "../../saber-mas/[interes]/components/loader";
import { FormSchema, InputForm, Interests } from "../../../schemas/formSchema";

export default function ContactForm() {
  const form = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      interesting: undefined,
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
      interesting: data.interesting?.trim() || "contacto-general",
      message: data.message?.trim() || null,
      timestamp: new Date().toISOString(),
      source: "website_coradir_homes_contacto",
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
        text: "Gracias por tu interés. Nos contactaremos muy pronto.",
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
    { name: "email", label: "Correo electrónico", type: "email", ref: useRef<HTMLInputElement>(null) },
    { name: "phone", label: "Celular", type: "tel", ref: useRef<HTMLInputElement>(null) },
    {
      name: "interesting",
      label: "Selecciona la opción que te interesa",
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

  if (loading) {
    return <Loader />;
  }

  if (submitMessage.type === "success") {
    return (
      <section className="flex flex-col items-center justify-center gap-5 bg-blue p-10 rounded-2xl text-center max-w-2xl w-full">
        <h2 className="w-full text-base md:text-xl text-white font-raleway">{submitMessage.text}</h2>
        <h3 className="w-full text-lg md:text-2xl text-white font-raleway font-bold">
          Vivir bien nunca fue tan sencillo.
        </h3>
      </section>
    );
  }

  return (
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
  );
}
