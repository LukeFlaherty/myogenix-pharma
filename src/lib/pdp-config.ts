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
  retatrutide: {
    name: "Retatrutide",
    genericName: "GIP/GLP-1/Glucagon Triple Agonist",
    category: "glp1",
    purchaseModel: "glp1",
    intakeKey: "tirzepatide",
    tagline: "Next-generation triple-action therapy",
    description:
      "Retatrutide activates GIP, GLP-1, and glucagon receptors simultaneously — the newest and most metabolically active compound in the GLP-1 family, currently showing the largest average weight reductions in trials.",
    benefit: "Emerging triple-agonist with the strongest early trial results",
    doseUnit: "mg",
    doses: [
      { mg: 2,  label: "2 mg",  pricePerMonth: 229 },
      { mg: 4,  label: "4 mg",  pricePerMonth: 309 },
      { mg: 8,  label: "8 mg",  pricePerMonth: 389 },
      { mg: 12, label: "12 mg", pricePerMonth: 459 },
    ],
    startingDose: 2,
    escalationStep: 2,
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
  bpc157: {
    name: "BPC-157",
    genericName: "Body Protection Compound",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Gut, tendon & soft-tissue repair peptide",
    description:
      "BPC-157 is a synthetic peptide derived from a protein found in gastric juice, widely studied for its role in accelerating healing of tendons, ligaments, and the gut lining.",
    benefit: "Soft-tissue repair, gut healing, anti-inflammatory support",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 129 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 189 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },
  cjc1295: {
    name: "CJC-1295",
    genericName: "GHRH Analogue (with Ipamorelin)",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Sustained growth hormone release",
    description:
      "CJC-1295 is a long-acting GHRH analogue that stimulates a steady, sustained release of growth hormone — commonly paired with a GHRP for lean mass, recovery, and sleep quality support.",
    benefit: "Sustained GH release, lean mass support, improved recovery",
    doseUnit: "mg",
    doses: [
      { mg: 2, label: "2 mg/vial", pricePerMonth: 149 },
      { mg: 5, label: "5 mg/vial", pricePerMonth: 219 },
    ],
    startingDose: 2,
    escalationStep: 0,
    consultFee: 49,
  },
  epithalon: {
    name: "Epithalon",
    genericName: "Synthetic Tetrapeptide",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Longevity peptide targeting cellular aging",
    description:
      "Epithalon is a synthetic tetrapeptide studied for its potential to support telomerase activity, circadian rhythm regulation, and overall cellular longevity.",
    benefit: "Cellular longevity, circadian rhythm support, antioxidant defense",
    doseUnit: "mg",
    doses: [
      { mg: 10, label: "10 mg/vial", pricePerMonth: 159 },
    ],
    startingDose: 10,
    escalationStep: 0,
    consultFee: 49,
  },
  glutathione: {
    name: "Glutathione",
    genericName: "Master Antioxidant Peptide",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "The body's master antioxidant",
    description:
      "Glutathione is a naturally occurring tripeptide and the body's primary intracellular antioxidant, supporting detoxification, immune function, and skin clarity.",
    benefit: "Detoxification, immune support, skin brightening",
    doseUnit: "mg",
    doses: [
      { mg: 600,  label: "600 mg/vial",  pricePerMonth: 119 },
      { mg: 1200, label: "1200 mg/vial", pricePerMonth: 179 },
    ],
    startingDose: 600,
    escalationStep: 0,
    consultFee: 39,
  },
  motsc: {
    name: "MOTS-c",
    genericName: "Mitochondrial-Derived Peptide",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Metabolic & mitochondrial performance peptide",
    description:
      "MOTS-c is a mitochondrial-derived peptide studied for its role in regulating metabolic homeostasis, insulin sensitivity, and exercise performance.",
    benefit: "Metabolic support, insulin sensitivity, exercise performance",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 159 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 229 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },
  nad: {
    name: "NAD+",
    genericName: "Nicotinamide Adenine Dinucleotide",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Cellular energy & longevity coenzyme",
    description:
      "NAD+ is a coenzyme found in every cell, essential for energy metabolism and DNA repair. Levels decline with age — supplementation is studied for energy, cognition, and cellular repair support.",
    benefit: "Cellular energy, DNA repair support, cognitive clarity",
    doseUnit: "mg",
    doses: [
      { mg: 500,  label: "500 mg/vial",  pricePerMonth: 179 },
      { mg: 1000, label: "1000 mg/vial", pricePerMonth: 269 },
    ],
    startingDose: 500,
    escalationStep: 0,
    consultFee: 49,
  },
  sermorelin: {
    name: "Sermorelin",
    genericName: "GHRH Analogue",
    category: "peptide",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Natural growth hormone stimulation",
    description:
      "Sermorelin is a GHRH analogue that stimulates the pituitary gland to produce and release growth hormone naturally, supporting lean mass, sleep quality, and recovery.",
    benefit: "Natural GH stimulation, improved sleep, lean mass support",
    doseUnit: "mg",
    doses: [
      { mg: 5,  label: "5 mg/vial",  pricePerMonth: 149 },
      { mg: 10, label: "10 mg/vial", pricePerMonth: 219 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 49,
  },

  // ─── Sexual health (bottle model) ────────────────────────────────────────
  sildenafil: {
    name: "Sildenafil",
    genericName: "PDE5 Inhibitor",
    category: "sexual-health",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "On-demand ED therapy",
    description:
      "Sildenafil is a PDE5 inhibitor that increases blood flow to treat erectile dysfunction, with effects typically lasting 4–6 hours. The generic active ingredient in Viagra.",
    benefit: "Fast-acting, well-established ED treatment",
    doseUnit: "mg",
    unitLabel: "dose",
    doses: [
      { mg: 50,  label: "50 mg", pricePerMonth: 89 },
      { mg: 100, label: "100 mg", pricePerMonth: 119 },
    ],
    startingDose: 50,
    escalationStep: 0,
    consultFee: 39,
  },
  tadalafil: {
    name: "Tadalafil",
    genericName: "PDE5 Inhibitor",
    category: "sexual-health",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Long-acting ED therapy",
    description:
      "Tadalafil is a PDE5 inhibitor with effects lasting up to 36 hours, offering more spontaneity than short-acting alternatives. The generic active ingredient in Cialis.",
    benefit: "Up to 36-hour window, daily or as-needed dosing",
    doseUnit: "mg",
    unitLabel: "dose",
    doses: [
      { mg: 5,  label: "5 mg (daily)",     pricePerMonth: 99 },
      { mg: 20, label: "20 mg (as-needed)", pricePerMonth: 129 },
    ],
    startingDose: 5,
    escalationStep: 0,
    consultFee: 39,
  },

  // ─── Men's health (bottle model) ─────────────────────────────────────────
  testosterone: {
    name: "Testosterone",
    genericName: "Testosterone Cypionate",
    category: "mens-health",
    purchaseModel: "bottle",
    intakeKey: "peptide",
    tagline: "Provider-managed TRT",
    description:
      "Testosterone cypionate is an injectable testosterone ester used for provider-managed testosterone replacement therapy in patients with clinically low levels.",
    benefit: "Energy, libido, muscle mass & mood support for low-T patients",
    doseUnit: "mg",
    doses: [
      { mg: 200, label: "200 mg/mL vial", pricePerMonth: 149 },
      { mg: 400, label: "400 mg/mL vial", pricePerMonth: 229 },
    ],
    startingDose: 200,
    escalationStep: 0,
    consultFee: 79,
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
  "sexual-health": {
    label: "Sexual Health",
    slug: "sexual-health",
    tagline: "PDE5 inhibitor therapy",
    description:
      "Provider-reviewed ED treatment, compounded to order and shipped discreetly.",
  },
  "mens-health": {
    label: "Mens Health",
    slug: "mens-health",
    tagline: "Hormone optimization",
    description:
      "Provider-managed testosterone replacement therapy for clinically low levels.",
  },
};

export const GLP1_MEDICINES: Medicine[] = ["tirzepatide", "semaglutide", "retatrutide"];
export const PEPTIDE_MEDICINES: Medicine[] = [
  "wolverine", "tesamorelin", "klow", "glow",
  "bpc157", "cjc1295", "epithalon", "glutathione", "motsc", "nad", "sermorelin",
];
export const SEXUAL_HEALTH_MEDICINES: Medicine[] = ["sildenafil", "tadalafil"];
export const MENS_HEALTH_MEDICINES: Medicine[] = ["testosterone"];

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
