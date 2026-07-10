"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useWhatsAppUtm } from "@/hooks/useWhatsAppUtm";
import {
    addSenderNameToWhatsAppUrl,
    subscribeToWhatsAppOpenRequests,
    type WhatsAppOpenRequest,
} from "@/lib/whatsappMessage";
import MaterialIcon from "./MaterialIcon";

const WHATSAPP_NUMBER = "5492664649967";

function WhatsAppMark({ className = "" }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center leading-none ${className}`} aria-hidden="true">
            <MaterialIcon
                name="chat_bubble"
                className="block text-[inherit] [transform:translateX(1px)_scaleX(-1)]"
            />
        </span>
    );
}

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showScrollTooltip, setShowScrollTooltip] = useState(false);
    const [wasManuallyDismissed, setWasManuallyDismissed] = useState(false);
    const [whatsappRequest, setWhatsappRequest] = useState<WhatsAppOpenRequest | null>(null);
    const [senderName, setSenderName] = useState("");
    const pathname = usePathname();
    const { getTrackedUrl } = useWhatsAppUtm();

    const openNameCapture = useCallback((request: WhatsAppOpenRequest) => {
        setWhatsappRequest(request);
        setSenderName("");
        setShowTooltip(false);
        setShowScrollTooltip(false);
        setWasManuallyDismissed(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setShowTooltip(true), 3000);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => subscribeToWhatsAppOpenRequests(openNameCapture), [openNameCapture]);

    useEffect(() => {
        if (!showTooltip) return;

        const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
        return () => clearTimeout(hideTimer);
    }, [showTooltip]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

            if (scrollPercentage >= 50 && !wasManuallyDismissed) {
                setShowScrollTooltip(true);
            } else if (scrollPercentage < 50) {
                setShowScrollTooltip(false);
                setWasManuallyDismissed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [wasManuallyDismissed]);

    const getPersonalizedMessage = (): string => {
        const messages: Record<string, string> = {
            "/": "Hola! Estoy interesado en conocer mas sobre sus propiedades",
            "/proyectos": "Hola! Vi los proyectos y me gustaria mas informacion",
            "/la-torre-ii": "Hola! Me interesa La Torre II, quisiera mas detalles",
            "/villa-mercedes": "Hola! Me interesa el Complejo Villa Mercedes, quisiera mas informacion",
            "/juana-64": "Hola! Me interesa Juana 64, quisiera informacion sobre departamentos y locales comerciales",
            "/locales-comerciales": "Hola! Me interesan los locales comerciales de CORADIR Homes, quisiera conocer precios, disponibilidad y leasing",
            "/inversiones-inteligentes": "Hola! Me interesa invertir, quisiera mas informacion",
            "/contacto": "Hola! Quisiera ponerme en contacto con ustedes",
        };

        if (messages[pathname]) return messages[pathname];

        if (pathname.startsWith("/saber-mas")) {
            return "Hola! Quisiera recibir mas informacion sobre sus propiedades";
        }

        return "Hola! Estoy interesado en sus propiedades";
    };

    const handleClick = () => {
        const message = encodeURIComponent(getPersonalizedMessage());
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        const trackedUrl = getTrackedUrl(whatsappUrl);
        openNameCapture({ href: trackedUrl });
    };

    const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!whatsappRequest || !senderName.trim()) return;

        const personalizedUrl = addSenderNameToWhatsAppUrl(whatsappRequest.href, senderName);
        const target = whatsappRequest.target || "_blank";

        if (typeof window !== "undefined" && "gtag" in window) {
            (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", "whatsapp_click", {
                event_category: "engagement",
                event_label: pathname,
                value: pathname,
            });
        }

        if (target === "_self") {
            window.location.href = personalizedUrl;
        } else {
            window.open(personalizedUrl, target, whatsappRequest.features || "noopener,noreferrer");
        }

        setWhatsappRequest(null);
        setSenderName("");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 xl:bottom-6 xl:right-6">
            {showTooltip && !showScrollTooltip && !whatsappRequest && (
                <div
                    className="relative max-w-[250px] rounded-lg bg-white px-4 py-3 shadow-xl animate-slide-in-right"
                    role="tooltip"
                    aria-label="WhatsApp message bubble"
                >
                    <button
                        onClick={() => setShowTooltip(false)}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 transition-colors hover:bg-gray-300"
                        aria-label="Cerrar mensaje"
                        type="button"
                    >
                        <MaterialIcon name="close" className="text-[14px]" />
                    </button>
                    <p className="text-sm font-semibold text-gray-800">Hola!</p>
                    <p className="mt-1 text-xs text-gray-600">En que puedo ayudarte? Chatea con nosotros...</p>
                    <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-white" />
                </div>
            )}

            {showScrollTooltip && !whatsappRequest && (
                <div
                    className="relative max-w-[320px] rounded-lg border-4 border-white bg-gradient-to-r from-[#25D366] to-[#20BA5A] px-6 py-5 shadow-2xl animate-slide-in-right xl:max-w-[350px]"
                    role="tooltip"
                    aria-label="WhatsApp scroll message bubble"
                >
                    <button
                        onClick={() => {
                            setShowScrollTooltip(false);
                            setWasManuallyDismissed(true);
                        }}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold text-gray-800 shadow-lg transition-all hover:scale-110 hover:bg-gray-100"
                        aria-label="Cerrar mensaje"
                        type="button"
                    >
                        <MaterialIcon name="close" className="text-[18px]" />
                    </button>
                    <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                            <WhatsAppMark className="text-[22px]" />
                        </span>
                        <div>
                            <p className="mb-1 text-base font-bold text-white xl:text-lg">Tenes mas dudas o consultas?</p>
                            <p className="text-sm font-medium text-white/95 xl:text-base">
                                Podes escribir directamente a nuestro WhatsApp, estamos para ayudarte.
                            </p>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 right-8 h-5 w-5 rotate-45 border-b-4 border-r-4 border-white bg-[#20BA5A]" />
                </div>
            )}

            {whatsappRequest ? (
                <form
                    onSubmit={handleNameSubmit}
                    className="relative w-[calc(100vw-2rem)] max-w-[360px] overflow-hidden rounded-lg border border-[#1fb45b]/25 bg-[#efeae2] shadow-2xl animate-whatsapp-chat-in"
                >
                    <button
                        type="button"
                        onClick={() => {
                            setWhatsappRequest(null);
                            setSenderName("");
                        }}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label="Cerrar"
                    >
                        <MaterialIcon name="close" className="text-[18px]" />
                    </button>

                    <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                            <WhatsAppMark className="text-[26px]" />
                        </span>
                        <div className="min-w-0 pr-7">
                            <p className="truncate text-sm font-bold leading-tight">Coradir Homes</p>
                            <p className="text-xs leading-tight text-white/80">WhatsApp</p>
                        </div>
                    </div>

                    <div className="space-y-3 px-4 py-4">
                        <div className="relative w-fit max-w-[82%] rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
                            <p className="font-semibold">Nos decis tu nombre?</p>
                            <span className="absolute -left-1 top-0 h-3 w-3 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]" />
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="whatsapp-sender-name" className="sr-only">
                                Tu nombre
                            </label>
                            <input
                                id="whatsapp-sender-name"
                                value={senderName}
                                onChange={(event) => setSenderName(event.target.value)}
                                autoComplete="name"
                                autoFocus
                                className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-sm font-medium text-gray-900 shadow-sm outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-[#25D366] placeholder:text-gray-400"
                                placeholder="Tu nombre"
                            />
                            <button
                                type="submit"
                                disabled={!senderName.trim()}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#20BA5A] disabled:cursor-not-allowed disabled:opacity-45"
                                aria-label="Enviar por WhatsApp"
                            >
                                <MaterialIcon name="send" className="translate-x-px text-[20px]" />
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <button
                    id="whatsapp-float-button"
                    onClick={handleClick}
                    className="group relative"
                    aria-label="Contactar por WhatsApp"
                    type="button"
                >
                    <span className="absolute inset-0 h-14 w-14 rounded-full bg-[#25D366]/30 animate-ping xl:h-16 xl:w-16" />
                    <span className="absolute inset-0 h-14 w-14 rounded-full bg-[#25D366]/50 animate-pulse xl:h-16 xl:w-16" />

                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:bg-[#20BA5A] hover:shadow-2xl group-hover:scale-110 xl:h-16 xl:w-16">
                        <WhatsAppMark className="text-[38px] xl:text-[44px]" />
                    </span>
                </button>
            )}
        </div>
    );
}
