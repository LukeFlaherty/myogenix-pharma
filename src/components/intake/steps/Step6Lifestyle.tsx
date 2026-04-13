"use client";

import type { IntakeData, DietType, ExerciseFreq, AlcoholUse, TobaccoUse } from "@/lib/checkout-types";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
}

const textareaCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none resize-none";

const selectCls =
  "w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

const DIETS: { value: DietType; label: string }[] = [
  { value: "standard", label: "Standard / mixed diet" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "keto", label: "Keto / low-carb" },
  { value: "plant_based", label: "Plant-based / vegan" },
  { value: "other", label: "Other" },
];

const EXERCISE: { value: ExerciseFreq; label: string }[] = [
  { value: "never", label: "Sedentary (little or no exercise)" },
  { value: "1-2x", label: "Light (1–2x/week)" },
  { value: "3-4x", label: "Moderate (3–4x/week)" },
  { value: "5+", label: "Active (5+x/week)" },
  { value: "daily", label: "Very active (daily, intense)" },
];

const ALCOHOL: { value: AlcoholUse; label: string }[] = [
  { value: "none", label: "None" },
  { value: "occasional", label: "Occasional (< 1 drink/week)" },
  { value: "weekly", label: "Weekly (1–7 drinks/week)" },
  { value: "daily", label: "Daily" },
];

const TOBACCO: { value: TobaccoUse; label: string }[] = [
  { value: "never", label: "Never" },
  { value: "former", label: "Former smoker" },
  { value: "current", label: "Current smoker / tobacco user" },
];

function SelectField<T extends string>({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-600">{label}</label>
      <select className={selectCls} value={value} onChange={(e) => onSelect(e.target.value as T)}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Step6Lifestyle({ data, onChange, title, subtitle }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <SelectField
        label="Diet"
        value={data.diet}
        options={DIETS}
        onSelect={(v) => onChange("diet", v)}
      />

      <SelectField
        label="Exercise frequency"
        value={data.exerciseFreq}
        options={EXERCISE}
        onSelect={(v) => onChange("exerciseFreq", v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Alcohol use"
          value={data.alcoholUse}
          options={ALCOHOL}
          onSelect={(v) => onChange("alcoholUse", v)}
        />
        <SelectField
          label="Tobacco / nicotine use"
          value={data.tobaccoUse}
          options={TOBACCO}
          onSelect={(v) => onChange("tobaccoUse", v)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Recent surgeries or hospitalizations (past 12 months)
        </label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder="e.g. Gallbladder removal 6 months ago. Otherwise none."
          value={data.recentSurgery}
          onChange={(e) => onChange("recentSurgery", e.target.value)}
        />
      </div>
    </div>
  );
}
