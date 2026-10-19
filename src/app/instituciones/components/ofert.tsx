import ButtonContact from "@/app/components/buttonContact";
import { INSTITUCIONES_COPY } from "@/content/seo/copy";

export default function Ofert(){
    return(
    <section className="flex flex-col justify-start items-center container p-10 xl:p-16 pb-0 xl:pb-10 bg-white gap-6">
        <h2 className="text-black font-raleway text-2xl md:text-3xl uppercase text-center">{INSTITUCIONES_COPY.ofertHeading}</h2>
        <h3 className="text-blue font-playfair text-3xl md:text-4xl font-bold text-center">{INSTITUCIONES_COPY.ofertSubheading}</h3>
        <p className="text-black font-raleway text-xl xl:text-2xl text-center max-w-3xl">
            {INSTITUCIONES_COPY.ofertDescription}
        </p> 
        <ButtonContact 
            id="boton-homes-instituciones"
            href="/saber-mas/instituciones"
            className="bg-blue text-white hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2"
        />
    </section>  
    );
}
