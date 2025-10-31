"use client";
import Link from "next/link";

type ButtonContactProps = {
    href: string;
    className?: string;
    id?: string;
    label?: string;
};

const DEFAULT_LABEL = "Saber mas";

export default function ButtonContact({ href, className = "", id, label = DEFAULT_LABEL }: ButtonContactProps){
    return(
        <Link
            id={id}
            href={href}
            className={`xl:text-3xl text-xl z-10 xl:px-24 px-10 py-2 xl:py-4 rounded-full uppercase transition-colors duration-300 ease-in-out ${className}`}
        >
            {label}
        </Link>
    );
}
