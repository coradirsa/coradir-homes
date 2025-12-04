"use client" 
import Item from "./components/item";

export default function SectionVideos() {  
    
    const sectionsVideos = [
            {
                title: "Construcción moderna: rápida y eficiente.",
                description: `Entregas el doble de rápidas, con eficiencia energética <br class="hidden md:inline" /> y menor impacto ambiental.`,
                checkList: [
                    "Entrega rápida",
                    "Menores costos",
                    "Oportunidad de inversión",
                    "Retorno de inversión veloz"
                ],
                video:   "/videos/locales.webm" , 
            },
            {
                title: "Seguridad inteligente con IA.",
                description: `Cámaras inteligentes, control de accesos y protección<br class="hidden md:inline" /> 24/7 para tu familia.`,
                checkList: [
                    "Expensas más bajas por reducción de personal",
                    "Seguridad continua",
                    "Mayor tranquilidad",
                    "Conectividad de wifi individual",
                ],
                video: "/videos/sec.webm",
                reverse: true 
            },
            {
                title: "Espacios recreativos integrados.",
                description: `Tranquilidad natural y cercanía urbana.`,
                checkList: [
                    "Ubicación estratégica",
                    "Plazas con juegos y zonas verdes",
                    "Conectividad",
                    "Paneles solares",
                    "Iluminación LED",
                    "Pileta"
                ],
                video: "/videos/sec2.webm", 
            }
        ];
        
    
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