import Image from "next/image";
import ButtonContact from "../components/buttonContact";

export const metadata = {
    title: "Casa Joven",
    description: "Casa Joven",
};
export default function CasaJoven() {
    return (
        <>
            <section className="relative container flex flex-col items-center justify-start gap-5 min-h-[100vh]  xl:pb-0 py-5">
                <h1 className="text-blue font-playfair text-6xl xl:text-8xl font-bold xl:mb-10 mb-5">Casa Jóven</h1>
                <div 
                className={`flex flex-col items-center justify-center text-white py-4 px-5 text-center  gap-2 
                bg-blue-gray rounded-full rounded-tr-none w-[90%] xl:w-[50%] xl:px-20 `}> 
                    <p className=" font-raleway text-lg xl:text-3xl ">Acceder a tu primer departamento nunca fue tan fácil, rápido y accesible.</p> 
                </div> 
                <section className="relative xl:px-16 px-4 w-full xl:pt-8 pt-2 flex flex-col items-center justify-center gap-6  xl:mb-10">
                    <p className=" text-center text-black text-lg font-raleway xl:text-3xl w-[90%] xl:w-[50%]">
                        Tu nuevo comienzo empieza en Coradir Homes. 
                        Viviendas modernas, seguras y accesibles,
                        pensadas para acompañarte en cada etapa de la
                        vida. Ya seas madre soltera, pareja mayor o familia
                        primeriza, encontrá un hogar funcional, sin estrés
                        ni complicaciones
                    </p>
                    <Image
                        src="/img/casa_joven_1.png"
                        alt="Casa Joven"
                        width={1000}
                        height={1000}
                        className="hover:scale-110 transition-all duration-300 xl:w-72 xl:h-72 w-56 h-56  z-10 xl:absolute xl:-top-4 xl:right-0 rounded-full"
                    /> 
                    
                </section>
                <section className="relative xl:px-16 px-4 w-full   flex flex-col items-center justify-center gap-6 xl:mb-10">
                    <p className="text-center text-black font-raleway xl:text-3xl xl:w-[50%]">
                        <b>Confort total desde el primer día:</b><br/>
                        Sin preocuparte por mantenimiento ni estructura.
                    </p>
                    <p className="text-center text-black font-raleway xl:text-3xl xl:w-[50%]">
                        <b>Seguridad inteligente 24/7: </b><br/>
                        Vigilancia en tiempo real con IA para que descanses tranquila.
                    </p>
                    <p className="text-center text-black font-raleway xl:pl-0 xl:text-3xl xl:w-[50%]">
                        <b>Tecnología que simplifica tu vida:</b><br/>
                        Todo pensado para un estilo de vida cómodo y actual.
                    </p>
                    <p className="text-center text-black font-raleway xl:pl-0 xl:text-3xl xl:w-[50%]">
                        <b>Ubicación estratégica + precio accesible:</b><br/>
                        Calidad y conectividad sin sacrificar tu presupuesto.
                    </p>
                    <Image
                        src="/img/casajoven_2.png"
                        alt="Casa Joven"
                        width={1000}
                        height={1000}
                        className="hover:scale-110 transition-all duration-300  xl:w-72 xl:h-72 w-56 h-56 xl:absolute xl:-top-4 xl:left-0 object-cover rounded-full"
                    />
                </section>
                <section className="relative flex flex-col items-center xl:items-center justify-center xl:gap-10 xl:w-[80%] px-5 xl:pr-0 xl:py-20">
                    
                    <div className="relative flex flex-col items-center justify-center gap-8 sm:w-[70%] xl:w-full py-10">
                        <p className="text-black text-center font-raleway text-xl xl:text-5xl  font-bold  xl:w-[70%] ">
                            Vivir bien nunca fue tan sencillo. Conectá con nosotros y encontrá el hogar que se adapta a vos.
                        </p> 
                        <ButtonContact 
                            id="boton-homes-casa-joven"
                            href="/saber-mas/casa-joven"
                            className="!text-lg z-10 bg-blue text-white  hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2"
                        />
                        <div
                        aria-hidden="true"
                        className="absolute xl:-left-32 -left-12 xl:-bottom-20 -bottom-0 w-full h-full  xl:h-96 pointer-events-none z-0"
                        style={{
                            backgroundImage: "url('/img/torre.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left", 
                            backgroundSize: "contain",
                            
                        }}
                    />
                    </div>
                    <Image
                            src="/img/casa_joven_3.png"
                            alt="Casa Joven"
                            width={1000}
                            height={1000}
                            className="hover:scale-110 transition-all duration-300 xl:w-96 xl:h-96 w-56 h-56 z-10 xl:absolute xl:-top-30 xl:-right-40 2xl:-right-50 rounded-full my-8"
                        />
                </section>
            </section>
        </>
    );
}