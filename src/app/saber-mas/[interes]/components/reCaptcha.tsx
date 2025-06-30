"use client"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SaberMas from "./saberMas";

export default function ReCaptcha( ){
    return(
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
            <SaberMas/>
        </GoogleReCaptchaProvider>
    );
}