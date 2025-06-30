import Image from "next/image";

export default function CardInvestment({img,title,description}: {img:string,title:string,description:string}){
    return(
        <div className="flex justify-center items-center p-5 xl:w-[80%] w-full xl:mx-auto">
            <Image
                src={img}
                alt={title}
                width={1000}
                height={1000}
                className="xl:w-56 xl:h-56 w-24 h-24 object-cover"
            />
            <div className="flex flex-col justify-center items-start w-full">
                <h2 className="text-blue font-playfair text-xl xl:text-4xl font-bold">{title}</h2>
                <p className="text-black font-raleway text-sm xl:text-2xl">{description}</p>
            </div>
        </div>
    )
}