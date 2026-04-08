"use client";

import type { Medicine } from "@/lib/pdp-types";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";

interface Props {
  medicine: Medicine;
}

export function ProductHero({ medicine }: Props) {
  const config = MEDICINE_CONFIG[medicine];

  return (
    <div className="space-y-3">
      <span className="inline-block rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
        {config.genericName}
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-black">
        {config.name}
      </h1>
      <p className="max-w-md text-base text-zinc-500">{config.description}</p>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-black" />
          <span className="text-xs text-zinc-500">Compounded · FDA-registered facility</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-black" />
          <span className="text-xs text-zinc-500">Provider-reviewed</span>
        </div>
      </div>
    </div>
  );
}
