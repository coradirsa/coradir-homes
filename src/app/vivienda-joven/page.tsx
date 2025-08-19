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
export default function Page() {
    return ( 
        <ReCaptcha>
            <>
                <SectionHero />
                <SectionEspecification />
                <SectionCarucel />
                <SectionRooms /> 
                <SectionVideos  /> 
                <Form  />
            </>
        </ReCaptcha>
    );
}