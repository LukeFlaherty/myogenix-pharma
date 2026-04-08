import type { Medicine, MedicineConfig } from "./pdp-types";

export const MEDICINE_CONFIG: Record<Medicine, MedicineConfig> = {
  tirzepatide: {
    name: "Tirzepatide",
    genericName: "GIP/GLP-1 Receptor Agonist",
    tagline: "Dual-action GLP-1 therapy",
    description:
      "Tirzepatide activates both GIP and GLP-1 receptors, offering strong metabolic effects with once-weekly dosing.",
    doses: [
      { mg: 10, label: "10 mg", pricePerMonth: 199 },
      { mg: 20, label: "20 mg", pricePerMonth: 279 },
      { mg: 30, label: "30 mg", pricePerMonth: 349 },
      { mg: 40, label: "40 mg", pricePerMonth: 419 },
      { mg: 50, label: "50 mg", pricePerMonth: 489 },
    ],
    startingDose: 10,
    escalationStep: 10,
    consultFee: 79,
  },
  semaglutide: {
    name: "Semaglutide",
    genericName: "GLP-1 Receptor Agonist",
    tagline: "Proven GLP-1 therapy",
    description:
      "Semaglutide selectively activates GLP-1 receptors with a well-established clinical record across metabolic conditions.",
    doses: [
      { mg: 0.25, label: "0.25 mg", pricePerMonth: 179 },
      { mg: 0.5, label: "0.5 mg", pricePerMonth: 219 },
      { mg: 1, label: "1 mg", pricePerMonth: 269 },
      { mg: 1.7, label: "1.7 mg", pricePerMonth: 319 },
      { mg: 2.4, label: "2.4 mg", pricePerMonth: 369 },
    ],
    startingDose: 0.25,
    escalationStep: 0.25,
    consultFee: 79,
  },
};

export const MONTH_LABEL = ["First month", "Second month", "Third month"];

export const SUBSCRIPTION_DISCOUNT = 0.1; // 10% off

export function getNextRecommendedDose(
  config: MedicineConfig,
  currentMg: number
): number {
  const doses = config.doses.map((d) => d.mg);
  const idx = doses.indexOf(currentMg);
  if (idx === -1 || idx === doses.length - 1) return currentMg;
  return doses[idx + 1];
}

export function buildDefaultSelections(
  config: MedicineConfig,
  monthCount: number,
  previousLastDose?: number
): { month: number; mg: number }[] {
  const doses = config.doses.map((d) => d.mg);
  const startMg = previousLastDose ?? config.startingDose;
  const startIdx = Math.max(0, doses.indexOf(startMg));

  return Array.from({ length: monthCount }, (_, i) => {
    const idx = Math.min(startIdx + i, doses.length - 1);
    return { month: i + 1, mg: doses[idx] };
  });
}
