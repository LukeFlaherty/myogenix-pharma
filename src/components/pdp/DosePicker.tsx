"use client";

import { useState, useRef, useEffect } from "react";
import type { MedicineConfig } from "@/lib/pdp-types";
import { getNextRecommendedDose, MONTH_LABEL } from "@/lib/pdp-config";
import { cn } from "@/lib/utils";

interface Props {
  month: number;
  selectedMg: number;
  prevMonthMg: number | null;
  config: MedicineConfig;
  onChange: (mg: number) => void;
}

export function DosePicker({
  month,
  selectedMg,
  prevMonthMg,
  config,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const recommendedMg =
    prevMonthMg !== null
      ? getNextRecommendedDose(config, prevMonthMg)
      : config.startingDose;

  const isDeviatingDown = prevMonthMg !== null && selectedMg < prevMonthMg;
  const selectedDose = config.doses.find((d) => d.mg === selectedMg)!;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-black">
          {MONTH_LABEL[month - 1]}
        </p>
        {month === 1 ? (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
            Starting dose
          </span>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
            Prev: {prevMonthMg} mg
          </span>
        )}
      </div>

      {/* Custom dropdown */}
      <div ref={ref} className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
            open ? "border-black" : "border-zinc-200 hover:border-zinc-400"
          )}
        >
          <span className="text-sm font-semibold text-black">
            {selectedDose.label}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={cn("text-zinc-400 transition-transform duration-150", open && "rotate-180")}
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown list */}
        {open && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
            {config.doses.map((dose) => {
              const isRec = dose.mg === recommendedMg && month > 1;
              const isSelected = dose.mg === selectedMg;

              return (
                <button
                  key={dose.mg}
                  type="button"
                  onClick={() => {
                    onChange(dose.mg);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                    isRec
                      ? "bg-black text-white hover:bg-zinc-800"
                      : isSelected
                      ? "bg-zinc-100 text-black hover:bg-zinc-150"
                      : "text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  <span className="text-sm font-semibold">{dose.label}</span>

                  <span className="flex items-center gap-2">
                    {isRec && (
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        isSelected ? "bg-white/20 text-white" : "bg-white text-black"
                      )}>
                        Recommended
                      </span>
                    )}
                    {isSelected && !isRec && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-black">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isSelected && isRec && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly breakdown note */}
      <p className="mt-2 text-[11px] text-zinc-400">
        {selectedDose.mg} mg/month ={" "}
        <span className="font-semibold text-zinc-500">
          {(selectedDose.mg / 4 % 1 === 0
            ? selectedDose.mg / 4
            : (selectedDose.mg / 4).toFixed(2)
          )} mg/week
        </span>{" "}
        · 4 injections per month
      </p>

      {/* Returning customer bloodwork notice */}
      {month === 1 && selectedMg !== config.startingDose && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <span className="mt-0.5 shrink-0 text-zinc-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </span>
          <p className="text-xs text-zinc-600">
            Starting above the base dose?{" "}
            <span className="font-semibold text-black">Returning customers</span> will need to upload
            recent bloodwork in their patient portal after checkout to confirm
            prior escalation.
          </p>
        </div>
      )}

      {isDeviatingDown && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <span className="mt-0.5 text-zinc-500">⚠</span>
          <p className="text-xs text-zinc-600">
            This dose is lower than your previous month. Your provider may
            adjust this during review — no hard block, just a heads-up.
          </p>
        </div>
      )}
    </div>
  );
}
