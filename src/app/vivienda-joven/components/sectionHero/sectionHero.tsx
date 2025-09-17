import Image from "next/image";
import ButtonContact from "../../../components/buttonContact"
export default function SectionHero() {
    const H = 80;
    return (
        <section className={`relative w-full flex flex-col items-center justify-center gap-8 md:gap-14`} style={{ height: `${H}vh` }}>
        <h1
         className="text-4xl md:text-5xl xl:text-8xl text-center font-playfair text-white"
         style={{
            textShadow: '6px 3px 4px rgba(0,0,0,0.5)',
         }}
        > Senderos de Koslay: <br/><span className="text-4xl xl:text-6xl">tu nuevo hogar a precio accesible.</span></h1>
        <p
            className="text-center text-white max-w-[90%] md:max-w-full text-xl md:text-lg xl:text-3xl"
            style={{
                textShadow: '6px 3px 4px rgba(0,0,0,0.5)',
            }}
        > Departamentos inteligentes en Juana Koslay · <br/> Entrega proyectada · Cupos limitados</p>
        <ButtonContact href="#formulario" className="text-xs md:text-2xl uppercase bg-white text-blue hover:bg-white/40 hover:text-white hover:border-white border-1 py-5" label="CONSULTA HOY MISMO QUE SE AGOTAN"/>
        <Image 
            src="/img/vivienda-joven/hero.webp"
            alt="Vivienda Joven"
            width={2000}
            height={2000}
            className={`absolute top-0 left-0 w-full object-cover object-left -z-2`} 
            style={{ height: `${H}vh` }}
        />
    </section>
    );
}