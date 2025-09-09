import ReCaptcha from "../components/reCaptcha";
import Form from "./components/form/form";
import Panorama from "./components/panoramica/Panorama";
import SectionCarucel from "./components/sectionCarucel/sectionCarucel";
import SectionEspecification from "./components/sectionEspeciification/sectionEspecification";
import SectionHero from "./components/sectionHero/sectionHero";
import SectionRooms from "./components/sectionRooms/sectionRooms";
import SectionStats from "./components/sectionStats/sectionStats";
import SectionVideos from "./components/sectionVideos/sectionVideos";

export const metadata = {
    title: "Vivienda Joven",
    description: "Vivienda Joven",
} 
export default function Page() {
    const specificationsFirst = [
        { 
            title: "Construcción rápida",
            icon:"/icons/vivienda-joven/01.png"
        },
        { 
            title: "Seguridad con IA 24 hs",
            icon:"/icons/vivienda-joven/02.png"
        },
        { 
            title: "Zona comercial",
            icon:"/icons/vivienda-joven/03.png"
        },
        { 
            title: "Estacionamientos",
            icon:"/icons/vivienda-joven/04.png"
        },
        { 
            title: "Conectividad optimizada",
            icon:"/icons/vivienda-joven/05.png"
        },
        { 
            title: "Pileta",
            icon:"/icons/vivienda-joven/06.png"
        },
        { 
            title: "Salón compartido",
            icon:"/icons/vivienda-joven/07.png"
        },
    ];
    const specificationsSecond = [
        { 
            title: "Estacionamiento individual",
            icon:"/icons/vivienda-joven/08.png"
        },
        { 
            title: "Paneles solares con sistema de protección anticorte.",
            icon:"/icons/vivienda-joven/09.png"
        },
        { 
            title: "Calefón Eléctrico",
            icon:"/icons/vivienda-joven/10.png"
        },
        { 
            title: "Cocina con artefactos eléctricos",
            icon:"/icons/vivienda-joven/11.png"
        },
        { 
            title: "Aire Acondicionado",
            icon:"/icons/vivienda-joven/12.png"
        }, 
    ];
    return ( 
        <ReCaptcha>
            <>
                <SectionHero />
                <SectionEspecification specifications={specificationsFirst} border={true}/>
                <SectionCarucel />
                <SectionRooms /> 
                <SectionEspecification specifications={specificationsSecond} border={false} x={2}/>
                <Panorama />
                <SectionVideos  /> 
                <SectionStats />
                <Form  />
            </>
        </ReCaptcha>
    );
}