import MaterialIcon from "@/app/components/MaterialIcon";

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
            <MaterialIcon name={icon} className="shrink-0 text-[64px] text-blue" />
            <h3 className="text-blue font-playfair text-xl md:text-sm xl:text-2xl w-full">{title}</h3>
        </div>
    );
}
