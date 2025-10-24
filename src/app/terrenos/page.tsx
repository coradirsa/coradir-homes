import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import Terrenos from "./components/terrenos";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/terrenos" }).metadata;
}

export const revalidate = 3600;

export default function Page(){
    return(
        <>
            <StructuredDataScripts pathname="/terrenos" />
            <Terrenos/>
        </>
    );
}
