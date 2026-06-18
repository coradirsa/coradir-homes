"use client";

import type { SiteData } from "../types";
import MaterialIcon from "@/app/components/MaterialIcon";

interface EnergyBackupProps {
  data: SiteData;
}

const iconMap: Record<string, string> = {
  zap: "bolt",
  shield: "shield",
};

export default function EnergyBackup({ data }: EnergyBackupProps) {
  const backup = data.energy_backup;

  return (
    <section className="w-full bg-[#e9f2ff] px-5 py-16 md:py-20">
      <div className="container grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] xl:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-2xl flex-col gap-6">
            <h2 className="font-raleway text-3xl font-bold text-blue md:text-4xl">{backup.title}</h2>
            <p className="font-raleway text-base leading-8 text-blue/80 md:text-lg">{backup.description}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {backup.highlights.map((item) => {
              const iconName = iconMap[item.icon];

              return (
                <article
                  key={item.title}
                  className="flex min-h-40 flex-col justify-center gap-4 rounded-xl border border-blue/10 bg-white p-6 shadow-md"
                >
                  <MaterialIcon name={iconName} className="text-[36px] text-blue" />
                  <div>
                    <h3 className="font-raleway text-xl font-bold text-blue">{item.title}</h3>
                    <p className="mt-1 font-raleway text-sm leading-6 text-blue/75">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-blue p-8 text-center text-white shadow-2xl md:min-h-[460px]">
          <div className="flex flex-col items-center gap-6">
            <MaterialIcon name={backup.panelIcon} className="text-[64px] text-white/65" />
            <div className="flex flex-col gap-3">
              <h3 className="font-raleway text-3xl font-bold uppercase">{backup.panelTitle}</h3>
              <p className="font-raleway text-sm uppercase tracking-[0.22em] text-white/80">{backup.panelSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
