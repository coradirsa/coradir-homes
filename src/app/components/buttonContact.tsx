import Link from "next/link";
export default function ButtonContact({href, className, id}: {href: string, className?: string, id?: string}){
    return(
        <Link id={id} href={href} className={`xl:text-3xl text-xl z-10 xl:px-24 px-10 py-2 xl:py-4 rounded-full uppercase  ${className} transition-colors duration-300 ease-in-out`}>
            ¡Saber más!
        </Link>
    )
}