"use client";

import type { SiteData } from "../types";
import { CheckCircle } from 'lucide-react';

interface ConstructionProps {
  data: SiteData;
}

export default function Construction({ data }: ConstructionProps) {
  return (
    <section className="container py-20 px-5">
      <h2 className="font-playfair text-3xl md:text-5xl text-center text-blue mb-20">
        {data.construction.title}
      </h2>

      <div className="flex flex-col gap-24">
        {data.construction.rows.map((row, idx) => {
          const VideoComponent = () => (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-2xl">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={row.videoPoster}
              >
                <source src={row.videoUrl} type="video/webm" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          );

          const TextBlock = () => (
            <div className="flex flex-col justify-center space-y-6">
              <p className="text-xl md:text-2xl text-gray font-playfair font-medium leading-relaxed">
                {row.textBlock.mainText}
              </p>
              <ul className="space-y-4 pt-4">
                {row.textBlock.list.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue flex-shrink-0" />
                    <span className="text-gray font-raleway font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );

          return (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {row.type === 'video-text' ? (
                <>
                  <VideoComponent />
                  <TextBlock />
                </>
              ) : (
                <>
                  <div className="order-2 lg:order-1">
                    <TextBlock />
                  </div>
                  <div className="order-1 lg:order-2">
                    <VideoComponent />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}