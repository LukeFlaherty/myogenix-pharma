"use client";

/**
 * IntakeShell — JSON-driven medical intake questionnaire
 *
 * Step definitions come from src/lib/intake-questions.json keyed by
 * order.medicine. Adding a new medicine = adding a key to that file.
 *
 * DATABASE STUB: On final submit, replace handleSubmit with a server action that:
 *   1. Encrypts PII fields before writing to DB
 *   2. Inserts an `intake_submissions` row
 *   3. Updates order status: "pending_intake" → "pending_review"
 *   4. Triggers provider notification + patient confirmation email
 *   5. Redirects to /intake/complete
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { IntakeData, OrderConfig } from "@/lib/checkout-types";
import { EMPTY_INTAKE } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

import { Step1Personal } from "./steps/Step1Personal";
import { Step2Metrics } from "./steps/Step2Metrics";
import { Step3MedHistory } from "./steps/Step3MedHistory";
import { Step4Medications } from "./steps/Step4Medications";
import { Step5GlpHistory } from "./steps/Step5GlpHistory";
import { Step5PeptideHistory } from "./steps/Step5PeptideHistory";
import { Step6Lifestyle } from "./steps/Step6Lifestyle";
import { Step7Review } from "./steps/Step7Review";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import type { Medicine } from "@/lib/pdp-types";

import questionsJson from "@/lib/intake-questions.json";

// ─── JSON schema types ────────────────────────────────────────────────────────

export interface Contraindication {
  key: string;
  warning: string;
}

export interface ConsentItem {
  key: keyof IntakeData;
  label: string;
}

export interface PriorMedOption {
  value: string;
  label: string;
}

export interface StepConfig {
  id: string;
  label: string;
  component: string;
  title: string;
  subtitle: string;
  // metrics
  bmiNote?: string;
  // conditions
  contraindications?: Contraindication[];
  // medications
  commonInteractions?: string[];
  // glp1_history
  priorMedicineOptions?: PriorMedOption[];
  returningPatientNote?: string;
  // review
  consents?: ConsentItem[];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  order: OrderConfig;
  orderId: string;
}

// ─── Component renderer ───────────────────────────────────────────────────────

function StepRenderer({
  config,
  data,
  onChange,
}: {
  config: StepConfig;
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
}) {
  switch (config.component) {
    case "personal":
      return <Step1Personal data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} />;
    case "metrics":
      return <Step2Metrics data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} bmiNote={config.bmiNote} />;
    case "conditions":
      return <Step3MedHistory data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} contraindications={config.contraindications ?? []} />;
    case "medications":
      return <Step4Medications data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} commonInteractions={config.commonInteractions ?? []} />;
    case "glp1_history":
      return <Step5GlpHistory data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} priorMedicineOptions={config.priorMedicineOptions ?? []} returningPatientNote={config.returningPatientNote ?? ""} />;
    case "peptide_history":
      return <Step5PeptideHistory data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} priorMedicineOptions={config.priorMedicineOptions ?? []} returningPatientNote={config.returningPatientNote ?? ""} />;
    case "lifestyle":
      return <Step6Lifestyle data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} />;
    case "review":
      return <Step7Review data={data} onChange={onChange} title={config.title} subtitle={config.subtitle} consents={config.consents ?? []} />;
    default:
      return <p className="text-sm text-zinc-400">Unknown step: {config.component}</p>;
  }
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function IntakeShell({ order, orderId }: Props) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<IntakeData>(EMPTY_INTAKE);
  const [submitting, setSubmitting] = useState(false);

  const questions = questionsJson as Record<string, { steps: StepConfig[] }>;
  const intakeKey = MEDICINE_CONFIG[order.medicine as Medicine]?.intakeKey ?? order.medicine;
  const steps: StepConfig[] = questions[order.medicine]?.steps ?? questions[intakeKey]?.steps ?? questions["tirzepatide"].steps;
  const totalSteps = steps.length;
  const currentStep = steps[stepIndex];
  const progress = ((stepIndex) / (totalSteps - 1)) * 100;

  const handleChange = useCallback(
    (field: keyof IntakeData, value: unknown) =>
      setData((d) => ({ ...d, [field]: value })),
    []
  );

  async function handleSubmit() {
    setSubmitting(true);
    // TODO: replace with server action — see file-level comment
    await new Promise((r) => setTimeout(r, 1500));
    router.push(`/intake/complete?orderId=${orderId}`);
  }

  const isLastStep = stepIndex === totalSteps - 1;

  const allConsented =
    data.consentClinicalReview &&
    data.consentNotReplacement &&
    data.consentProviderAdjust &&
    data.consentCancellation;

  return (
    <div className="flex flex-1 flex-col">
      {/* Full-width progress bar */}
      <div className="h-0.5 w-full bg-zinc-100">
        <div
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step breadcrumb pills */}
      <div className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-xl items-center gap-2 overflow-x-auto">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => i < stepIndex && setStepIndex(i)}
              disabled={i >= stepIndex}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                i === stepIndex
                  ? "bg-black text-white"
                  : i < stepIndex
                  ? "cursor-pointer bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                  : "bg-zinc-100 text-zinc-300 cursor-default"
              )}
            >
              {s.label}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-[11px] text-zinc-400">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:px-6">
          <StepRenderer config={currentStep} data={data} onChange={handleChange} />
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 border-t border-zinc-100 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStepIndex((i) => i - 1)}
                className="rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
              >
                ← Back
              </button>
            )}

            {!isLastStep ? (
              <button
                type="button"
                onClick={() => setStepIndex((i) => i + 1)}
                className="flex-1 rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !allConsented}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit intake →"
                )}
              </button>
            )}
          </div>

          {isLastStep && !allConsented && (
            <p className="mt-2 text-center text-xs text-zinc-400">
              Please acknowledge all consent items above to submit.
            </p>
          )}

          {/* Order context pill */}
          <p className="mt-3 text-center text-[11px] text-zinc-400">
            Order #{orderId}
          </p>
        </div>
      </div>
    </div>
  );
}
