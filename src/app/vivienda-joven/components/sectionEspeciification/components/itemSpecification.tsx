import Image from "next/image";

export default function ItemSpecification(
    {
        icon,
        title, 
        border=true
    }: {
        icon: string;
        title: string;
        border?:boolean;
    }
) {
    return (
        <div className="flex items-center justify-start px-3 py-1 rounded-full gap-2 w-80 xl:w-96 " 
            style={{
                borderColor: border ? "var(--color-blue)" :"",
                borderWidth: border ? "2px" : ""
            }}
        >
            <Image 
                src={icon} 
                alt={title} 
                width={100}
                height={100}
                className="w-20 h-20"
            />
            <h3 className="text-blue font-playfair text-xl md:text-sm xl:text-2xl w-full">{title}</h3>
        </div>
    );
}