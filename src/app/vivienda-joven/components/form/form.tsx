"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormData, schema } from "./components/scheam"

export default function FormularioInversion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center justify-center bg-white"
      style={{
        backgroundImage: 'url("/img/vivienda-joven/bg-form.jpg")', 
        backgroundSize: "fill",
        backgroundPosition: "center",
      }}
      id="formulario"
    >
      <div className="w-full h-full absolute top-0 left-0 bg-white/60 z-0"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-4xl md:text-5xl text-blue font-playfair font-bold text-center leading-tight">
            Descubrí una nueva<br />forma de vivir.
            </h2>

            <p className="w-full max-w-xl text-black font-raleway font-semibold text-center">
            Comunicate con nosotros:
            </p>

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl flex flex-col gap-4">
          <input
            type="text"
            placeholder="NOMBRE Y APELLIDO"
            {...register("nombre")}
            className="bg-white border border-gray-300 px-4 py-3 rounded-md text-blue placeholder:text-blue"
          />
          {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}

          <input
            type="email"
            placeholder="CORREO ELECTRÓNICO"
            {...register("email")}
            className="bg-white border border-gray-300 px-4 py-3 rounded-md text-blue placeholder:text-blue"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <input
            type="tel"
            placeholder="CELULAR"
            {...register("celular")}
            className="bg-white border border-gray-300 px-4 py-3 rounded-md text-blue placeholder:text-blue"
          />
          {errors.celular && <span className="text-red-500 text-sm">{errors.celular.message}</span>}

          <input
            type="text"
            placeholder="TU MENSAJE (opcional)"
            {...register("mensaje")}
            className="bg-white border border-gray-300 px-4 py-3 rounded-md text-blue placeholder:text-blue"
          />

          <button
            type="submit"
            className="bg-blue text-white font-semibold py-3 rounded-md hover:opacity-90 transition"
          >
            ¡QUIERO INVERTIR!
          </button>
        </form>
      </div>
    </section>
  )
}
