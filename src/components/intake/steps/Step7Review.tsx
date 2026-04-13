"use client";

import type { IntakeData } from "@/lib/checkout-types";
import { MEDICAL_CONDITIONS } from "@/lib/checkout-types";
import type { ConsentItem } from "@/components/intake/IntakeShell";
import { cn } from "@/lib/utils";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
  consents: ConsentItem[];
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-xs">
      <span className="shrink-0 text-zinc-400">{label}</span>
      <span className="text-right font-medium text-black">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{title}</p>
      <div className="divide-y divide-zinc-50">{children}</div>
    </div>
  );
}

export function Step7Review({ data, onChange, title, subtitle, consents }: Props) {
  const conditionLabels = data.conditions.map(
    (k) => MEDICAL_CONDITIONS.find((c) => c.key === k)?.label ?? k
  );

  const allConsented = consents.every((c) => data[c.key]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="space-y-3">
        <Section title="Personal">
          <Row label="Name" value={`${data.legalFirstName} ${data.legalLastName}`} />
          <Row label="DOB" value={data.dob} />
          <Row label="Sex" value={data.sex} />
          <Row label="State" value={data.state} />
        </Section>

        <Section title="Body & goals">
          <Row label="Weight" value={data.weightLbs ? `${data.weightLbs} lbs` : ""} />
          <Row label="Height" value={data.heightFt ? `${data.heightFt}' ${data.heightIn}"` : ""} />
          <Row label="Goal weight" value={data.goalWeightLbs ? `${data.goalWeightLbs} lbs` : ""} />
          <Row label="Goals" value={data.primaryGoals.join(", ")} />
        </Section>

        <Section title="Medical history">
          <Row label="Conditions" value={conditionLabels.join(", ") || "None selected"} />
        </Section>

        <Section title="Medications">
          <Row label="Prescriptions" value={data.currentMedications || "None"} />
          <Row label="Allergies" value={data.allergies || "None"} />
          <Row label="Supplements" value={data.supplements || "None"} />
        </Section>

        <Section title="GLP-1 history">
          <Row label="Prior GLP-1" value={data.priorGlp1 === "yes" ? "Yes" : data.priorGlp1 === "no" ? "No" : "—"} />
          {data.priorGlp1 === "yes" && (
            <>
              <Row label="Medication" value={data.priorGlp1Which} />
              <Row label="Last dose" value={data.priorGlp1LastDose} />
            </>
          )}
        </Section>

        <Section title="Lifestyle">
          <Row label="Diet" value={data.diet} />
          <Row label="Exercise" value={data.exerciseFreq} />
          <Row label="Alcohol" value={data.alcoholUse} />
          <Row label="Tobacco" value={data.tobaccoUse} />
        </Section>
      </div>

      {/* Consent checkboxes */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Acknowledgements</p>
        {consents.map((consent) => {
          const checked = data[consent.key] as boolean;
          return (
            <label
              key={String(consent.key)}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                checked ? "border-black bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-400"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  checked ? "border-black bg-black" : "border-zinc-300 bg-white"
                )}
              >
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs leading-relaxed text-zinc-600">{consent.label}</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(e) => onChange(consent.key, e.target.checked)}
              />
            </label>
          );
        })}
      </div>

      {!allConsented && (
        <p className="text-xs text-zinc-400">Please acknowledge all items above before submitting.</p>
      )}
    </div>
  );
}
