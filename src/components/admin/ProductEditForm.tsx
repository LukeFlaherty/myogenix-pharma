"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import type { AdminProduct, AdminDoseTier } from "@/lib/admin-product-store";
import type { AdminSession } from "@/lib/admin-types";
import {
  saveProductMetaAction,
  saveProductDosesAction,
  toggleProductActiveAction,
  uploadProductImageAction,
} from "@/lib/admin-product-actions";

type Tab = "meta" | "doses" | "image";

interface Props {
  product: AdminProduct;
  session: AdminSession;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SaveButton({ pending, label = "Save changes" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1">{children}</label>;
}

function TextInput({
  name,
  defaultValue,
  required,
  placeholder,
}: {
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
    />
  );
}

function Textarea({
  name,
  defaultValue,
  rows = 3,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 resize-y"
    />
  );
}

function NumberInput({
  name,
  defaultValue,
  min,
  step,
}: {
  name: string;
  defaultValue?: number;
  min?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      name={name}
      defaultValue={defaultValue}
      min={min}
      step={step}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
    />
  );
}

// ─── Meta tab ─────────────────────────────────────────────────────────────────

function MetaTab({
  product,
  session,
}: {
  product: AdminProduct;
  session: AdminSession;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const canEdit = session.role !== "pharmacy";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveProductMetaAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="medicine" value={product.medicine} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>Product name</FieldLabel>
          <TextInput name="name" defaultValue={product.name} required />
        </div>
        <div>
          <FieldLabel>Generic name</FieldLabel>
          <TextInput name="genericName" defaultValue={product.genericName} required />
        </div>
      </div>

      <div>
        <FieldLabel>Tagline</FieldLabel>
        <TextInput name="tagline" defaultValue={product.tagline} placeholder="Short marketing headline" />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea name="description" defaultValue={product.description} rows={4} />
      </div>

      <div>
        <FieldLabel>Benefit statement</FieldLabel>
        <TextInput name="benefit" defaultValue={product.benefit} placeholder="e.g. Supports metabolic health" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <FieldLabel>Dose unit</FieldLabel>
          <TextInput name="doseUnit" defaultValue={product.doseUnit} placeholder="mg / mcg / IU" required />
        </div>
        <div>
          <FieldLabel>Consult fee ($)</FieldLabel>
          <NumberInput name="consultFee" defaultValue={product.consultFee} min={0} step={1} />
        </div>
        <div>
          <FieldLabel>Escalation step ({product.doseUnit})</FieldLabel>
          <NumberInput name="escalationStep" defaultValue={product.escalationStep} min={0} step={0.1} />
          <p className="mt-1 text-[11px] text-slate-400">Set to 0 for flat-dose products (peptides)</p>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-3 pt-2">
          <SaveButton pending={pending} />
          {saved && <span className="text-sm font-medium text-green-600">Saved!</span>}
        </div>
      )}
    </form>
  );
}

// ─── Doses tab ────────────────────────────────────────────────────────────────

function DosesTab({
  product,
  session,
}: {
  product: AdminProduct;
  session: AdminSession;
}) {
  const [tiers, setTiers] = useState<AdminDoseTier[]>(product.doses.map((d) => ({ ...d })));
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const canEdit = session.role !== "pharmacy";

  function addTier() {
    setTiers((prev) => [...prev, { mg: 0, label: "", pricePerMonth: 0 }]);
  }

  function removeTier(idx: number) {
    setTiers((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateTier(idx: number, field: keyof AdminDoseTier, value: string) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === idx
          ? { ...t, [field]: field === "label" ? value : Number(value) }
          : t
      )
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("medicine", product.medicine);
    fd.set("doses", JSON.stringify(tiers));
    startTransition(async () => {
      await saveProductDosesAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500">
        Dose tiers define what options the customer sees. Order matters — the first tier is the starting dose.
      </p>

      <div className="space-y-3">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-3 items-end rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <div>
              <FieldLabel>Dose ({product.doseUnit})</FieldLabel>
              <input
                type="number"
                value={tier.mg}
                min={0}
                step={0.01}
                onChange={(e) => updateTier(idx, "mg", e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            <div>
              <FieldLabel>Label</FieldLabel>
              <input
                type="text"
                value={tier.label}
                onChange={(e) => updateTier(idx, "label", e.target.value)}
                placeholder="e.g. 2.5 mg/week"
                disabled={!canEdit}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            <div>
              <FieldLabel>Price/mo ($)</FieldLabel>
              <input
                type="number"
                value={tier.pricePerMonth}
                min={0}
                step={1}
                onChange={(e) => updateTier(idx, "pricePerMonth", e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => removeTier(idx)}
                disabled={tiers.length <= 1}
                className="mb-0.5 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-colors"
                aria-label="Remove tier"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <>
          <button
            type="button"
            onClick={addTier}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors w-full justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add tier
          </button>

          <div className="flex items-center gap-3 pt-1">
            <SaveButton pending={pending} />
            {saved && <span className="text-sm font-medium text-green-600">Saved!</span>}
          </div>
        </>
      )}
    </form>
  );
}

// ─── Image tab ────────────────────────────────────────────────────────────────

function ImageTab({
  product,
  session,
}: {
  product: AdminProduct;
  session: AdminSession;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canEdit = session.role !== "pharmacy";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await uploadProductImageAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      {/* Current image */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">Current image</p>
        <div className="relative w-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <Image
            src={`/${product.imageKey}`}
            alt={product.name}
            width={192}
            height={192}
            className="aspect-square w-full object-cover"
          />
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-slate-400">{product.imageKey}</p>
      </div>

      {/* Upload form */}
      {canEdit && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="medicine" value={product.medicine} />

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-600">Upload new image</p>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center hover:border-slate-300 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-slate-300">
                <path d="M14 4v14M7 11l7-7 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 22h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-medium text-slate-500">Click to select image</p>
              <p className="text-xs text-slate-400">JPG, PNG, WebP — square format recommended</p>
              <input
                ref={fileRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-700">Image upload is stubbed</p>
            <p className="mt-0.5 text-xs text-amber-600">
              Submitting this form re-confirms the existing image key. Real implementation uploads to S3 and updates the CDN URL. See <code className="font-mono">admin-product-actions.ts</code> for the TODO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SaveButton pending={pending} label="Upload image" />
            {saved && <span className="text-sm font-medium text-green-600">Updated!</span>}
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Active toggle ─────────────────────────────────────────────────────────────

function ActiveToggle({
  product,
  session,
}: {
  product: AdminProduct;
  session: AdminSession;
}) {
  const [active, setActive] = useState(product.active);
  const [pending, startTransition] = useTransition();

  if (session.role !== "admin") return null;

  function toggle() {
    const next = !active;
    const fd = new FormData();
    fd.set("medicine", product.medicine);
    fd.set("active", String(next));
    startTransition(async () => {
      await toggleProductActiveAction(fd);
      setActive(next);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
          active ? "bg-green-500" : "bg-slate-300"
        }`}
        role="switch"
        aria-checked={active}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
            active ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-slate-700">
        {active ? "Active — visible on storefront" : "Inactive — hidden from storefront"}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductEditForm({ product, session }: Props) {
  const [tab, setTab] = useState<Tab>("meta");

  const TABS: { id: Tab; label: string }[] = [
    { id: "meta", label: "Details" },
    { id: "doses", label: "Dose tiers" },
    { id: "image", label: "Image" },
  ];

  return (
    <div className="space-y-6">
      {/* Active toggle */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">Storefront visibility</p>
          <p className="text-xs text-slate-500">Toggle whether this product appears on the public storefront</p>
        </div>
        <ActiveToggle product={product} session={session} />
      </div>

      {/* Tab panel */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                tab === id
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === "meta" && <MetaTab product={product} session={session} />}
          {tab === "doses" && <DosesTab product={product} session={session} />}
          {tab === "image" && <ImageTab product={product} session={session} />}
        </div>
      </div>

      {/* Last updated */}
      <p className="text-xs text-slate-400">
        Last updated{" "}
        {new Date(product.updatedAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}{" "}
        by {product.updatedBy}
      </p>
    </div>
  );
}
