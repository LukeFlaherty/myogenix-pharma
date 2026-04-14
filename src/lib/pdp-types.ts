// ─── Medicine ─────────────────────────────────────────────────────────────────

export type GLP1Medicine = "tirzepatide" | "semaglutide";

export type PeptideMedicine = "wolverine" | "tesamorelin" | "klow" | "glow";

export type Medicine = GLP1Medicine | PeptideMedicine;

export type ProductCategory = "glp1" | "peptide";

export type PurchaseType = "subscription" | "one-time";

// ─── Config ───────────────────────────────────────────────────────────────────

export interface DoseOption {
  mg: number;    // internal dose amount (unit determined by doseUnit on the config)
  label: string; // display label, e.g. "250 mcg", "5 mg", "2× daily"
  pricePerMonth: number;
}

export interface MedicineConfig {
  name: string;
  genericName: string;
  category: ProductCategory;
  /**
   * "glp1" — monthly subscription or one-time with escalation steps.
   * "bottle" — customer picks a vial size and quantity (1-3 bottles), one-time only.
   */
  purchaseModel: "glp1" | "bottle";
  /**
   * Key used to look up intake-questions.json.
   * Peptides share "peptide"; each GLP-1 has its own key.
   * Override per-medicine when you need a custom questionnaire.
   */
  intakeKey: string;
  doses: DoseOption[];
  startingDose: number;
  escalationStep: number; // 0 = flat dose (no escalation guidance)
  consultFee: number;
  tagline: string;
  description: string;
  /**
   * Display unit label shown in the dose picker and summaries.
   * e.g. "mg", "mcg", "mg/vial"
   */
  doseUnit: string;
  /**
   * Short blurb for use on the category landing card.
   */
  benefit: string;
}

// ─── Selections ───────────────────────────────────────────────────────────────

export interface MonthDoseSelection {
  month: number; // 1-indexed
  mg: number;    // dose amount in config.doseUnit units
}

export interface PdpState {
  medicine: Medicine;
  purchaseType: PurchaseType;
  monthCount: 1 | 2 | 3;
  monthSelections: MonthDoseSelection[];
}

export interface OrderSummaryLine {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}
