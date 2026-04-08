"use client";

import { cn } from "@/lib/utils";

interface Props {
  value: 1 | 2 | 3;
  onChange: (months: 1 | 2 | 3) => void;
}

const OPTIONS: { value: 1 | 2 | 3; label: string; sublabel: string }[] = [
  { value: 1, label: "1 month", sublabel: "Single supply" },
  { value: 2, label: "2 months", sublabel: "Escalation pair" },
  { value: 3, label: "3 months", sublabel: "Most popular" },
];

export function MonthSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Supply length
      </p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative flex-1 rounded-xl border px-3 py-3 text-center transition-all duration-150",
                active
                  ? "border-black bg-zinc-100 shadow-[0_0_0_1px_black]"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              )}
            >
              {opt.value === 3 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Popular
                </span>
              )}
              <p className="text-sm font-semibold text-black">{opt.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{opt.sublabel}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
