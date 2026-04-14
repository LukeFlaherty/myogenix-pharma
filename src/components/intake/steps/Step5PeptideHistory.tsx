"use client";

import type { IntakeData } from "@/lib/checkout-types";
import type { PriorMedOption } from "../IntakeShell";

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

export function Step5PeptideHistory({
  data,
  onChange,
  title,
  subtitle,
  priorMedicineOptions,
  returningPatientNote,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      {/* Prior peptide use */}
      <div>
        <p className="mb-3 text-sm font-semibold text-black">
          Have you used peptides before?
        </p>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange("priorGlp1", val)}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors capitalize ${
                data.priorGlp1 === val
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {val === "yes" ? "Yes" : "No, first time"}
            </button>
          ))}
        </div>
      </div>

      {/* Prior peptide details */}
      {data.priorGlp1 === "yes" && (
        <div className="space-y-4">
          {priorMedicineOptions.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Which peptides have you used?
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {priorMedicineOptions.map((opt) => {
                  const selected = data.priorGlp1Which.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const current = data.priorGlp1Which
                          ? data.priorGlp1Which.split(",").filter(Boolean)
                          : [];
                        const next = selected
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value];
                        onChange("priorGlp1Which", next.join(","));
                      }}
                      className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Most recent dose / protocol
            </label>
            <input
              className={inputCls}
              placeholder="e.g. BPC-157 500 mcg/day for 8 weeks"
              value={data.priorGlp1LastDose}
              onChange={(e) => onChange("priorGlp1LastDose", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Why did you stop / change protocol?
            </label>
            <input
              className={inputCls}
              placeholder="e.g. Completed course, switching compounds, cost"
              value={data.priorGlp1StopReason}
              onChange={(e) => onChange("priorGlp1StopReason", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Any side effects or adverse reactions?
            </label>
            <input
              className={inputCls}
              placeholder="e.g. Mild injection site redness. None otherwise."
              value={data.priorGlp1SideEffects}
              onChange={(e) => onChange("priorGlp1SideEffects", e.target.value)}
            />
          </div>

          {returningPatientNote && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs leading-relaxed text-zinc-600">
                {returningPatientNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
