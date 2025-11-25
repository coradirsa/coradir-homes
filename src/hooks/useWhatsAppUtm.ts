"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useWhatsAppUtm() {
    const searchParams = useSearchParams();

    const getTrackedUrl = useCallback((originalUrl: string) => {
        try {
            const source = searchParams.get("utm_source");
            if (!source) return originalUrl;

            const url = new URL(originalUrl);
            if (!url.hostname.includes("wa.me") && !url.hostname.includes("whatsapp.com")) {
                return originalUrl;
            }

            const currentText = url.searchParams.get("text") || "";
            // Decode to handle existing encoded characters correctly
            const decodedText = decodeURIComponent(currentText);

            // Clean up "Hola!" if it exists at the start to avoid redundancy
            const cleanText = decodedText.replace(/^Hola!\s*/i, "").replace(/^Hola\s*/i, "");

            const sourceMessage = `Hola, vi en ${source} y`;
            const newText = `${sourceMessage} ${cleanText}`;

            url.searchParams.set("text", newText);
            return url.toString();
        } catch (error) {
            console.error("Error parsing WhatsApp URL:", error);
            return originalUrl;
        }
    }, [searchParams]);

    return { getTrackedUrl };
}
