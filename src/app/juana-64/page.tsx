import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import AlquilarEnPozo from "./components/AlquilarEnPozo";
import ViviendaJovenForm from "./components/form/form";
import SectionCarucel from "./components/sectionCarucel/sectionCarucel";
import SectionEspecification from "./components/sectionEspeciification/sectionEspecification";
import SectionHero from "./components/sectionHero/sectionHero";
import SectionRooms from "./components/sectionRooms/sectionRooms";
import SectionStats from "./components/sectionStats/sectionStats";
import SectionVideos from "./components/sectionVideos/sectionVideos";
import SectionContact from "./components/sectionContact/sectionContact";

const SPECIFICATIONS_TOP = [
    { title: "Construcción rápida", icon: "construction" },
    { title: "Seguridad con IA 24 hs", icon: "videocam" },
    { title: "Zona comercial", icon: "storefront" },
    { title: "Estacionamientos", icon: "local_parking" },
    { title: "Conectividad optimizada", icon: "wifi" },
    { title: "Pileta", icon: "pool" },
];

const SPECIFICATIONS_BOTTOM = [
    { title: "Estacionamiento individual", icon: "local_parking" },
    { title: "Paneles solares con protección anticorte", icon: "solar_power" },
    { title: "Calefón eléctrico", icon: "water_heater" },
    { title: "Cocina con artefactos eléctricos", icon: "skillet" },
    { title: "Aire acondicionado", icon: "climate_mini_split" },
];

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/juana-64" }).metadata;
}

export const revalidate = 3600;

export default function Page() {
    return (
        <ReCaptcha>
            <>
                <StructuredDataScripts pathname="/juana-64" />
                <SectionHero />
                <SectionEspecification specifications={SPECIFICATIONS_TOP} border={true} />
                <SectionCarucel />
                <SectionRooms />
                <SectionEspecification specifications={SPECIFICATIONS_BOTTOM} border={false} x={5} />
                <SectionVideos />
                <SectionStats />
                <AlquilarEnPozo />
                <ViviendaJovenForm />
                <SectionContact />
            </>
        </ReCaptcha>
    );
}
