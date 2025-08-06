import Image from "next/image";

export default function SectionVideos({
    title,
    description,
    checkList,
    video,
    reverse = false
}: {
    title: string;
    description: string;
    checkList: string[];
    video:string;
    reverse?: boolean;
}) {
    return ( 
        <section className="w-full bg-white py-10 flex items-center justify-center">
            <section className={`container flex  md:h-[50vh] items-center justify-center ${reverse ? "flex-col-reverse md:flex-row-reverse " : "flex-col md:flex-row"}`}> 
                <video src={video} autoPlay loop muted className="h-full w-full md:w-[40%]" />
                <div className="relative md:h-full w-full bg-[#e3e9fa] h-[60vh]">
                    <div 
                        className={
                            "absolute flex flex-col items-center justify-center top-1/2 transform -translate-y-1/2 z-10  rounded-4xl py-8 bg-white w-full gap-5 "
                            + (reverse ? "md:-right-10 right-0" : "md:-left-10 left-0")
                        }>
                        <h2 className="text-3xl md:text-[50px] font-playfair text-center text-blue font-bold w-full">{title}</h2>
                        <p className="text-xl md:text-3xl font-raleway text-center md:text-left text-black w-full md:pl-14" dangerouslySetInnerHTML={{ __html: description }} />
                        <ul className="md:pl-32 flex flex-col items-start justify-start h-full w-full gap-2">
                            
                            {
                                checkList.map((item,index)=>(
                                    <li key={`check-list-${index}`} className="flex items-center justify-center gap-5">
                                        <Image src="/icons/check.png" alt="check" width={100} height={100} className="w-16 h-16" />
                                        <p className="text-xl md:text-3xl font-raleway text-center text-black inline">{item}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                
                </div> 
            </section>
        </section>
    );
}