import Image from "next/image"; 
import CardChar from "./cardChar";
import ButtonContact from "../../components/buttonContact";
export default function Page(){
    const characteristic = [
        {title:"Tu tierra, tu inversión.",description:`Convertí tu terreno sin uso en un desarrollo inmobiliario sin
necesidad de inversión adicional.`},
        {title:"Nosotros construimos, vos ganás.", description:`Te aseguramos calidad, diseño estratégico y máxima rentabilidad.`},
        {title:"Ingresos grantizados.", description:`
            Recibís unidades listas para alquilar, con gestión completa
y ocupación rápida.`},
        {title:"Modelo sin riesgos.", description:`
            Nos encargamos de todo: construcción, administración y rentabilidad.`},
        {title:"Rentabilidad asegurada.", description:`
            Los alquileres de los departamentos generarán ingresos
recurrentes, aumentando tu patrimonio sin esfuerzo.`}
    ]
    return(
        <>
            <section className="flex flex-col justify-end items-center p-16 relative h-[30vh] xl:h-[70vh]"> 
                <h1 
                    className="z-10 flex flex-col justify-center items-center font-playfair text-7xl xl:text-8xl gap-4 text-white xl:mt-20 "
                    aria-label="Terrenos"
                    style={{ textShadow: '6px 3px 4px rgba(0,0,0,0.5)' }}
                >
                Terrenos
                </h1> 
                <Image 
                    priority={true}
                    loading="eager"
                    src="/img/terrenos_hero.png" 
                    alt="Hero Pagina Principal" 
                    aria-label="Hero Pagina Principal"
                    width={2000} 
                    height={2000} 
                    className="w-[100vw] h-[30vh] xl:h-[70vh] object-contain md:object-cover object-top absolute top-0 left-0 "
                />
            </section>
            <section className="flex flex-col justify-start items-center container p-10 xl:p-16 bg-white">
                <h2 className="text-blue font-playfair text-3xl xl:text-7xl font-bold">¿Tenés un terreno?</h2>
                <h2 className="text-black font-raleway text-2xl xl:text-7xl uppercase">Convertilo en ingresos</h2>
                <p className="text-black text-center font-raleway text-xl xl:text-4xl  my-10">
                    Sumate a nuestro sistema aportando tu terreno<br className="hidden xl:block"/>
                    y recibis propiedades listas para alquilar.<br className="hidden xl:block"/>
                    Fácil, rentable y sin necesidad de invertir capital.  
                </p> 
            </section>  
            <section className="flex flex-col items-center justify-center w-full max-w-[2000px] mx-auto xl:container relative xl:px-56 py-10 pt-0 gap-8 xl:pb-26">
                <ButtonContact 
                    id="boton-homes-terrenos"
                    href="/saber-mas/terrenos"
                    className="bg-blue  text-white mb-16 hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2"
                />
                {
                    characteristic.map((characteristic,index) => (
                        <CardChar 
                            key={`characteristic-${index}`} 
                            {...characteristic}  
                            className={index % 2 === 0 ? 
                                "bg-blue-gray rounded-full rounded-tr-none" : 
                                "bg-blue rounded-full rounded-tl-none"  } 
                        />
                    ))
                }
                
            </section>
        </>
    );
}
    