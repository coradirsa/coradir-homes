import ReCaptcha from "../components/reCaptcha";
import Form from "./components/form/form";
import SectionCarucel from "./components/sectionCarucel/sectionCarucel";
import SectionEspecification from "./components/sectionEspeciification/sectionEspecification";
import SectionHero from "./components/sectionHero/sectionHero";
import SectionRooms from "./components/sectionRooms/sectionRooms";
import SectionVideos from "./components/sectionVideos/sectionVideos";

export const metadata = {
    title: "Vivienda Joven",
    description: "Vivienda Joven",
}
const sectionsVideos = [
    {
        title: "Construcción en seco: rápida y eficiente.",
        description: `Entregas el doble de rápidas, con eficiencia energética <br class="hidden md:inline" /> y menor impacto ambiental.`,
        checkList: [
            "Entrega rápida",
            "Menores costos",
            "Menor impacto ambiental",
        ],
        video: "/videos/walk.mp4", 
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
        video: "/videos/park.mp4", 
    },
    {
        title: "Movete como vivís: 100% eléctrico",
        description: `Alquilá autos eléctricos como TITO o CHIKI y completá una  <br class="hidden md:inline" /> experiencia sustentable.`,
        checkList: [
            "Sin emisiones",
            "Bajos costos",
            "Admite cargas parciales",
            `Ideales para moverse por la ciudad <br class="hidden md:inline" /> con 300 km de autonomía`,
        ],
        image: "/img/vivienda-joven/chiki.png", 
        reverse: true
    },
]

export default function Page() {
    return ( 
        <ReCaptcha>
            <>
                <SectionHero />
                <SectionEspecification />
                <SectionCarucel />
                <SectionRooms />
                {
                    sectionsVideos.map((s,inx)=>(
                        <SectionVideos
                            key={`section-video-${inx}`}
                            {...s}
                        />
                    ))
                }
                <Form  />
            </>
        </ReCaptcha>
    );
}