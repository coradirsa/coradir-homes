"use client";

import Link from "next/link";
import { useWhatsAppUtm } from "../../hooks/useWhatsAppUtm";
import { Suspense, type MouseEvent } from "react";
import { isWhatsAppUrl, requestWhatsAppOpen } from "@/lib/whatsappMessage";

type WhatsAppLinkProps = React.ComponentProps<typeof Link>;

function WhatsAppLinkContent(props: WhatsAppLinkProps) {
    const { getTrackedUrl } = useWhatsAppUtm();
    const trackedHref = typeof props.href === "string" ? getTrackedUrl(props.href) : props.href;
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        props.onClick?.(event);

        if (event.defaultPrevented || typeof trackedHref !== "string" || !isWhatsAppUrl(trackedHref)) {
            return;
        }

        event.preventDefault();
        requestWhatsAppOpen({
            href: trackedHref,
            target: typeof props.target === "string" ? props.target : undefined,
        });
    };

    return <Link {...props} href={trackedHref} onClick={handleClick} />;
}

export default function WhatsAppLink(props: WhatsAppLinkProps) {
    return (
        <Suspense fallback={<Link {...props} />}>
            <WhatsAppLinkContent {...props} />
        </Suspense>
    );
}
