"use client";

import Link from "next/link";
import { useWhatsAppUtm } from "../../hooks/useWhatsAppUtm";
import { ReactNode, Suspense } from "react";

interface WhatsAppLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
}

function WhatsAppLinkContent({ href, children, className, target, rel }: WhatsAppLinkProps) {
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

export default function WhatsAppLink(props: WhatsAppLinkProps) {
    return (
        <Suspense fallback={
            <Link
                href={props.href}
                className={props.className}
                target={props.target}
                rel={props.rel}
            >
                {props.children}
            </Link>
        }>
            <WhatsAppLinkContent {...props} />
        </Suspense>
    );
}
