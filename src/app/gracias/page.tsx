import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const { metadata: defaultMetadata } = createMetadata({
  pathname: "/gracias",
  overrides: {
    title: "Gracias por tu interés - Coradir Homes",
    description: "Hemos recibido tu consulta. Nuestro equipo se pondrá en contacto contigo pronto.",
  },
});

export const metadata: Metadata = defaultMetadata;

export default function GraciasPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue/10 to-white px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16">
          {/* Ícono de éxito */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-blue mb-6">
            ¡Gracias por contactarnos!
          </h1>

          {/* Mensaje */}
          <p className="text-lg md:text-xl text-gray-700 font-raleway mb-8 leading-relaxed">
            Hemos recibido tu solicitud y te contactaremos pronto para brindarte más información sobre nuestros proyectos.
          </p>

          {/* Mensaje adicional */}
          <div className="bg-blue/5 rounded-2xl p-6 mb-8">
            <p className="text-base md:text-lg text-blue font-raleway font-semibold">
              Vivir bien nunca fue tan sencillo.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-blue text-white px-8 py-4 rounded-full text-lg font-raleway font-semibold hover:bg-blue/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Volver al inicio
            </Link>

            <Link
              href="/#proyectos"
              className="border-2 border-blue text-blue px-8 py-4 rounded-full text-lg font-raleway font-semibold hover:bg-blue hover:text-white transition-colors duration-300"
            >
              Ver proyectos
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
