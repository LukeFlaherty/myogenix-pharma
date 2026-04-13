/**
 * Encodes an OrderConfig into a URL-safe base64 string for passing
 * between the PDP configurator and the checkout page via query params.
 *
 * NOTE: This is a UI-only mechanism. The canonical order is created
 * server-side during checkout. Never trust these params as authoritative —
 * always re-validate price/dose server-side before charging.
 */

import type { OrderConfig } from "./checkout-types";
import type { Medicine, PurchaseType } from "./pdp-types";
import { MEDICINE_CONFIG } from "./pdp-config";

export function encodeOrder(config: OrderConfig): string {
  const json = JSON.stringify(config);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeOrder(encoded: string): OrderConfig | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed = JSON.parse(json) as OrderConfig;
    // Basic validation
    if (!parsed.medicine || !parsed.purchaseType || !parsed.selections?.length) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function defaultOrder(medicine: Medicine = "tirzepatide"): OrderConfig {
  const config = MEDICINE_CONFIG[medicine];
  return {
    medicine,
    purchaseType: "subscription",
    monthCount: 1,
    selections: [{ month: 1, mg: config.startingDose }],
  };
}

export function calcOrderTotal(config: OrderConfig): {
  lineItems: { label: string; price: number }[];
  subtotal: number;
  savings: number;
  consultFee: number;
  total: number;
} {
  const medConfig = MEDICINE_CONFIG[config.medicine];
  const DISCOUNT = 0.1;

  const lineItems = config.selections.map((sel) => {
    const dose = medConfig.doses.find((d) => d.mg === sel.mg)!;
    const price =
      config.purchaseType === "subscription"
        ? dose.pricePerMonth * (1 - DISCOUNT)
        : dose.pricePerMonth;
    const MONTH_LABELS = ["First month", "Second month", "Third month"];
    return { label: `${MONTH_LABELS[sel.month - 1]} — ${dose.label}`, price };
  });

  const subtotal = config.selections.reduce((sum, sel) => {
    const dose = medConfig.doses.find((d) => d.mg === sel.mg)!;
    return sum + dose.pricePerMonth;
  }, 0);

  const medicineTotal = lineItems.reduce((s, l) => s + l.price, 0);
  const savings = subtotal - medicineTotal;
  const consultFee = config.purchaseType === "one-time" ? medConfig.consultFee : 0;
  const total = medicineTotal + consultFee;

  return { lineItems, subtotal, savings, consultFee, total };
}

// For passing medicine + purchaseType through to intake/confirmation
export function orderToSearchParams(config: OrderConfig): URLSearchParams {
  return new URLSearchParams({ order: encodeOrder(config) });
}
