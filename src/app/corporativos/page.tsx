import Image from "next/image"; 
import ButtonContact from "../components/buttonContact";
import { JSX } from "react";
export const metadata = {
    title: "Corporativos",
    description: "Corporativos",
}
export default function Page(){
    const benefits:JSX.Element[] = [
        <span key="benefit-1">Trámite ágil y <b>garantía empresarial.</b></span>,
        <span key="benefit-2">Costos operativos optimizados <b>enfocados en tu crecimiento.</b></span>,
        <span key="benefit-3"><b>Ubicación inteligente,</b> conectividad para empleados, clientes.</span>,
        <span key="benefit-4">Contratos flexibles y precios transparentes.</span>
    ]
    return (
        <>
            <section className="relative xl:container bg-white flex flex-col items-start  xl:mx-auto justify-start px-10  mt-10 xl:py-16 xl:px-36 gap-5">
                <h1 className="text-blue font-playfair text-6xl xl:text-9xl font-bold md:mb-5">Corporativos</h1>
                <p className="text-black font-raleway text-lg xl:text-5xl  md:w-[50%] mt-5 xl:mt-20w-full">Invertí en eficiencia para tu empresa con <b>Coradir Homes.</b></p>
                <p className="text-black font-raleway text-lg xl:text-5xl md:w-[50%] w-full"> <b>¡Soluciones habitacionales listas para tu equipo!</b> <br/> Departamentos modernos, conectividad de punta y ubicación estratégica para optimizar tiempos y recursos.</p>
                <Image
                    src="/img/pagina_corporativos_inicio.jpg"
                    alt="Corporativos"
                    width={3000}
                    height={3000}
                    className="xl:w-[45%] md:h-[67%] w-full h-[40vh] md:absolute relative z-10 top-[20%] md:-right-20 rounded-4xl object-cover object-right"
                />
                <div className="flex flex-col items-start justify-start gap-5 xl:py-20 py-5 w-full relative">
                </div>
            </section>  
            <section className="relative container bg-white flex flex-col items-center justify-start xl:py-16 xl:px-36 gap-5">
                <h2 className="uppercase text-black font-raleway text-2xl xl:text-7xl font-bold text-center">¡CONOCÉ LOS BENEFICIOS!</h2>
                <div className="flex flex-col items-center justify-center py-10 gap-8 xl:w-full w-[90%]">
                    {benefits.map((benefit,index) => (
                        <div key={`benefit-${index}`} className="flex items-center justify-center gap-5 w-full">
                            <Image
                                src="/icons/check.png"
                                alt="Beneficios"
                                width={100}
                                height={100}
                                className="xl:w-20 xl:h-20 w-10 h-10"
                            />
                            <p className="text-black font-raleway text-lg xl:text-5xl w-[80%]">{benefit}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="relative w-full">
                <Image
                    src="/img/coraporativos_final.jpg"
                    alt="Corporativos"
                    width={3000}
                    height={3000}
                    className="w-full xl:h-[80vh] xl:object-fill h-[50vh] object-top"
                /> 
                <ButtonContact 
                    id="boton-homes-corporativos" 
                    href="/saber-mas/corporativos"
                    className=" hover:text-white hover:border-white hover:bg-blue/80 border-blue  border-2 absolute bottom-10 xl:bottom-32  left-1/2 transform -translate-x-1/2  text-blue  bg-white"
                />
            </section>
        </>
    )
}