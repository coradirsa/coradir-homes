import MaterialIcon from "./MaterialIcon";

export default function CardInvestment({img,title,description}: {img:string,title:string,description:string}){
    return(
        <div className="flex justify-center items-center p-5 xl:w-[70%] max-w-5xl w-full xl:mx-auto">
            <MaterialIcon name={img} className="shrink-0 text-[96px] text-blue xl:text-[120px]" />
            <div className="flex flex-col justify-center items-start w-full">
                <h2 className="text-blue font-playfair text-xl xl:text-3xl font-bold">{title}</h2>
                <p className="text-black font-raleway text-sm md:text-lg xl:text-xl">{description}</p>
            </div>
        </div>
    )
}
