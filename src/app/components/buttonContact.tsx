"use client";
import Link from "next/link";

type ButtonContactProps = {
    href: string;
    className?: string;
    id?: string;
    label?: string;
};

import { useWhatsAppUtm } from "../../hooks/useWhatsAppUtm";
import { Suspense } from "react";

const DEFAULT_LABEL = "Saber más";

function ButtonContactContent({ href, className = "", id, label = DEFAULT_LABEL }: ButtonContactProps) {
    const { getTrackedUrl } = useWhatsAppUtm();
    const trackedHref = getTrackedUrl(href);

    return (
        <Link
            id={id}
            href={trackedHref}
            className={`xl:text-3xl text-xl z-10 xl:px-24 px-10 py-2 xl:py-4 rounded-full uppercase transition-colors duration-300 ease-in-out ${className}`}
        >
            {label}
        </Link>
    );
}

export default function ButtonContact(props: ButtonContactProps) {
    return (
        <Suspense fallback={
            <Link
                id={props.id}
                href={props.href}
                className={`xl:text-3xl text-xl z-10 xl:px-24 px-10 py-2 xl:py-4 rounded-full uppercase transition-colors duration-300 ease-in-out ${props.className}`}
            >
                {props.label || DEFAULT_LABEL}
            </Link>
        }>
            <ButtonContactContent {...props} />
        </Suspense>
    );
}
