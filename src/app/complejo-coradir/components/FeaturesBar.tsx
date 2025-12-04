"use client";

import type { SiteData } from "../types";
import Image from "next/image";

interface FeaturesBarProps {
  data: SiteData;
}

export default function FeaturesBar({ data }: FeaturesBarProps) {
  return (
    <section className="w-full bg-white relative z-20 -mt-16">
      <div className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-5">
          {data.features_bar.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-start px-3 py-1 rounded-full gap-2 w-80 xl:w-96 bg-white shadow-lg hover:shadow-xl transition-shadow"
              style={{
                borderColor: "var(--color-blue)",
                borderWidth: "2px"
              }}
            >
              <Image
                src={feat.icon}
                alt={feat.title}
                width={100}
                height={100}
                className="w-20 h-20"
              />
              <h3 className="text-blue font-playfair text-xl md:text-sm xl:text-2xl w-full">{feat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
