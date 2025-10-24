import ButtonContact from "../../buttonContact";
import { HOME_COPY } from "@/content/seo/copy";

export default function SectionInvestments(){
    return(
        <section className="w-full xl:w-[80%] flex flex-col xl:flex-row items-center justify-center gap-10">
            <h2 className="font-raleway text-black text-4xl xl:text-6xl text-center xl:text-left">
                {HOME_COPY.investments.title}
                <span className="block text-blue font-bold font-playfair text-5xl xl:text-9xl">
                    {HOME_COPY.investments.highlight}
                </span>
            </h2>
            <div className="w-full flex flex-col justify-center items-center gap-5 xl:w-[30%] text-center xl:text-left">
                <p className="text-lg xl:text-xl font-raleway text-black">
                    {HOME_COPY.investments.description}
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
