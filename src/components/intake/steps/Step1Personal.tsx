"use client";

import type { IntakeData } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

interface Props {
  data: IntakeData;
  onChange: (field: keyof IntakeData, value: unknown) => void;
  title: string;
  subtitle: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-600">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
    </div>
  );
}

export function Step1Personal({ data, onChange, title, subtitle }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Legal first name">
          <input className={inputCls} placeholder="Jane" value={data.legalFirstName}
            onChange={(e) => onChange("legalFirstName", e.target.value)} />
        </Field>
        <Field label="Legal last name">
          <input className={inputCls} placeholder="Smith" value={data.legalLastName}
            onChange={(e) => onChange("legalLastName", e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of birth" hint="Must be 18 or older.">
          <input type="date" className={inputCls} value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)} />
        </Field>
        <Field label="Sex assigned at birth" hint="Required for clinical dosing guidelines.">
          <select className={cn(inputCls, "appearance-none")} value={data.sex}
            onChange={(e) => onChange("sex", e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </Field>
      </div>

      <Field label="State of residence" hint="Telemedicine is available only in states where our providers are licensed.">
        <select className={cn(inputCls, "appearance-none")} value={data.state}
          onChange={(e) => onChange("state", e.target.value)}>
          <option value="">Select state</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
    </div>
  );
}
