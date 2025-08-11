"use client";
import { useForm } from "react-hook-form";
import { FormSchema, InputForm, Interests } from "../../../../schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./customInput";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";  
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Loader from "./loader";
export default function SaberMas(){
    const {interes} = useParams() ;
    const interesResult = Interests.safeParse(interes); 
    const form = useForm<FormSchema>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email:"",
            interesting: interesResult.data,
            message: "",
            name:"",
            phone: "",
        }
    });
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
    const inputs:InputForm[] = [
        { name:"name", label:"Nombre y Apellido", type:"text" , ref:useRef<HTMLInputElement>(null) },
        { name:"email", label:"Correo electrónico", type:"email" , ref:useRef<HTMLInputElement>(null) },
        { name:"phone", label:"Celular", type:"tel" , ref:useRef<HTMLInputElement>(null) },
        { 
            name:"interesting", 
            label:"Seleccioná en cual opción estas interesado", 
            type:"select" , 
            ref:useRef<HTMLInputElement>(null),
            options: Interests.options
        },
        { name:"message", label:"Tu mensaje (opcional)", type:"textarea" , ref:useRef<HTMLInputElement>(null) },
    ]
    useEffect(() => { 
        if (Object.keys(errors).length > 0) {
            setSubmitMessage({
                type: 'error',
                text: 'Por favor corrige los errores antes de enviar.',
            });
          const firstError = Object.keys(errors)[0];
          inputs.forEach((input)=>{
            if (input.name === firstError && input.ref.current) {
              input.ref.current.focus();
            }
          })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);
    if(!interes || !interesResult.success) return <div>Interes no encontrado</div>;
    
    return( 
        <section className="container flex flex-col items-center justify-start py-10 pt-14 min-h-[73vh] gap-5"> 
            <h1 className="text-center text-7xl md:text-8xl text-blue font-playfair">¡Hola!</h1>   
            <h2 className="w-[80%] md:w-[35%] text-gray md:text-xl font-raleway text-center">Por favor, completa el siguiente formulario para que podamos conocer mejor tus intereses y asesorarte.</h2> 
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
                            <form onSubmit={handleSubmit(onSubmit)} className="py-10 px-4 rounded-2xl bg-blue w-[90%] xs:w-[80%] md:w-[60%] lg:w-[50%] flex flex-col items-center justify-center gap-5">
                                {submitMessage.type === 'error' && (
                                    <div className="mb-6 p-4 rounded-md text-sm bg-red-900/30 text-red-400 md:text-xl">
                                        {submitMessage.text}
                                    </div>
                                )}
                                {inputs.map((input)=>(
                                <CustomInput<FormSchema>  
                                        key={input.name} 
                                        {...input} 
                                        control={control} 
                                        errors={errors}  
                                    />
                                ))}  
                                <button 
                                    id="boton-homes-contacto"
                                    type="submit" 
                                    disabled={isSubmitting || Object.keys(errors).length > 0}
                                    className={`xl:text-2xl text-xl z-10 text-blue  bg-white md:px-20 px-10 py-2 xl:py-4 rounded-full uppercase transition-all duration-300 ease-in-out ${isSubmitting || Object.keys(errors).length > 0 ? 'opacity-70 cursor-not-allowed' : ' hover:bg-transparent hover:text-white  border-white border-2 cursor-pointer'}`}
                                >
                                    {isSubmitting ? "Enviando..." : "Enviar"}
                                </button>  
                                
                            </form>
                        ) 
                    )
            }
        </section>  
    );
}