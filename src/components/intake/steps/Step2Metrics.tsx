"use client";

import type { IntakeData } from "@/lib/checkout-types";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
  bmiNote?: string;
}

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

const GOALS = [
  { key: "weight_loss", label: "Weight loss" },
  { key: "metabolic_health", label: "Metabolic health" },
  { key: "maintenance", label: "Weight maintenance" },
  { key: "blood_sugar", label: "Blood sugar management" },
];

function calcBmi(weightLbs: string, heightFt: string, heightIn: string): string {
  const w = parseFloat(weightLbs);
  const h = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
  if (!w || !h) return "—";
  const bmi = (703 * w) / (h * h);
  return bmi.toFixed(1);
}

function bmiCategory(bmi: string): string {
  const n = parseFloat(bmi);
  if (isNaN(n)) return "";
  if (n < 18.5) return "Underweight";
  if (n < 25) return "Normal weight";
  if (n < 30) return "Overweight";
  return "Obese";
}

export function Step2Metrics({ data, onChange, title, subtitle, bmiNote }: Props) {
  const bmi = calcBmi(data.weightLbs, data.heightFt, data.heightIn);
  const category = bmiCategory(bmi);

  function toggleGoal(key: string) {
    const current = data.primaryGoals;
    const next = current.includes(key)
      ? current.filter((g) => g !== key)
      : [...current, key];
    onChange("primaryGoals", next);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600">Current weight (lbs)</label>
          <input className={inputCls} type="number" placeholder="180" value={data.weightLbs}
            onChange={(e) => onChange("weightLbs", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600">Goal weight (lbs)</label>
          <input className={inputCls} type="number" placeholder="155" value={data.goalWeightLbs}
            onChange={(e) => onChange("goalWeightLbs", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">Height</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input className={inputCls} type="number" placeholder="5" value={data.heightFt}
              onChange={(e) => onChange("heightFt", e.target.value)} />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">ft</span>
          </div>
          <div className="relative">
            <input className={inputCls} type="number" placeholder="6" value={data.heightIn}
              onChange={(e) => onChange("heightIn", e.target.value)} />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">in</span>
          </div>
        </div>
      </div>

      {bmi !== "—" && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div>
            <p className="text-xs text-zinc-400">Calculated BMI</p>
            <p className="text-2xl font-bold text-black">{bmi}</p>
          </div>
          <div className="h-8 w-px bg-zinc-200" />
          <div>
            <p className="text-xs text-zinc-400">Category</p>
            <p className="text-sm font-semibold text-black">{category}</p>
          </div>
          {bmiNote && (
            <p className="mt-1 w-full text-xs text-zinc-400 sm:mt-0 sm:ml-auto sm:w-auto sm:max-w-xs sm:text-right">
              {bmiNote}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-600">Primary goals (select all that apply)</label>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => {
            const active = data.primaryGoals.includes(g.key);
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => toggleGoal(g.key)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  active
                    ? "border-black bg-zinc-100 text-black shadow-[0_0_0_1px_black]"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
