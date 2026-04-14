"use client";

import type { MonthDoseSelection, PurchaseType } from "@/lib/pdp-types";
import { MEDICINE_CONFIG, MONTH_LABEL, SUBSCRIPTION_DISCOUNT } from "@/lib/pdp-config";
import type { Medicine } from "@/lib/pdp-types";

interface Props {
  medicine: Medicine;
  purchaseType: PurchaseType;
  selections: MonthDoseSelection[];
}

export function OrderSummary({ medicine, purchaseType, selections }: Props) {
  const config = MEDICINE_CONFIG[medicine];

  const lineItems = selections.map((sel) => {
    const dose = config.doses.find((d) => d.mg === sel.mg)!;
    const basePrice = dose.pricePerMonth;
    const finalPrice =
      purchaseType === "subscription"
        ? basePrice * (1 - SUBSCRIPTION_DISCOUNT)
        : basePrice;
    return {
      label: `${MONTH_LABEL[sel.month - 1]} — ${dose.label}`,
      finalPrice,
      basePrice,
    };
  });

  const subtotal = lineItems.reduce((sum, l) => sum + l.basePrice, 0);
  const medicineTotal = lineItems.reduce((sum, l) => sum + l.finalPrice, 0);
  const savings = subtotal - medicineTotal;
  const consultFee = purchaseType === "one-time" ? config.consultFee : 0;
  const total = medicineTotal + consultFee;

  const renewalDose = selections[selections.length - 1];
  const renewalConfig = config.doses.find((d) => d.mg === renewalDose.mg)!;
  const renewalPrice = renewalConfig.pricePerMonth * (1 - SUBSCRIPTION_DISCOUNT);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Order summary
      </p>

      <div className="space-y-2">
        {lineItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-zinc-600">{item.label}</span>
            <span className="text-sm font-semibold text-black">
              ${item.finalPrice.toFixed(0)}
            </span>
          </div>
        ))}

        {purchaseType === "one-time" && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
            <span className="text-sm text-zinc-500">Provider consultation</span>
            <span className="text-sm text-zinc-500">${consultFee}</span>
          </div>
        )}

        {purchaseType === "subscription" && savings > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
            <span className="text-xs text-zinc-500">Subscription savings (10%)</span>
            <span className="text-xs font-semibold text-black">
              −${savings.toFixed(0)}
            </span>
          </div>
        )}
      </div>

      <div className="my-4 border-t border-zinc-200" />

      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold text-zinc-700">Total today</span>
        <span className="text-2xl font-bold text-black">${total.toFixed(0)}</span>
      </div>

      {purchaseType === "subscription" && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">
            <span className="font-semibold text-black">Auto-renews</span> at{" "}
            <span className="font-semibold text-black">
              {renewalConfig.label} · ${renewalPrice.toFixed(0)}/mo
            </span>{" "}
            after your supply ends. Cancel anytime before renewal.
          </p>
        </div>
      )}

      {purchaseType === "one-time" && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">
            A licensed provider reviews your order before it ships. The consult
            fee is non-refundable once your order is approved.
          </p>
        </div>
      )}
    </div>
  );
}
