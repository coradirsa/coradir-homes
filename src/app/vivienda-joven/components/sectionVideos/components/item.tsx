import Image from "next/image";

export default function Item({
    title,
    description,
    checkList,
    video,
    reverse = false,
    image,
}: {
    title: string;
    description: string;
    checkList: string[];
    video?:string;
    image?:string;
    reverse?: boolean;
}) {
    return ( 
        <section className="w-full bg-white py-10 flex items-center justify-center">
            <section className={`container flex  xl:h-[50vh] items-center justify-center ${reverse ? "flex-col-reverse xl:flex-row-reverse " : "flex-col-reverse xl:flex-row"}`}> 
                {video && <video src={video} autoPlay loop muted className="h-full w-full md:w-[40%]" />}
                {image && <Image src={image} alt={title} width={1000} height={1000} className="h-full w-full md:w-[40%]" />} 
                <div 
                    className={
                        " flex flex-col items-center justify-center z-10  py-8 bg-white w-full gap-5 "
                        + (reverse ? "md:-right-10 right-0" : "md:-left-10 left-0")
                    }>
                    <h2 className="text-3xl md:text-[50px] font-playfair text-center text-blue font-bold w-full">{title}</h2>
                    <p className="text-xl md:text-3xl font-raleway text-center  text-black w-full md:pl-14" dangerouslySetInnerHTML={{ __html: description }} />
                    <ul className="md:pl-32 flex flex-col items-start justify-start h-full w-full gap-2">
                        
                        {
                            checkList.map((item,index)=>(
                                <li key={`check-list-${index}`} className="flex items-center justify-center gap-5">
                                    <Image src="/icons/check.png" alt="check" width={100} height={100} className="w-16 h-16" />
                                    <p className="text-xl md:text-3xl font-raleway text-left xl:text-center text-black inline"  dangerouslySetInnerHTML={{ __html: item, }}/>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                 
            </section>
        </section>
    );
}