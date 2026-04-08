"use client";

import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import type { Medicine } from "@/lib/pdp-types";
import { cn } from "@/lib/utils";

interface Props {
  value: Medicine;
  onChange: (medicine: Medicine) => void;
}

const MEDICINES: Medicine[] = ["tirzepatide", "semaglutide"];

export function MedicineToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Medicine
      </p>
      <div className="flex gap-2">
        {MEDICINES.map((med) => {
          const cfg = MEDICINE_CONFIG[med];
          const active = value === med;
          return (
            <button
              key={med}
              onClick={() => onChange(med)}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                active
                  ? "border-black bg-zinc-100 shadow-[0_0_0_1px_black]"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              )}
            >
              <p className="text-sm font-semibold text-black">{cfg.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{cfg.tagline}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
