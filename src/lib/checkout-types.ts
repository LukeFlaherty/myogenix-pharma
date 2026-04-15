import type { Medicine, PurchaseType, MonthDoseSelection } from "./pdp-types";

// ─── Order (from PDP configurator) ───────────────────────────────────────────

export interface OrderConfig {
  medicine: Medicine;
  purchaseType: PurchaseType;
  monthCount: number;
  selections: MonthDoseSelection[];
}

// ─── Order batch (one checkout session, one payment, N medicines) ─────────────
//
// This is the core of the multi-medicine data model. A patient can add several
// medicines to their cart and complete a single checkout. The resulting
// OrderBatch maps 1-to-1 with one Stripe PaymentIntent and one set of patient
// demographics (PatientInfo). After payment each order in the batch gets its
// own PortalOrder row and its own intake questionnaire.
//
// DB UPGRADE PATH
// ───────────────
// 1. Add an `order_batches` table:
//      { id, patientId, stripePaymentIntentId, affiliateSlug, createdAt }
// 2. Add an `orders` table with a `batchId` FK pointing at order_batches:
//      { id, batchId, medicine, purchaseType, monthCount, status, ... }
// 3. server action `createOrderBatch(batch, patient, stripeToken)`:
//      a. Upsert the patient row
//      b. Create the Stripe PaymentIntent for the combined total
//      c. Insert one order_batches row → get batchId
//      d. Insert one orders row per OrderConfig with status "pending_intake"
//      e. Return { batchId, orderIds: string[] }
// 4. Redirect to /checkout/confirmation?batchId=<id>&orderIds=<ids>
// 5. Portal fetches all orders WHERE batchId = X to group them visually
//
// STUB: createOrderBatch is faked in CheckoutShell — generates random IDs
// and redirects to confirmation without any real DB writes.

export interface OrderBatch {
  orders: OrderConfig[];
}

// ─── Checkout form ────────────────────────────────────────────────────────────

export interface PatientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  sex: "male" | "female" | "prefer_not" | "";
  state: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
}

export interface PaymentFormState {
  cardholderName: string;
  // NOTE: Real card data is never stored here.
  // Stripe.js tokenizes the card before any network call.
  // After tokenization: stripe.createPaymentMethod() returns a PaymentMethod ID
  // which is passed to your server → Stripe API to create/confirm a PaymentIntent.
  _stripePaymentMethodId: string | null; // set by Stripe.js, never by the user
}

// ─── Intake questionnaire ─────────────────────────────────────────────────────

export type PriorGlp1 = "yes" | "no" | "";
export type ExerciseFreq = "never" | "1-2x" | "3-4x" | "5+" | "daily" | "";
export type AlcoholUse = "none" | "occasional" | "weekly" | "daily" | "";
export type TobaccoUse = "never" | "former" | "current" | "";
export type DietType = "standard" | "mediterranean" | "keto" | "plant_based" | "other" | "";

export const MEDICAL_CONDITIONS = [
  { key: "type2_diabetes", label: "Type 2 Diabetes", flag: false },
  { key: "prediabetes", label: "Prediabetes", flag: false },
  { key: "pcos", label: "PCOS", flag: false },
  { key: "hypertension", label: "High Blood Pressure", flag: false },
  { key: "high_cholesterol", label: "High Cholesterol", flag: false },
  { key: "sleep_apnea", label: "Sleep Apnea", flag: false },
  { key: "thyroid_disorder", label: "Thyroid Disorder", flag: false },
  { key: "kidney_disease", label: "Kidney Disease (moderate–severe)", flag: true },
  { key: "liver_disease", label: "Liver Disease", flag: false },
  { key: "heart_disease", label: "Heart Disease / Cardiovascular", flag: false },
  { key: "pancreatitis", label: "History of Pancreatitis", flag: true },
  { key: "gallbladder", label: "Gallbladder Disease / Removal", flag: false },
  { key: "thyroid_cancer", label: "Personal or Family History of Thyroid Cancer (MTC/MEN2)", flag: true },
  { key: "eating_disorder", label: "History of Eating Disorder", flag: false },
  { key: "depression_anxiety", label: "Depression or Anxiety", flag: false },
  { key: "none", label: "None of the above", flag: false },
] as const;

export interface IntakeData {
  // Step 1 — Personal
  legalFirstName: string;
  legalLastName: string;
  dob: string;
  sex: "male" | "female" | "prefer_not" | "";
  state: string;

  // Step 2 — Body & Goals
  weightLbs: string;
  heightFt: string;
  heightIn: string;
  goalWeightLbs: string;
  primaryGoals: string[]; // "weight_loss" | "metabolic_health" | "maintenance"

  // Step 3 — Medical History
  conditions: string[];

  // Step 4 — Medications & Allergies
  currentMedications: string;
  allergies: string;
  supplements: string;

  // Step 5 — GLP-1 History
  priorGlp1: PriorGlp1;
  priorGlp1Which: string;
  priorGlp1LastDose: string;
  priorGlp1StopReason: string;
  priorGlp1SideEffects: string;

  // Step 6 — Lifestyle
  diet: DietType;
  exerciseFreq: ExerciseFreq;
  alcoholUse: AlcoholUse;
  tobaccoUse: TobaccoUse;
  recentSurgery: string;

  // Step 7 — Consents
  consentClinicalReview: boolean;
  consentNotReplacement: boolean;
  consentProviderAdjust: boolean;
  consentCancellation: boolean;

  // Medicine-specific catch-all for additional answers
  additionalAnswers: Record<string, string>;
}

export const EMPTY_INTAKE: IntakeData = {
  legalFirstName: "",
  legalLastName: "",
  dob: "",
  sex: "",
  state: "",
  weightLbs: "",
  heightFt: "",
  heightIn: "",
  goalWeightLbs: "",
  primaryGoals: [],
  conditions: [],
  currentMedications: "",
  allergies: "",
  supplements: "",
  priorGlp1: "",
  priorGlp1Which: "",
  priorGlp1LastDose: "",
  priorGlp1StopReason: "",
  priorGlp1SideEffects: "",
  diet: "",
  exerciseFreq: "",
  alcoholUse: "",
  tobaccoUse: "",
  recentSurgery: "",
  consentClinicalReview: false,
  consentNotReplacement: false,
  consentProviderAdjust: false,
  consentCancellation: false,
  additionalAnswers: {},
};
