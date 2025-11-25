<<<<<<< HEAD
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
=======
import { useSearchParams } from "next/navigation";

export const useWhatsAppUtm = () => {
    const searchParams = useSearchParams();
    const source = searchParams.get("utm_source");

    const getTrackedUrl = (originalUrl: string) => {
        // If no source or invalid URL, return original
        if (!source || !originalUrl) return originalUrl;

        // Skip relative URLs (e.g. #formulario, /contacto) as they are not WhatsApp links
        if (!originalUrl.startsWith("http")) return originalUrl;

        try {
            const url = new URL(originalUrl);

            // Only modify WhatsApp URLs
>>>>>>> f05eb87 (feat: generalize UTM tracking for WhatsApp and fix iOS video autoplay)
            if (!url.hostname.includes("wa.me") && !url.hostname.includes("whatsapp.com")) {
                return originalUrl;
            }

            const currentText = url.searchParams.get("text") || "";
<<<<<<< HEAD
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
=======

            // Avoid double prefixing if already present (simple check)
            if (currentText.includes(`Vi en ${source}`)) {
                return originalUrl;
            }

            // Clean up "Hola!" if it exists at the start to make the sentence flow better
            // e.g. "Hola! Quiero info" -> "Hola, vi en linkedin y Quiero info"
            let cleanText = currentText;
            if (cleanText.startsWith("Hola! ")) {
                cleanText = cleanText.replace("Hola! ", "");
            } else if (cleanText.startsWith("Hola ")) {
                cleanText = cleanText.replace("Hola ", "");
            }

            const sourceMessage = `Hola, vi en ${source} y`;
            const newText = `${sourceMessage} ${cleanText}`.trim();

            url.searchParams.set("text", newText);
            return url.toString();

        } catch (error) {
            // Silently fail and return original URL to avoid crashing the app
            console.error("Error parsing WhatsApp URL:", error);
            return originalUrl;
        }
    };

    return { getTrackedUrl };
};
>>>>>>> f05eb87 (feat: generalize UTM tracking for WhatsApp and fix iOS video autoplay)
