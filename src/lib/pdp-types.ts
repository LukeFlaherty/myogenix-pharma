export type Medicine = "tirzepatide" | "semaglutide";
export type PurchaseType = "subscription" | "one-time";

export interface DoseOption {
  mg: number;
  label: string;
  pricePerMonth: number;
}

export interface MedicineConfig {
  name: string;
  genericName: string;
  doses: DoseOption[];
  startingDose: number;
  escalationStep: number; // mg per month suggestion
  consultFee: number; // for one-time orders
  tagline: string;
  description: string;
}

export interface MonthDoseSelection {
  month: number; // 1-indexed
  mg: number;
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
