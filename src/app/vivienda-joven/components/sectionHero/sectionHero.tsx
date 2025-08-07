import Image from "next/image";
import ButtonContact from "../../../components/buttonContact"
export default function SectionHero() {
    const H = 70;
    return (
        <section className={`relative w-full flex flex-col items-center justify-center gap-8 md:gap-14`} style={{ height: `${H}vh` }}>
        <h1
         className="text-3xl md:text-5xl xl:text-8xl text-center font-playfair text-white"
         style={{
            textShadow: '6px 3px 4px rgba(0,0,0,0.5)',
         }}
        > Reservá tu futuro hogar<br/>desde $250 USD mensuales</h1>
        <p className="text-center text-white text-lg xl:text-3xl"> Departamentos inteligentes en Juana Koslay · <br/> Entrega proyectada · Cupos limitados</p>
        <ButtonContact href="#formulario" className="uppercase bg-white text-blue hover:bg-white/40 hover:text-white hover:border-white border-1" label=" RESERVÁ AHORA EN PREVENTA"/>
        <div className={`absolute top-0 left-0 w-full -z-1 bg-[rgba(26,52,85,0.5)]`} style={{ height: `${H}vh` }}></div>
        <Image 
            src="/img/vivienda-joven/hero.png"
            alt="Vivienda Joven"
            width={1000}
            height={1000}
            className={`absolute top-0 left-0 w-full object-cover object-top-left -z-2`} 
            style={{ height: `${H}vh` }}
        />
    </section>
    );
}