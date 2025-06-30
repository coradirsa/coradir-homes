import Link from "next/link";

export default function HoverLink({links}: {links: {href: string, label: string}[]}){
    return(
        <div className="hidden group-hover:flex flex-col justify-center items-center gap-5 
        pt-20 xl:pt-40 pb-10  p-4  bg-white   absolute w-full left-1/2 top-0 -translate-x-1/2  rounded-3xl shadow-[4px_2px_5px_0_rgba(0,0,0,0.5)]
        z-1 h-auto
        ">
            {links.map((link,index) => ( 
                <Link 
                    href={link.href} 
                    key={`hover-navlink-${index}`}
                    className="sm:text-xs w-full xl:w-[80%] text-center text-gray font-raleway uppercase xl:text-sm hover:underline"
                >{link.label}</Link> 
            ))} 
        </div>
    )
}