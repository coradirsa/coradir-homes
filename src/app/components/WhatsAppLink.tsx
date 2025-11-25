"use client";

import Link from "next/link";
import { useWhatsAppUtm } from "../../hooks/useWhatsAppUtm";
import { ReactNode } from "react";

interface WhatsAppLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
}

export default function WhatsAppLink({ href, children, className, target, rel }: WhatsAppLinkProps) {
    const { getTrackedUrl } = useWhatsAppUtm();
    const trackedHref = getTrackedUrl(href);

    return (
        <Link
            href={trackedHref}
            className={className}
            target={target}
            rel={rel}
        >
            {children}
        </Link>
    );
}
