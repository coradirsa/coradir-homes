"use client"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptcha({children }: Readonly<{
    children: React.ReactNode;
  }>){
    // Deshabilitar reCAPTCHA en desarrollo si no hay key válida
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === 'test-site-key') {
        return <>{children}</>;
    }

    return(
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            {children}
        </GoogleReCaptchaProvider>
    );
}