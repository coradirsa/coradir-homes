"use client";

import Link from "next/link";
import { useWhatsAppUtm } from "../../hooks/useWhatsAppUtm";
import { Suspense } from "react";

type WhatsAppLinkProps = React.ComponentProps<typeof Link>;

function WhatsAppLinkContent(props: WhatsAppLinkProps) {
    const { getTrackedUrl } = useWhatsAppUtm();
    const trackedHref = typeof props.href === "string" ? getTrackedUrl(props.href) : props.href;

    return <Link {...props} href={trackedHref} />;
}

export default function WhatsAppLink(props: WhatsAppLinkProps) {
    return (
        <Suspense fallback={<Link {...props} />}>
            <WhatsAppLinkContent {...props} />
        </Suspense>
    );
}
