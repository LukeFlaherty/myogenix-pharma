/**
 * IntakeViewer — renders a completed IntakeData submission as a readable
 * clinical chart note for provider review.
 *
 * Server component (no client state needed — purely display).
 */

import { MEDICAL_CONDITIONS } from "@/lib/checkout-types";
import type { IntakeData } from "@/lib/checkout-types";

interface Props {
  data: IntakeData;
  submittedAt?: string;
}

// ─── BMI helpers ──────────────────────────────────────────────────────────────

function calcBmi(data: IntakeData): number | null {
  const w = parseFloat(data.weightLbs);
  const ft = parseFloat(data.heightFt);
  const inch = parseFloat(data.heightIn);
  if (!w || isNaN(ft) || isNaN(inch)) return null;
  const totalInches = ft * 12 + inch;
  if (totalInches <= 0) return null;
  return (w / (totalInches * totalInches)) * 703;
}

function bmiLabel(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight",          color: "text-blue-600"  };
  if (bmi < 25)   return { label: "Normal",               color: "text-green-700" };
  if (bmi < 30)   return { label: "Overweight",           color: "text-amber-600" };
  if (bmi < 35)   return { label: "Obese (Class I)",      color: "text-orange-600"};
  if (bmi < 40)   return { label: "Obese (Class II)",     color: "text-red-600"   };
  return             { label: "Obese (Class III)",     color: "text-red-700"   };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {title}
    </p>
  );
}

function Row({ label, value, flag }: { label: string; value: string; flag?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className={`text-xs font-semibold text-right ${flag ? "text-red-600" : "text-slate-800"}`}>
        {flag && "⚠ "}{value}
      </span>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="py-2 border-b border-slate-100 last:border-0">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <SectionHeader title={title} />
      {children}
    </div>
  );
}

const SEX_LABELS: Record<string, string> = {
  male: "Male", female: "Female", prefer_not: "Prefer not to say",
};
const DIET_LABELS: Record<string, string> = {
  standard: "Standard American", mediterranean: "Mediterranean",
  keto: "Keto / Low-carb", plant_based: "Plant-based", other: "Other",
};
const EXERCISE_LABELS: Record<string, string> = {
  never: "Never", "1-2x": "1–2× / week", "3-4x": "3–4× / week",
  "5+": "5+ / week", daily: "Daily",
};
const ALCOHOL_LABELS: Record<string, string> = {
  none: "None", occasional: "Occasional (1–3/month)",
  weekly: "Weekly (1–7/week)", daily: "Daily",
};
const TOBACCO_LABELS: Record<string, string> = {
  never: "Never", former: "Former smoker", current: "Current smoker",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function IntakeViewer({ data, submittedAt }: Props) {
  const bmi = calcBmi(data);
  const bmiInfo = bmi ? bmiLabel(bmi) : null;

  // Map selected condition keys to their full config (for flag checking)
  const selectedConditions = MEDICAL_CONDITIONS.filter((c) =>
    data.conditions.includes(c.key)
  );
  const flaggedConditions = selectedConditions.filter((c) => c.flag);

  // Date display
  const submittedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="space-y-4">
      {submittedDate && (
        <p className="text-xs text-slate-400">Submitted {submittedDate}</p>
      )}

      {/* Clinical flags banner */}
      {flaggedConditions.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">
            Clinical flags — review carefully
          </p>
          <ul className="space-y-1">
            {flaggedConditions.map((c) => (
              <li key={c.key} className="flex items-start gap-2 text-xs text-red-700">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 1 — Personal */}
      <Section title="1 — Personal information">
        <Row label="Legal name"  value={`${data.legalFirstName} ${data.legalLastName}`} />
        <Row label="Date of birth" value={data.dob || "—"} />
        <Row label="Sex"         value={SEX_LABELS[data.sex] ?? (data.sex || "—")} />
        <Row label="State"       value={data.state || "—"} />
      </Section>

      {/* 2 — Metrics */}
      <Section title="2 — Body metrics & goals">
        <Row label="Weight"       value={data.weightLbs ? `${data.weightLbs} lbs` : "—"} />
        <Row label="Height"       value={data.heightFt && data.heightIn ? `${data.heightFt}' ${data.heightIn}"` : "—"} />
        <Row label="Goal weight"  value={data.goalWeightLbs ? `${data.goalWeightLbs} lbs` : "—"} />
        {bmi && bmiInfo && (
          <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-500 shrink-0">BMI (calculated)</span>
            <span className={`text-xs font-bold ${bmiInfo.color}`}>
              {bmi.toFixed(1)} — {bmiInfo.label}
            </span>
          </div>
        )}
        <Row
          label="Primary goals"
          value={
            data.primaryGoals.length
              ? data.primaryGoals
                  .map((g) =>
                    g === "weight_loss" ? "Weight loss"
                    : g === "metabolic_health" ? "Metabolic health"
                    : "Maintenance"
                  )
                  .join(", ")
              : "—"
          }
        />
      </Section>

      {/* 3 — Medical history */}
      <Section title="3 — Medical history">
        {selectedConditions.length === 0 ? (
          <Row label="Conditions" value="None of the above" />
        ) : (
          selectedConditions.map((c) => (
            <Row key={c.key} label={c.key === "none" ? "Conditions" : ""} value={c.label} flag={c.flag} />
          ))
        )}
      </Section>

      {/* 4 — Medications & Allergies */}
      <Section title="4 — Medications, allergies & supplements">
        <Block label="Current medications" value={data.currentMedications || "None reported"} />
        <Block label="Known allergies"     value={data.allergies || "None reported"} />
        <Block label="Supplements"         value={data.supplements || "None reported"} />
      </Section>

      {/* 5 — GLP-1 History */}
      <Section title="5 — GLP-1 history">
        <Row label="Prior GLP-1 use" value={data.priorGlp1 === "yes" ? "Yes" : data.priorGlp1 === "no" ? "No" : "—"} />
        {data.priorGlp1 === "yes" && (
          <>
            <Row label="Which medication"    value={data.priorGlp1Which || "—"} />
            <Row label="Last dose / strength" value={data.priorGlp1LastDose || "—"} />
            <Block label="Reason for stopping" value={data.priorGlp1StopReason} />
            <Block label="Side effects"        value={data.priorGlp1SideEffects} />
          </>
        )}
      </Section>

      {/* 6 — Lifestyle */}
      <Section title="6 — Lifestyle">
        <Row label="Diet"      value={DIET_LABELS[data.diet]     ?? (data.diet     || "—")} />
        <Row label="Exercise"  value={EXERCISE_LABELS[data.exerciseFreq] ?? (data.exerciseFreq || "—")} />
        <Row label="Alcohol"   value={ALCOHOL_LABELS[data.alcoholUse]   ?? (data.alcoholUse   || "—")} />
        <Row label="Tobacco"   value={TOBACCO_LABELS[data.tobaccoUse]   ?? (data.tobaccoUse   || "—")} />
        <Block label="Recent surgery / procedures" value={data.recentSurgery} />
      </Section>

      {/* 7 — Consents */}
      <Section title="7 — Consents">
        {[
          { key: "consentClinicalReview",  label: "Clinical review & prescribing" },
          { key: "consentNotReplacement",  label: "Not a replacement for primary care" },
          { key: "consentProviderAdjust",  label: "Provider may adjust dose / deny" },
          { key: "consentCancellation",    label: "Cancellation & refund policy" },
        ].map(({ key, label }) => {
          const agreed = data[key as keyof IntakeData] as boolean;
          return (
            <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
              <span className="text-xs text-slate-500">{label}</span>
              <span className={`text-xs font-bold ${agreed ? "text-green-700" : "text-red-600"}`}>
                {agreed ? "Agreed" : "Not agreed"}
              </span>
            </div>
          );
        })}
      </Section>
    </div>
  );
}
