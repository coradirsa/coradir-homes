import Image from "next/image"
import Ofert from "./components/ofert"
import CardInvestment from "../components/cardInvestment"
export const metadata = {
    title: "Instituciones",
    description: "Invertí de manera inteligente y obtené retornos rápidos y seguros.",
}
export default function Instituciones() {
    const characteristic = [
        {
            img: "/icons/1_infraestructura_sin_inversión_inicial.png",
            title: "Infraestructura sin inversión inicial",
            description: `La universidad o escuela solo aporta el terreno, sin necesidad de destinar fondos propios,
                el proyecto proporciona una mejora urbanistica del campus o predio institucional.
            `,
        },
        {
            img: "/icons/2_accesibilidad.png",
            title: "Accesibilidad",
            description: `Costos de arrendamiento accesibles para alumnos, promoviendo inclusión educativa.
            `,
        },
        {
            img: "/icons/3_edificios_inteligentes.png",
            title: "Edificios inteligentes",
            description: `Uso de tecnologia avandaza para optimizar consumo energético, seguridad y comodidad.
            `,
        },
        {
            img: "/icons/4_impacto_social_positivo.png",
            title: "Impacto social positivo",
            description: `Contribucíon al acceso de viviendas para estudiantes.
            `,
        },
        {
            img: "/icons/5_modelo_seguro.png",
            title: "Modelo seguro",
            description: `Propiedad administrada por CORADIR, minimizando riesgos.
            `,
        },
    ]
    return (
        <>
            <section className="flex flex-col justify-end items-center p-16 relative h-[60vh] xl:h-[80vh]"> 
                <h1 
                    className="z-10 flex flex-col justify-center items-center font-playfair text-5xl xl:text-8xl gap-4 text-white l:mt-20 "
                    aria-label="Instituciones"
                    style={{ textShadow: '6px 3px 4px rgba(0,0,0,0.5)' }}
                >
                    Instituciones
                </h1> 
                <Image 
                    priority={true}
                    loading="eager"
                    src="/img/instituciones_hero.jpg" 
                    alt="Hero Pagina Principal" 
                    aria-label="Hero Pagina Principal"
                    width={2000} 
                    height={2000} 
                    className="w-[100vw] h-[60vh] xl:h-[80vh] object-top object-fill   absolute top-0 left-0 "
                />
            </section>
            <Ofert/>
            <section className="flex flex-col items-center justify-center container relative overflow-hidden xl:px-20 pb-10 xl:py-10">
                <hr className="xl:hidden w-[80%] h-[1px] bg-blue rounded-full my-12" />
                {
                    characteristic.map((characteristic,index) => (
                        <CardInvestment key={`characteristic-${index}`} {...characteristic}/>
                    ))
                }
                <div
                    aria-hidden="true"
                    className="absolute -right-36 bottom-0 w-full h-full pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/img/torre.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right", 
                        backgroundSize: "contain", 
                    }}
                />
            </section>
        </>
    )
}