"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturarAtribucion } from "@/lib/atribucion";

/** Guarda la campaña (UTM, gclid, fbclid) de la visita para adjuntarla a las consultas. */
export default function CapturaAtribucion() {
    const pathname = usePathname();

    useEffect(() => {
        capturarAtribucion();
    }, [pathname]);

    return null;
}
