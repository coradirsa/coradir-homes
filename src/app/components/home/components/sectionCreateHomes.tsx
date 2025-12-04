import { HOME_COPY } from "@/content/seo/copy";
import Link from "next/link";
import SectionInvestments from "./sectionInvestments";
import SectionActives from "./sectionActives";

export default function SectionCreateHomes(){
    return(
        <section className="w-full flex items-center justify-center bg-white">
            <section className="flex flex-col items-center justify-center bg-white rounded-t-4xl p-10 container xl:pt-20 gap-10">
                <h2 className="text-3xl xl:text-6xl w-full xl:w-[60%] text-center font-playfair text-blue font-bold">
                    {HOME_COPY.createHomes.heading}
                </h2>
                <p className="text-lg xl:text-xl w-full text-center font-raleway text-black">
                    {HOME_COPY.createHomes.lead}
                </p>
                <p className="text-lg xl:text-xl w-full text-center font-raleway text-black">
                    {HOME_COPY.createHomes.sublead}
                </p>

                {/* Internal contextual links */}
                <div className="flex flex-wrap justify-center gap-4 text-sm xl:text-base">
                    <Link href="/juana-64" className="text-blue hover:underline font-raleway">
                        Juana 64
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/la-torre-ii" className="text-blue hover:underline font-raleway">
                        La Torre II
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/beneficios" className="text-blue hover:underline font-raleway">
                        Beneficios
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/proyectos" className="text-blue hover:underline font-raleway">
                        Ver todos los proyectos
                    </Link>
                </div>

                <SectionInvestments/>
                <SectionActives/>
            </section>

        </section>

    )
}
