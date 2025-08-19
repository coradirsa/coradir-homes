"use client"
import { useMediaQuery } from "@/hooks/useMediaQuery"; 
import { useMemo } from "react";
import Item from "./components/item";

export default function SectionVideos() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    
    const sectionsVideos = useMemo(() => {
        const baseContent = [
            {
                title: "Construcción en seco: rápida y eficiente.",
                description: `Entregas el doble de rápidas, con eficiencia energética <br class="hidden md:inline" /> y menor impacto ambiental.`,
                checkList: [
                    "Entrega rápida",
                    "Menores costos",
                    "Menor impacto ambiental",
                ],
                video: isMobile ?  "/videos/walk.mp4":"/videos/vvj.mp4" , 
            },
            {
                title: "Seguridad inteligente con IA.",
                description: `Cámaras inteligentes, control de accesos y protección<br class="hidden md:inline" /> 24/7 para tu familia.`,
                checkList: [
                    "Expensas más bajas por reducción de personal",
                    "Seguridad continua",
                    "Mayor tranquilidad",
                    "Domótica: integración fácil a la rutina de los inquilinos",
                ],
                video: "/videos/sec.mp4",
                reverse: true 
            },
            {
                title: "Espacios recreativos integrados.",
                description: `Tranquilidad natural y cercanía urbana.`,
                checkList: [
                    "Ubicación estratégica",
                    "Plazas con juegos",
                    "Conectividad",
                    "Zonas verdes",
                ],
                video: isMobile ?  "/videos/park.mp4": "/videos/vvj.mp4", 
            }
        ];
        
        return baseContent;
    }, [isMobile]);
    
    return ( 
        <>
            {sectionsVideos.map((s, inx) => (
                <Item
                    key={`section-video-${inx}`}
                    {...s}
                />
            ))}
        </>
    );
}