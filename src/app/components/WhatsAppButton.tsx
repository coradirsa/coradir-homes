"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWhatsAppUtm } from "@/hooks/useWhatsAppUtm";

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showScrollTooltip, setShowScrollTooltip] = useState(false);
    const [wasManuallyDismissed, setWasManuallyDismissed] = useState(false);
    const pathname = usePathname();
    const { getTrackedUrl } = useWhatsAppUtm();

    // WhatsApp number from siteConfig
    const WHATSAPP_NUMBER = "5492664547788"; // +54 266 454-7788

    useEffect(() => {
        // Show button after page is loaded
        const timer = setTimeout(() => {
            setIsVisible(true);
            // Show tooltip after 3 seconds
            setTimeout(() => setShowTooltip(true), 3000);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Hide tooltip after 8 seconds of being shown
        if (showTooltip) {
            const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
            return () => clearTimeout(hideTimer);
        }
    }, [showTooltip]);

    useEffect(() => {
        // Scroll listener for 50% scroll - shows tooltip every time user scrolls past 50%
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / documentHeight) * 100;

            if (scrollPercentage >= 50 && !wasManuallyDismissed) {
                setShowScrollTooltip(true);
            } else if (scrollPercentage < 50) {
                // Reset when scrolling back up - allows tooltip to show again
                setShowScrollTooltip(false);
                setWasManuallyDismissed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [wasManuallyDismissed]);

    // Removed auto-hide for scroll tooltip - it now only closes when user clicks X

    // Generate personalized message based on current page
    const getPersonalizedMessage = (): string => {
        const messages: Record<string, string> = {
            "/": "Hola! Estoy interesado en conocer más sobre sus propiedades",
            "/proyectos": "Hola! Vi los proyectos y me gustaría más información",
            "/la-torre-ii": "Hola! Me interesa La Torre II, quisiera más detalles",
            "/juana-64": "Hola! Me interesa Juana 64, quisiera más información",
            "/complejo-coradir": "Hola! Me interesa el Complejo Coradir, quisiera más detalles",
            "/inversiones-inteligentes": "Hola! Me interesa invertir, quisiera más información",
            "/contacto": "Hola! Quisiera ponerme en contacto con ustedes",
        };

        // Check for exact match first
        if (messages[pathname]) {
            return messages[pathname];
        }

        // Check for partial match (e.g., /saber-mas/*)
        if (pathname.startsWith("/saber-mas")) {
            return "Hola! Quisiera recibir más información sobre sus propiedades";
        }

        // Default message
        return "Hola! Estoy interesado en sus propiedades";
    };

    const handleClick = () => {
        const message = encodeURIComponent(getPersonalizedMessage());
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        const trackedUrl = getTrackedUrl(whatsappUrl);

        // Track event with gtag
        if (typeof window !== 'undefined' && 'gtag' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).gtag('event', 'whatsapp_click', {
                event_category: 'engagement',
                event_label: pathname,
                value: pathname,
            });
        }

        window.open(trackedUrl, "_blank", "noopener,noreferrer");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 xl:bottom-6 xl:right-6 z-50 flex flex-col items-end gap-3">
            {/* Initial Tooltip Message */}
            {showTooltip && !showScrollTooltip && (
                <div
                    className="bg-white rounded-2xl shadow-xl px-4 py-3 max-w-[250px] animate-slide-in-right relative"
                    role="tooltip"
                    aria-label="WhatsApp message bubble"
                >
                    <button
                        onClick={() => setShowTooltip(false)}
                        className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-gray-600 text-xs transition-colors"
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    <p className="text-sm text-gray-800 font-medium">
                        ¡Hola! 👋
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        ¿En qué puedo ayudarte? Chatea con nosotros...
                    </p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
                </div>
            )}

            {/* Scroll Tooltip Message (50% scroll) - More prominent */}
            {showScrollTooltip && (
                <div
                    className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] rounded-2xl shadow-2xl px-6 py-5 max-w-[320px] xl:max-w-[350px] animate-slide-in-right relative border-4 border-white"
                    role="tooltip"
                    aria-label="WhatsApp scroll message bubble"
                >
                    <button
                        onClick={() => {
                            setShowScrollTooltip(false);
                            setWasManuallyDismissed(true);
                        }}
                        className="absolute -top-2 -right-2 bg-white hover:bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center text-gray-800 font-bold shadow-lg transition-all hover:scale-110"
                        aria-label="Cerrar mensaje"
                    >
                        ✕
                    </button>
                    <div className="flex items-start gap-2">
                        <span className="text-3xl">💬</span>
                        <div>
                            <p className="text-base xl:text-lg text-white font-bold mb-1">
                                ¿Tenés más dudas o consultas?
                            </p>
                            <p className="text-sm xl:text-base text-white/95 font-medium">
                                Podés escribir directamente a nuestro WhatsApp, estamos para ayudarte.
                            </p>
                        </div>
                    </div>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-8 w-5 h-5 bg-gradient-to-br from-[#25D366] to-[#20BA5A] transform rotate-45 border-r-4 border-b-4 border-white"></div>
                </div>
            )}

            {/* WhatsApp Button */}
            <button
                id="whatsapp-float-button"
                onClick={handleClick}
                className="relative group"
                aria-label="Contactar por WhatsApp"
                type="button"
            >
                {/* Pulsing ring animation */}
                <span className="absolute inset-0 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-[#25D366]/30 animate-ping" />
                <span className="absolute inset-0 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-[#25D366]/50 animate-pulse" />

                {/* Main button */}
                <span className="relative flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    {/* WhatsApp Icon SVG */}
                    <svg
                        className="w-8 h-8 xl:w-10 xl:h-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </span>
            </button>
        </div>
    );
}
