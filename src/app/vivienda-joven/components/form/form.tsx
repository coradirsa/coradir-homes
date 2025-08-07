"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputForm, SchemaFormViviendaJoven} from "./components/scheamFormViviendaJoven"
import { useRef } from "react"
import CustomInput from "@/app/saber-mas/[interes]/components/customInput" 

export default function FormularioInversion() {
  const { 
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SchemaFormViviendaJoven>({
    resolver: zodResolver(SchemaFormViviendaJoven),
  }) 

  const onSubmit = (data: SchemaFormViviendaJoven) => {
    console.log(data)
  };
  const inputs:InputForm[] = [
    { 
      name: "nombre", 
      label: "NOMBRE Y APELLIDO", 
      type: "text", 
      ref: useRef<HTMLInputElement>(null), 
      inputClassName:"bg-white text-blue w-full md:w-full h-12 rounded-md mb-5 pl-4",
      labelClassName:"text-blue text-xl md:text-3xl md:w-full md:text-right" 
    },
    { 
      name: "email", 
      label: "CORREO ELECTRÓNICO", 
      type: "email", 
      ref: useRef<HTMLInputElement>(null),
      inputClassName:"bg-white text-blue w-full md:w-full h-12 rounded-md mb-5 pl-4",
      labelClassName:"text-blue text-xl md:text-3xl md:w-full md:text-right"   
    },
    { 
      name: "celular", 
      label: "CELULAR", 
      type: "tel", ref: 
      useRef<HTMLInputElement>(null), 
      inputClassName:"bg-white text-blue w-full md:w-full h-12 rounded-md mb-5 pl-4",
      labelClassName:"text-blue text-xl md:text-3xl md:w-full md:text-right"   
    },
    { 
      name: "mensaje", 
      label: "TU MENSAJE (opcional)", 
      type: "textarea", ref:useRef<HTMLTextAreaElement>(null), 
      inputClassName:"bg-white text-blue w-full md:w-full h-12 rounded-md mb-10 ",
      labelClassName:"text-blue text-xl md:text-3xl md:w-full md:text-right"   
    },
  ]
  return (
    <section
      className="relative w-full flex items-center justify-center bg-white"
      style={{
        backgroundImage: 'url("/img/vivienda-joven/bg-form.jpg")', 
        backgroundSize: "fill",
        backgroundPosition: "center",
      }}
      id="formulario"
    >
      <div className="w-full h-full absolute top-0 left-0 bg-white/70 z-0"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col md:flex-row items-start justify-center gap-6 text-white container"
      >
        <section className="h-full w-full flex flex-col items-center md:items-start md:justify-start gap-2 md:gap-20">
          <h2 className="text-4xl md:text-9xl text-blue  md:w-[150%] font-playfair md:text-left text-center leading-tight font-bold">
            Descubrí una nueva<br />forma de vivir.
          </h2>

          <p className="text-center w-full text-xl md:text-3xl text-black font-raleway font-semibold md:font-extrabold md:text-left">
            Comunicate con nosotros:
          </p>

        </section>
        <section className="w-full md:w-[70%] flex flex-col items-center justify-center md:pt-56">
          {
            inputs.map((input)=>(
              <CustomInput<SchemaFormViviendaJoven>
                key={input.name}
                {...input}
                control={control}
                errors={errors} 
              />
            ))
          } 
          <button
            type="submit"
            className="bg-blue text-white max-w-96 mx-auto text-2xl md:text-3xl py-3 px-16 rounded-full hover:bg-blue/70 transition uppercase cursor-pointer"
          >
            ¡QUIERO INVERTIR!
          </button>
        </section> 
         
      </form>
   </section>
)
}