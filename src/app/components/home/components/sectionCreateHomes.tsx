import SectionInvestments from "./sectionInvestments";
import SectionActives from "./sectionActives";

export default function SectionCreateHomes(){
    return(
        <section className="flex flex-col items-center justify-center bg-white rounded-t-4xl p-10 container xl:pt-20">
            <h2 className="text-3xl xl:text-6xl w-full xl:w-[50%] text-center font-playfair text-blue font-bold">Creamos hogares con diseño, confort y sostenibilidad.</h2>
            <p className="text-lg xl:text-xl w-full text-center font-raleway text-black mt-10"> Ofrecemos espacios que <b>elevan la calidad de vida.</b> <br/>  </p>
            <p className="text-lg xl:text-xl w-full text-center font-raleway text-black mb-20">Integramos <b>tecnología inteligente</b>  soluciones <b>eco-eficientes.</b> </p>
            
            <SectionInvestments/>  
            <SectionActives/>
        </section>
    )
}