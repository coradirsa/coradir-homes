import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import UnifiedContactForm, { type UnifiedContactFormData } from "../components/shared/UnifiedContactForm";
import AlquilarEnPozo from "./components/AlquilarEnPozo";
import SectionCarucel from "./components/sectionCarucel/sectionCarucel";
import SectionEspecification from "./components/sectionEspeciification/sectionEspecification";
import SectionHero from "./components/sectionHero/sectionHero";
import SectionRooms from "./components/sectionRooms/sectionRooms";
import SectionStats from "./components/sectionStats/sectionStats";
import SectionVideos from "./components/sectionVideos/sectionVideos";
import SectionContact from "./components/sectionContact/sectionContact";

const SPECIFICATIONS_TOP = [
    { title: "Construcción rápida", icon: "/icons/vivienda-joven/01.png" },
    { title: "Seguridad con IA 24 hs", icon: "/icons/vivienda-joven/02.png" },
    { title: "Zona comercial", icon: "/icons/vivienda-joven/03.png" },
    { title: "Estacionamientos", icon: "/icons/vivienda-joven/04.png" },
    { title: "Conectividad optimizada", icon: "/icons/vivienda-joven/05.png" },
    { title: "Pileta", icon: "/icons/vivienda-joven/06.png" },
];

const SPECIFICATIONS_BOTTOM = [
    { title: "Estacionamiento individual", icon: "/icons/vivienda-joven/08.png" },
    { title: "Paneles solares con protección anticorte", icon: "/icons/vivienda-joven/09.png" },
    { title: "Calefón eléctrico", icon: "/icons/vivienda-joven/10.png" },
    { title: "Cocina con artefactos eléctricos", icon: "/icons/vivienda-joven/11.png" },
    { title: "Aire acondicionado", icon: "/icons/vivienda-joven/12.png" },
];

const CONTACT_FORM_DATA: UnifiedContactFormData = {
    title: "Tu futura casa te espera",
    subtitle: "El lugar soñado existe",
    bgImage: "/img/vivienda-joven/bg-form.webp",
    fields: [
        { label: "Nombre completo", name: "name", type: "text" },
        { label: "Teléfono", name: "phone", type: "tel" },
        { label: "Email", name: "email", type: "email" },
        { label: "Mensaje (opcional)", name: "message", type: "textarea" }
    ],
    profileTypes: [
        { label: "Inversor", value: "inversor" },
        { label: "Consumidor", value: "consumidor" }
    ],
    options: ["Alquilar", "Comprar"]
};

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
                <UnifiedContactForm data={CONTACT_FORM_DATA} />
                <SectionContact />
            </>
        </ReCaptcha>
    );
}