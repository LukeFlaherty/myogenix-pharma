"use client";

import type { IntakeData } from "@/lib/checkout-types";
import { MEDICAL_CONDITIONS } from "@/lib/checkout-types";
import type { Contraindication } from "@/components/intake/IntakeShell";
import { cn } from "@/lib/utils";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
  contraindications: Contraindication[];
}

export function Step3MedHistory({ data, onChange, title, subtitle, contraindications }: Props) {
  function toggle(key: string) {
    let next: string[];
    if (key === "none") {
      next = data.conditions.includes("none") ? [] : ["none"];
    } else {
      const without = data.conditions.filter((c) => c !== "none");
      next = without.includes(key)
        ? without.filter((c) => c !== key)
        : [...without, key];
    }
    onChange("conditions", next);
  }

  // Build a lookup of medicine-specific contraindication warnings keyed by condition key
  const contraindicationMap = Object.fromEntries(
    contraindications.map((c) => [c.key, c.warning])
  );

  // Conditions selected by the patient that have a medicine-specific contraindication warning
  const activeContraindications = contraindications.filter((c) =>
    data.conditions.includes(c.key)
  );

  // Fall back to the base `flag` field for conditions that aren't in the JSON contraindications list
  const flaggedSelected = MEDICAL_CONDITIONS.filter(
    (c) => c.flag && data.conditions.includes(c.key) && !contraindicationMap[c.key]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {MEDICAL_CONDITIONS.map((condition) => {
          const active = data.conditions.includes(condition.key);
          const isContraindicated = Boolean(contraindicationMap[condition.key]);
          return (
            <button
              key={condition.key}
              type="button"
              onClick={() => toggle(condition.key)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                active
                  ? isContraindicated
                    ? "border-zinc-400 bg-zinc-50 text-black shadow-[0_0_0_1px_#a1a1aa]"
                    : "border-black bg-zinc-100 text-black shadow-[0_0_0_1px_black]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
              )}
            >
              <span className="font-medium">{condition.label}</span>
              {(condition.flag || isContraindicated) && (
                <span className="ml-2 shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                  Review
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Medicine-specific contraindication warnings */}
      {activeContraindications.map((c) => (
        <div key={c.key} className="flex items-start gap-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-zinc-500">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-black">Provider review required</p>
            <p className="mt-0.5 text-xs text-zinc-600">{c.warning}</p>
          </div>
        </div>
      ))}

      {/* Generic flagged-condition notice for non-contraindication flags */}
      {flaggedSelected.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-zinc-500">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-black">Provider review required</p>
            <p className="mt-0.5 text-xs text-zinc-600">
              You selected:{" "}
              <span className="font-medium">{flaggedSelected.map((c) => c.label).join(", ")}</span>
              . These conditions require provider review. You can still proceed — your provider will contact you if there are concerns.
            </p>
          </div>
        </div>
      )}

      {data.conditions.length === 0 && (
        <p className="text-xs text-zinc-400">
          Select at least one option, including &quot;None of the above&quot; if applicable.
        </p>
      )}
    </div>
  );
}
