"use client";
import Link from "next/link";
import { GAEvents } from "@/lib/analytics/gtag";

type ButtonContactProps = {
    href: string;
    className?: string;
    id?: string;
    label?: string;
};

const DEFAULT_LABEL = "Saber mas";

export default function ButtonContact({ href, className = "", id, label = DEFAULT_LABEL }: ButtonContactProps){
    const handleClick = () => {
        const isWhatsApp = href.includes('wa.me') || href.includes('whatsapp');

        if (isWhatsApp) {
            GAEvents.whatsappClick(
                window.location.pathname,
                label
            );
        } else {
            GAEvents.ctaClick(
                label,
                window.location.pathname,
                'link'
            );
        }
    };

    return(
        <Link
            id={id}
            href={href}
            onClick={handleClick}
            className={`xl:text-3xl text-xl z-10 xl:px-24 px-10 py-2 xl:py-4 rounded-full uppercase transition-colors duration-300 ease-in-out ${className}`}
        >
            {label}
        </Link>
    );
}
