"use client";

import type { PatientInfo } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

interface Props {
  data: PatientInfo;
  onChange: (field: keyof PatientInfo, value: string) => void;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-600">
        {label}
        {required && <span className="ml-0.5 text-black">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

export function PatientInfoForm({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-4 text-base font-bold text-black">Patient information</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" required>
            <input
              className={inputCls}
              placeholder="Jane"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </Field>
          <Field label="Last name" required>
            <input
              className={inputCls}
              placeholder="Smith"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Date of birth" required>
            <input
              type="date"
              className={inputCls}
              value={data.dob}
              onChange={(e) => onChange("dob", e.target.value)}
            />
          </Field>
          <Field label="Sex assigned at birth" required>
            <select
              className={cn(inputCls, "appearance-none")}
              value={data.sex}
              onChange={(e) => onChange("sex", e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Email" required>
            <input
              type="email"
              className={inputCls}
              placeholder="jane@example.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              className={inputCls}
              placeholder="(555) 000-0000"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-zinc-100 pt-6">
        <p className="mb-4 text-base font-bold text-black">Shipping address</p>

        <div className="space-y-4">
          <Field label="Address line 1" required>
            <input
              className={inputCls}
              placeholder="123 Main St"
              value={data.address1}
              onChange={(e) => onChange("address1", e.target.value)}
            />
          </Field>

          <Field label="Address line 2">
            <input
              className={inputCls}
              placeholder="Apt, suite, unit (optional)"
              value={data.address2}
              onChange={(e) => onChange("address2", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field label="City" required>
                <input
                  className={inputCls}
                  placeholder="New York"
                  value={data.city}
                  onChange={(e) => onChange("city", e.target.value)}
                />
              </Field>
            </div>
            <Field label="State" required>
              <select
                className={cn(inputCls, "appearance-none")}
                value={data.state}
                onChange={(e) => onChange("state", e.target.value)}
              >
                <option value="">ST</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="ZIP code" required>
            <input
              className={inputCls}
              placeholder="10001"
              maxLength={10}
              value={data.zip}
              onChange={(e) => onChange("zip", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
