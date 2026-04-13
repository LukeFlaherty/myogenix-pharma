"use client";

import type { IntakeData } from "@/lib/checkout-types";
import type { PriorMedOption } from "@/components/intake/IntakeShell";
import { cn } from "@/lib/utils";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
  priorMedicineOptions: PriorMedOption[];
  returningPatientNote: string;
}

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

const textareaCls = inputCls + " resize-none";

export function Step5GlpHistory({
  data,
  onChange,
  title,
  subtitle,
  priorMedicineOptions,
  returningPatientNote,
}: Props) {
  const hasPrior = data.priorGlp1 === "yes";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-600">
          Have you taken a GLP-1 medication before? (semaglutide, tirzepatide, liraglutide, etc.)
        </label>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange("priorGlp1", val)}
              className={cn(
                "flex-1 rounded-xl border py-3 text-sm font-semibold capitalize transition-colors",
                data.priorGlp1 === val
                  ? "border-black bg-zinc-100 text-black shadow-[0_0_0_1px_black]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
              )}
            >
              {val === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {hasPrior && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Prior GLP-1 details</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-600">Which medication?</label>
            <select
              className={cn(inputCls, "appearance-none bg-white")}
              value={data.priorGlp1Which}
              onChange={(e) => onChange("priorGlp1Which", e.target.value)}
            >
              <option value="">Select</option>
              {priorMedicineOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-600">Current or last dose</label>
            <input
              className={cn(inputCls, "bg-white")}
              placeholder="e.g. 2.4 mg/week, 10 mg/month"
              value={data.priorGlp1LastDose}
              onChange={(e) => onChange("priorGlp1LastDose", e.target.value)}
            />
            <p className="text-[11px] text-zinc-400">
              Most important for returning patients — determines your starting dose.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-600">
              Why are you switching or restarting?
            </label>
            <textarea
              className={cn(textareaCls, "bg-white")}
              rows={3}
              placeholder="e.g. Cost, side effects, switching from brand to compounded, escalating dose"
              value={data.priorGlp1StopReason}
              onChange={(e) => onChange("priorGlp1StopReason", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-600">Any side effects experienced?</label>
            <textarea
              className={cn(textareaCls, "bg-white")}
              rows={3}
              placeholder="e.g. Nausea at 2.4 mg dose, resolved after 2 weeks. No vomiting."
              value={data.priorGlp1SideEffects}
              onChange={(e) => onChange("priorGlp1SideEffects", e.target.value)}
            />
          </div>

          {returningPatientNote && (
            <div className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0 text-zinc-400">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
                <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-zinc-600">{returningPatientNote}</p>
            </div>
          )}
        </div>
      )}

      {data.priorGlp1 === "no" && (
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
          <p className="text-xs text-zinc-500">
            Great — you&apos;ll start at the base dose for your chosen medication. Your provider will confirm this is appropriate based on your medical history.
          </p>
        </div>
      )}
    </div>
  );
}
