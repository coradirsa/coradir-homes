import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Maqueta Locales Comerciales | CORADIR Homes",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocalesComercialesMaquetaPage() {
  redirect("/locales-comerciales");
}
