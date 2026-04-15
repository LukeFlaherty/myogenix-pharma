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

  const isBottleModel = medConfig.purchaseModel === "bottle";
  const PERIOD_LABELS = isBottleModel
    ? ["Bottle 1", "Bottle 2", "Bottle 3"]
    : ["First month", "Second month", "Third month"];

  const lineItems = config.selections.map((sel) => {
    const dose = medConfig.doses.find((d) => d.mg === sel.mg)!;
    const price =
      config.purchaseType === "subscription"
        ? dose.pricePerMonth * (1 - DISCOUNT)
        : dose.pricePerMonth;
    return { label: `${PERIOD_LABELS[sel.month - 1]} — ${dose.label}`, price };
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

// ─── Batch encoding (multi-medicine checkout) ─────────────────────────────────
//
// A "batch" is a JSON array of OrderConfig encoded exactly like a single order.
// The checkout page normalises both ?order= (single, from PDP) and ?batch=
// (multi, from cart) into OrderConfig[] before handing off to CheckoutShell.

/**
 * Encodes an array of OrderConfigs into a URL-safe base64 string.
 * Used by the cart page to pass all items to /checkout in a single ?batch= param.
 */
export function encodeBatch(orders: OrderConfig[]): string {
  const json = JSON.stringify(orders);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes a ?batch= URL param back to an array of OrderConfigs.
 * Returns null if the string is malformed or missing required fields.
 */
export function decodeBatch(encoded: string): OrderConfig[] | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed = JSON.parse(json) as unknown[];
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      !parsed.every(
        (o): o is OrderConfig =>
          typeof o === "object" &&
          o !== null &&
          typeof (o as OrderConfig).medicine === "string" &&
          typeof (o as OrderConfig).purchaseType === "string" &&
          Array.isArray((o as OrderConfig).selections)
      )
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Calculates the combined total across all orders in a batch.
 * Useful for displaying the grand total at checkout and in the order summary.
 */
export function calcBatchTotal(orders: OrderConfig[]): number {
  return orders.reduce((sum, order) => {
    const { total } = calcOrderTotal(order);
    return sum + total;
  }, 0);
}
