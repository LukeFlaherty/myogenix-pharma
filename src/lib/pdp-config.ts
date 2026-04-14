import type { Medicine, MedicineConfig, ProductCategory } from "./pdp-types";

export const MEDICINE_CONFIG: Record<Medicine, MedicineConfig> = {
  // ─── GLP-1s ────────────────────────────────────────────────────────────────
  tirzepatide: {
    name: "Tirzepatide",
    genericName: "GIP/GLP-1 Receptor Agonist",
    category: "glp1",
    purchaseModel: "glp1",
    intakeKey: "tirzepatide",
    tagline: "Dual-action GLP-1 therapy",
    description:
      "Tirzepatide activates both GIP and GLP-1 receptors, offering strong metabolic effects with once-weekly dosing.",
    benefit: "Strongest average weight loss in clinical trials",
    doseUnit: "mg",
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
    category: "glp1",
    purchaseModel: "glp1",
    intakeKey: "semaglutide",
    tagline: "Proven GLP-1 therapy",
    description:
      "Semaglutide selectively activates GLP-1 receptors with a well-established clinical record across metabolic conditions.",
    benefit: "Most established clinical track record for weight and metabolic health",
    doseUnit: "mg",
    doses: [
      { mg: 0.25, label: "0.25 mg", pricePerMonth: 179 },
      { mg: 0.5,  label: "0.5 mg",  pricePerMonth: 219 },
      { mg: 1,    label: "1 mg",    pricePerMonth: 269 },
      { mg: 1.7,  label: "1.7 mg",  pricePerMonth: 319 },
      { mg: 2.4,  label: "2.4 mg",  pricePerMonth: 369 },
    ],
    startingDose: 0.25,
    escalationStep: 0.25,
    consultFee: 79,
  },

  // ─── Peptides (bottle model — 1–3 vials per order, flat dose) ────────────
  wolverine: {
    name: "Wolverine",
    genericName: "Recovery Peptide Blend",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Elite tissue recovery & healing blend",
    description:
      "Wolverine combines two of the most researched tissue-repair peptides in a single protocol. Designed for athletes, post-surgical patients, and anyone pushing the limits of physical recovery — it targets muscle, tendon, and gut repair at once.",
    benefit: "Accelerated healing, joint & tendon repair, anti-inflammatory",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 169 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 249 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },
  tesamorelin: {
    name: "Tesamorelin",
    genericName: "GHRH Analogue",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Clinically-studied growth hormone optimization",
    description:
      "Tesamorelin is a GHRH analogue with one of the strongest clinical evidence bases among injectable peptides. It stimulates natural pulsatile growth hormone release and has demonstrated significant reductions in visceral fat in clinical trials.",
    benefit: "Visceral fat reduction, GH optimization, lean mass support",
    doseUnit: "mg",
    doses: [
      { mg: 1, label: "1 mg/vial", pricePerMonth: 179 },
      { mg: 2, label: "2 mg/vial", pricePerMonth: 259 },
    ],
    startingDose: 1,
    escalationStep: 0,
    consultFee: 49,
  },
  klow: {
    name: "Klow",
    genericName: "Metabolic Peptide Blend",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Targeted fat metabolism & metabolic reset",
    description:
      "Klow is a precision-formulated metabolic peptide blend engineered for targeted fat reduction and body composition improvement. Each vial delivers a defined compound formula for consistent, provider-guided results.",
    benefit: "Targeted fat loss, appetite regulation, metabolic support",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 149 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 219 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },
  glow: {
    name: "Glow",
    genericName: "Longevity & Renewal Blend",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Cellular renewal & anti-aging peptide protocol",
    description:
      "Glow is a premium longevity peptide blend formulated to support cellular renewal, skin vitality, and antioxidant defense. Each vial is compounded to order and reviewed by a licensed provider before it ships.",
    benefit: "Cellular regeneration, skin health, antioxidant defense, longevity",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 179 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 259 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },
};

// ─── Category helpers ─────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  ProductCategory,
  { label: string; slug: string; tagline: string; description: string }
> = {
  glp1: {
    label: "Weight Management",
    slug: "weight-management",
    tagline: "GLP-1 & GIP/GLP-1 programs",
    description:
      "Provider-reviewed compounded semaglutide and tirzepatide, configured for your escalation protocol.",
  },
  peptide: {
    label: "Peptides",
    slug: "peptides",
    tagline: "Performance, recovery & longevity",
    description:
      "Compounded peptide protocols reviewed by licensed providers — healing, hormonal optimization, and anti-aging.",
  },
};

export const GLP1_MEDICINES: Medicine[] = ["tirzepatide", "semaglutide"];
export const PEPTIDE_MEDICINES: Medicine[] = [
  "wolverine", "tesamorelin", "klow", "glow",
];

export const MONTH_LABEL = ["First month", "Second month", "Third month"];
export const SUBSCRIPTION_DISCOUNT = 0.1;

export function getNextRecommendedDose(
  config: MedicineConfig,
  currentMg: number
): number {
  if (config.escalationStep === 0) return currentMg; // flat dose
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
    // Flat dose peptides stay at the same dose every month
    const idx =
      config.escalationStep === 0
        ? startIdx
        : Math.min(startIdx + i, doses.length - 1);
    return { month: i + 1, mg: doses[idx] };
  });
}
