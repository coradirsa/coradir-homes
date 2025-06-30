import ButtonContact from "../../buttonContact";
export default function SectionInvestments(){
    return(
        <section className="w-full xl:w-[80%] flex flex-col xl:flex-row items-center justify-center gap-10">
            <h2 className="font-raleway text-black text-4xl xl:text-6xl">
                Tu oportunidad de <br/> 
                <b className="text-blue font-bold font-playfair text-5xl xl:text-9xl">Inversión</b>
            </h2>
            <div className="w-full flex flex-col justify-center items-center gap-5 xl:!w-[30%] ">
                <p className="text-lg xl:text-xl font-raleway text-black">
                    <b>Invertí con seguridad,</b> incluso sin experiencia previa,
                    y sé parte activa del desarrollo inmobiliario.
                </p> 
                <ButtonContact 
                id="boton-homes-home-inversiones"
                    href="/saber-mas/inversiones"
                    className="!text-lg bg-blue hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2 text-white link-clip-inverse"
                />
            </div>
        </section>
    )
}