"use client";

import type { SiteData } from "../types";
import MaterialIcon from "@/app/components/MaterialIcon";

interface FeaturesBarProps {
  data: SiteData;
}

export default function FeaturesBar({ data }: FeaturesBarProps) {
  return (
    <section className="w-full bg-white relative z-20 -mt-16">
      <div className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col lg:flex-row lg:flex-wrap items-center justify-center w-full gap-5">
          {data.features_bar.map((feat, idx) => (
            <div
              key={idx}
              className="flex min-h-20 items-center justify-start px-3 py-1 rounded-full gap-2 w-80 xl:w-72 2xl:w-80 bg-white shadow-lg hover:shadow-xl transition-shadow"
              style={{
                borderColor: "var(--color-blue)",
                borderWidth: "2px"
              }}
            >
              <MaterialIcon name={feat.icon} className="shrink-0 text-[56px] text-blue xl:text-[48px] 2xl:text-[56px]" />
              <h3 className="text-blue font-playfair text-xl md:text-sm xl:text-xl 2xl:text-2xl w-full">{feat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
