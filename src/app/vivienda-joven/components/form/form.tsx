"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 
import { useRef, useState } from "react"
import CustomInput from "@/app/saber-mas/[interes]/components/customInput" 
import { FormSchema, InputForm } from "@/schemas/formSchema"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import Loader from "@/app/saber-mas/[interes]/components/loader"

export default function FormularioInversion() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      interesting: 'vivienda-joven',
      message: '',
      name: '',
      phone: ''
    }
  }) 
  const { handleSubmit, control , formState:{ errors, isSubmitting }, reset } = form; 
      const [submitMessage, setSubmitMessage] = useState({ type: ' ',
          text: ' ' });
      const {executeRecaptcha} = useGoogleReCaptcha();
      const [loading, setLoading] = useState(false);
      const onSubmit = async (data:FormSchema) => { 
          setLoading(true);
          try{
              if (!executeRecaptcha) throw new Error('Debes completar el captcha.'); 
              const token = await executeRecaptcha('form_submit');
              const verifyCaptcha = await fetch('/api/verify-captcha', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token }),
              });
              const verifyCaptchaJson = await verifyCaptcha.json(); 
              if (!verifyCaptchaJson.ok) throw new Error(verifyCaptchaJson.error); 
  
          }catch(error : unknown){ 
              const err = error as Error; 
              setSubmitMessage({
                  type: 'error',
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
              source: 'website_coradir_homes_form'
            };
          try { 
              const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(dataToSend)
              });
          
              if (!response.ok) {
                  throw new Error(`Error HTTP: ${response.status}`);
              }
              setSubmitMessage({
                  type: 'success',
                  text: '¡Gracias por tu interés! Hemos recibido tu solicitud y te contactaremos pronto.',
              });
          } catch (error : unknown) { 
              const err = error as Error;
              console.log(err);
              setLoading(false);
              setSubmitMessage({
                  type: 'error',
                  text: 'Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.',
              });
              return;
          }  
          setTimeout(() => {
              setSubmitMessage({ type: '', text: '' });
              reset(); 
          }, 5000);
          setLoading(false);
      };  
  const labelClassName="text-blue text-xl md:text-3xl 2xl:w-full xl:text-right" ;
  const inputClassName="bg-white text-blue w-full md:w-[80%] 2xl:w-full h-12 rounded-md mb-5 pl-4";
  const inputs:InputForm[] = [
    { 
      name: "name", 
      label: "NOMBRE Y APELLIDO", 
      type: "text", 
      ref: useRef<HTMLInputElement>(null), 
      inputClassName,
      labelClassName 
    },
    { 
      name: "email", 
      label: "CORREO ELECTRÓNICO", 
      type: "email", 
      ref: useRef<HTMLInputElement>(null),
      inputClassName,
      labelClassName
    },
    { 
      name: "phone", 
      label: "CELULAR", 
      type: "tel", ref: 
      useRef<HTMLInputElement>(null), 
      inputClassName,
      labelClassName  
    },
    { 
      name: "message", 
      label: "TU MENSAJE (opcional)", 
      type: "textarea", ref:useRef<HTMLTextAreaElement>(null), 
      inputClassName,
      labelClassName   
    },
  ]
  return (
    
    <section
      className="relative w-full flex items-center justify-center bg-white min-h-[90vh]"
      style={{
        backgroundImage: 'url("/img/vivienda-joven/bg-form.jpg")', 
        backgroundSize: "fill",
        backgroundPosition: "center",
      }}
      id="formulario"
    >
      <div className="w-full h-full absolute top-0 left-0 bg-white/70 z-0"></div>
        {
          loading ? (
              <Loader/>
          ):(
              submitMessage.type === 'success' ?(
                      <section className="flex flex-col items-center justify-center gap-5 bg-blue p-10 rounded-2xl">
                          <h2 className="w-full text-sm md:text-xl text-white font-raleway text-center">{submitMessage.text}</h2>
                          <h3 className="w-full text-lg md:text-2xl text-white font-raleway text-center font-bold">Vivir bien nunca fue tan sencillo.</h3>
                      </section>
                  ):(
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col xl:flex-row items-center md:items-start justify-center gap-6 text-white container"
              >
                <section className="h-full w-full flex flex-col items-center md:items-start md:justify-start gap-2 xl:gap-20">
                  <h2 className="text-4xl md:text-6xl xl:text-7xl 2xl:text-9xl text-blue w-full 2xl:w-[150%] font-playfair xl:text-left text-center leading-tight font-bold">
                    Descubrí una nueva<br />forma de vivir.
                  </h2>

                  <p className="text-center w-full text-xl md:text-3xl text-black font-raleway font-semibold md:font-extrabold xl:text-left">
                    Comunicate con nosotros:
                  </p>
                  {submitMessage.type === 'error' && (
                      <div className="mb-6 p-4 rounded-md text-sm bg-red-900/60 text-red-300 md:text-xl mx-auto">
                          {submitMessage.text}
                      </div>
                  )}

                </section>
                <section className="w-full 2xl:w-[70%] flex flex-col items-center justify-center xl:pt-56">
                  {
                    inputs.map((input)=>(
                      <CustomInput 
                        key={input.name}
                        {...input}
                        control={control}
                        errors={errors} 
                      />
                    ))
                  } 
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className={`
                      bg-blue text-white max-w-96 mx-auto text-2xl md:text-3xl py-3 px-16 rounded-full  transition uppercase cursor-pointer
                      ${isSubmitting || Object.keys(errors).length > 0 ? 'opacity-70 cursor-not-allowed' : ' hover:bg-blue/70 cursor-pointer'}
                    `}
                  >
                    {isSubmitting ? "ENVIANDO..." : "¡QUIERO INVERTIR!"}
                  </button>
                </section> 
                  
              </form>)
          )
        }
   </section>
)
}