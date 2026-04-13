"use client";

import type { IntakeData } from "@/lib/checkout-types";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
  commonInteractions: string[];
}

const textareaCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none resize-none";

export function Step4Medications({ data, onChange, title, subtitle, commonInteractions }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Current prescription medications
        </label>
        <textarea
          className={textareaCls}
          rows={4}
          placeholder={"e.g. Metformin 500mg twice daily\nLisinopril 10mg once daily"}
          value={data.currentMedications}
          onChange={(e) => onChange("currentMedications", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Drug allergies or adverse reactions
        </label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder={"e.g. Penicillin — hives\nSulfa drugs — rash"}
          value={data.allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Supplements & vitamins
        </label>
        <textarea
          className={textareaCls}
          rows={2}
          placeholder="e.g. Fish oil, Vitamin D, Magnesium"
          value={data.supplements}
          onChange={(e) => onChange("supplements", e.target.value)}
        />
      </div>

      {commonInteractions.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-semibold text-zinc-600">Medications to flag</p>
          <p className="mb-3 text-xs text-zinc-500">
            If you take any of the following, make sure they&apos;re listed above — your provider will review for interactions:
          </p>
          <ul className="space-y-1.5">
            {commonInteractions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-zinc-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
