import Image from "next/image";

export default function ItemSpecification(
    {
        icon,
        title, 
    }: {
        icon: string;
        title: string;
    }
) {
    return (
        <div className="flex items-center justify-start px-3 py-1 rounded-full border-blue border-2 gap-2 w-80 xl:w-96">
            <Image 
                src={icon} 
                alt={title} 
                width={100}
                height={100}
                className="w-16 h-16"
            />
            <h3 className="text-blue font-playfair text-lg md:text-sm xl:text-xl w-full">{title}</h3>
        </div>
    );
}