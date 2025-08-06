import ReCaptcha from "../../components/reCaptcha"; 
import SaberMas from "./components/saberMas";
 
export const metadata = {
    title: "Saber más",
    description: "Saber más sobre Coradir Homes",
}
export default function Page(){ 
    return(
        <ReCaptcha>
            <SaberMas/>
        </ReCaptcha>
    );
}