"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Bot() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show bot after page is loaded to improve initial load
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <span
            id="coradir-custom-avatar"
            className="fixed bottom-2 right-2 xl:bottom-5 xl:right-5 z-50 w-14 h-14 xl:w-16 xl:h-16 flex items-center justify-center animate-fade-in"
        >
            {/* Auriola animada con CSS */}
            <span className="absolute w-16 h-16 xl:w-18 xl:h-18 rounded-full bg-blue/80 animate-pulse" />

            {/* Botón principal */}
            <span className="relative z-10 bg-blue/95 transition-all ease-in-out duration-200 hover:bg-blue w-full h-full rounded-full border-2 border-white cursor-pointer shadow-lg hover:shadow-xl" >
                <Image
                    src="/img/chatbot.webp"
                    alt="Chatbot"
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full"
                    loading="lazy"
                />
            </span>
        </span>
    );
}