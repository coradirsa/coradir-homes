import Carrucel from "./components/carrucel"

export const metadata = {
    title: "Beneficios",
    description: "Beneficios",
}
export default function Page(){
    
    return(
        <>
            <section className="relative container bg-white flex flex-col items-center justify-start xl:py-16 xl:px-36 gap-5">
                <h1 className="text-blue font-playfair text-6xl xl:text-9xl font-bold text-left w-[80%]">Beneficios</h1>
                <h2 className="text-black font-raleway text-2xl xl:text-6xl text-left w-[80%] mb-10 xl:mb-20">DE ELEGIR CORADIR PARA <br/> <b>TUS INVERSIONES.</b></h2>
                <section className="flex flex-col items-center justify-center  w-[80%] gap-14 text-lg xl:text-3xl">
                    <p className="font-raleway text-black w-full">Accedé al mercado inmobiliario con <b>proyectos modernos, seguros y de alta rentabilidad.</b></p>
                    <p className="font-raleway text-black w-full">
                        <b>Con infraestructura inteligente, eficiencia 
                        energética y tecnología aplicada,</b> nuestras
                    unidades como Smart Building y Torre II 
                    maximizan el valor y <b>reducen costos 
                    operativos hasta un 80%.</b>
                    </p>
                    <p className="font-raleway text-black w-full">
                        Hacé crecer tu inversión con seguridad, innovación y visión de futuro.
                    </p>
                    <p className="font-raleway text-2xl xl:text-6xl text-center  text-black w-full">
                        <b>Invertí inteligente.<br/> Invertí con Coradir Homes.</b>
                    </p>
                </section>
                <Carrucel />
            </section>
        </>
    )
}