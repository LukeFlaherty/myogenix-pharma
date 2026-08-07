"use client";

import { MapPin, Truck, UserRound } from "lucide-react";
import type { PatientInfo } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";
import { uiFont } from "@/lib/ui-font";

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
      <label className="text-xs font-semibold text-zinc-400">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-white/15 bg-black/55 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/30 focus:border-red-500 focus:outline-none";

export function PatientInfoForm({ data, onChange }: Props) {
  return (
    <div className="grunge-panel space-y-7 border border-white/15 bg-black/72 p-5 text-white shadow-[0_22px_55px_rgba(0,0,0,0.34)] sm:p-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-red-600/60 bg-red-600/10 text-red-400">
            <UserRound className="h-4 w-4" />
          </span>
          <div>
            <p className={`${uiFont.className} text-[1.8rem] uppercase leading-none tracking-[0.045em] text-white`}>
              Patient information
            </p>
            <p className="text-[11px] text-zinc-500">Used for provider review and portal access.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="border-t border-white/10 pt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-red-600/60 bg-red-600/10 text-red-400">
            <Truck className="h-4 w-4" />
          </span>
          <div>
            <p className={`${uiFont.className} text-[1.8rem] uppercase leading-none tracking-[0.045em] text-white`}>
              Shipping address
            </p>
            <p className="text-[11px] text-zinc-500">Medication ships only after provider approval.</p>
          </div>
        </div>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
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

        <div className="mt-5 flex items-start gap-3 border border-red-900/70 bg-red-950/20 p-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs leading-relaxed text-zinc-400">
            Availability and prescribing requirements vary by state. The provider review confirms eligibility before any charge is captured.
          </p>
        </div>
      </div>
    </div>
  );
}
