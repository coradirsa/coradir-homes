import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Próximamente | CORADIR Homes",
  description: "Página en construcción. Volvé pronto para conocer nuestros proyectos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComplejoCoradirPage() {
  redirect("/");
  return null;
}
