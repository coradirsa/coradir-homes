import SectionCarucel from "./components/sectionCarucel/sectionCarucel";
import SectionEspecification from "./components/sectionEspeciification/sectionEspecification";
import SectionHero from "./components/sectionHero/sectionHero";
import SectionRooms from "./components/sectionRooms/sectionRooms";

export const metadata = {
    title: "Vivienda Joven",
    description: "Vivienda Joven",
}


export default function Page() {
    return ( 
        <>
            <SectionHero />
            <SectionEspecification />
            <SectionCarucel />
            <SectionRooms />
        </>
    );
}