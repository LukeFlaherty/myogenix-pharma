/**
 * Admin portal stub data.
 *
 * DATABASE NOTE: Replace all of this with Prisma queries once the DB is wired.
 * The helper functions below (getAdminOrderView, getPatientOrders, etc.) should
 * map 1:1 to DB queries — only the data source changes, not the shape.
 *
 * MUTATION NOTE: Server actions mutate these module-level arrays in-memory.
 * This persists for the lifetime of the dev server process (not across restarts).
 * That is intentional — it simulates a real DB without needing one.
 */

import { STUB_ORDERS } from "./portal-stub-data";
import type {
  AdminOrder,
  AdminPatient,
  AuditLogEntry,
  IntakeSubmission,
  Prescription,
  StaffMember,
} from "./admin-types";
import type { IntakeData } from "./checkout-types";

// ─── Staff ────────────────────────────────────────────────────────────────────

export const STUB_STAFF: StaffMember[] = [
  {
    staffId: "staff_001",
    email: "admin@myogenixpharma.com",
    firstName: "Jordan",
    lastName: "Rivera",
    role: "admin",
    title: "Operations Director",
  },
  {
    staffId: "staff_002",
    email: "dr.mills@myogenixpharma.com",
    firstName: "Sarah",
    lastName: "Mills",
    role: "provider",
    title: "Medical Director, MD",
  },
  {
    staffId: "staff_003",
    email: "pharmacy@myogenixpharma.com",
    firstName: "Pharmacy",
    lastName: "Team",
    role: "pharmacy",
    title: "Compounding Pharmacist",
  },
];

// ─── Patients ─────────────────────────────────────────────────────────────────

export const STUB_PATIENTS: AdminPatient[] = [
  {
    patientId: "usr_dev_001",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@example.com",
    dob: "1986-07-14",
    state: "FL",
    createdAt: "2025-12-01T00:00:00Z",
  },
  {
    patientId: "usr_dev_002",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    dob: "1979-03-22",
    state: "TX",
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    patientId: "usr_dev_003",
    firstName: "David",
    lastName: "Chen",
    email: "david.chen@example.com",
    dob: "1991-11-05",
    state: "CA",
    createdAt: "2026-04-01T00:00:00Z",
  },
];

// ─── Orders ───────────────────────────────────────────────────────────────────

export const STUB_ALL_ORDERS: AdminOrder[] = [
  // Alex Johnson — all portal orders (index 0 = wolverine, 1 = 2604A, etc.)
  { ...STUB_ORDERS[0], patientId: "usr_dev_001" }, // ORD-2604P wolverine approved
  { ...STUB_ORDERS[1], patientId: "usr_dev_001" }, // ORD-2604A pending_intake
  { ...STUB_ORDERS[2], patientId: "usr_dev_001" }, // ORD-2603B pending_review
  { ...STUB_ORDERS[3], patientId: "usr_dev_001" }, // ORD-2602C shipped
  { ...STUB_ORDERS[4], patientId: "usr_dev_001" }, // ORD-2512D delivered
  // Maria Garcia
  {
    orderId: "ORD-2605E",
    medicine: "tirzepatide",
    purchaseType: "subscription",
    monthCount: 3,
    selections: [
      { month: 1, mg: 2.5 },
      { month: 2, mg: 5 },
      { month: 3, mg: 7.5 },
    ],
    status: "pending_review",
    total: 567,
    createdAt: "2026-04-08T11:20:00Z",
    updatedAt: "2026-04-08T15:45:00Z",
    intakeCompleted: true,
    patientId: "usr_dev_002",
  },
  // David Chen
  {
    orderId: "ORD-2606F",
    medicine: "tirzepatide",
    purchaseType: "one-time",
    monthCount: 1,
    selections: [{ month: 1, mg: 2.5 }],
    status: "pending_intake",
    total: 217,
    createdAt: "2026-04-12T08:30:00Z",
    updatedAt: "2026-04-12T08:30:00Z",
    intakeCompleted: false,
    patientId: "usr_dev_003",
  },
];

// ─── Intake submissions ───────────────────────────────────────────────────────

const ALEX_INTAKE_2603B: IntakeData = {
  legalFirstName: "Alex",
  legalLastName: "Johnson",
  dob: "1986-07-14",
  sex: "male",
  state: "FL",
  weightLbs: "247",
  heightFt: "5",
  heightIn: "11",
  goalWeightLbs: "195",
  primaryGoals: ["weight_loss", "metabolic_health"],
  conditions: ["type2_diabetes", "hypertension", "high_cholesterol"],
  currentMedications:
    "Metformin 500mg twice daily\nLisinopril 10mg once daily\nAtorvastatin 20mg once daily",
  allergies: "Sulfonamides — rash",
  supplements: "Vitamin D 2000 IU daily, Magnesium glycinate 200mg",
  priorGlp1: "yes",
  priorGlp1Which: "semaglutide (Ozempic, brand)",
  priorGlp1LastDose: "2.4 mg/week",
  priorGlp1StopReason: "Cost — switching to compounded",
  priorGlp1SideEffects:
    "Mild nausea first 2 weeks at each dose increase. Resolved. No vomiting.",
  diet: "mediterranean",
  exerciseFreq: "3-4x",
  alcoholUse: "occasional",
  tobaccoUse: "never",
  recentSurgery: "None",
  consentClinicalReview: true,
  consentNotReplacement: true,
  consentProviderAdjust: true,
  consentCancellation: true,
  additionalAnswers: {},
};

// Alex's earlier semaglutide orders used the same underlying patient data
const ALEX_INTAKE_2602C: IntakeData = {
  ...ALEX_INTAKE_2603B,
  weightLbs: "258",
  goalWeightLbs: "200",
  conditions: ["type2_diabetes", "hypertension"],
  currentMedications: "Metformin 500mg twice daily\nLisinopril 10mg once daily",
  priorGlp1: "no",
  priorGlp1Which: "",
  priorGlp1LastDose: "",
  priorGlp1StopReason: "",
  priorGlp1SideEffects: "",
};

const ALEX_INTAKE_2512D: IntakeData = {
  ...ALEX_INTAKE_2602C,
  weightLbs: "271",
  goalWeightLbs: "210",
  conditions: ["type2_diabetes"],
  currentMedications: "Metformin 500mg twice daily",
};

const MARIA_INTAKE_2605E: IntakeData = {
  legalFirstName: "Maria",
  legalLastName: "Garcia",
  dob: "1979-03-22",
  sex: "female",
  state: "TX",
  weightLbs: "198",
  heightFt: "5",
  heightIn: "4",
  goalWeightLbs: "155",
  primaryGoals: ["weight_loss"],
  conditions: ["prediabetes", "pcos", "hypertension"],
  currentMedications: "Metformin 1000mg once daily\nOrtho-Cyclen (oral contraceptive)",
  allergies: "None known",
  supplements: "Inositol 2g daily, Folate 400 mcg",
  priorGlp1: "no",
  priorGlp1Which: "",
  priorGlp1LastDose: "",
  priorGlp1StopReason: "",
  priorGlp1SideEffects: "",
  diet: "standard",
  exerciseFreq: "1-2x",
  alcoholUse: "none",
  tobaccoUse: "never",
  recentSurgery: "None",
  consentClinicalReview: true,
  consentNotReplacement: true,
  consentProviderAdjust: true,
  consentCancellation: true,
  additionalAnswers: {},
};

export const STUB_INTAKE_SUBMISSIONS: IntakeSubmission[] = [
  {
    submissionId: "sub_2603B",
    orderId: "ORD-2603B",
    patientId: "usr_dev_001",
    submittedAt: "2026-03-22T10:45:00Z",
    data: ALEX_INTAKE_2603B,
  },
  {
    submissionId: "sub_2602C",
    orderId: "ORD-2602C",
    patientId: "usr_dev_001",
    submittedAt: "2026-02-14T09:30:00Z",
    data: ALEX_INTAKE_2602C,
  },
  {
    submissionId: "sub_2512D",
    orderId: "ORD-2512D",
    patientId: "usr_dev_001",
    submittedAt: "2025-12-05T13:20:00Z",
    data: ALEX_INTAKE_2512D,
  },
  {
    submissionId: "sub_2605E",
    orderId: "ORD-2605E",
    patientId: "usr_dev_002",
    submittedAt: "2026-04-08T12:10:00Z",
    data: MARIA_INTAKE_2605E,
  },
];

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const STUB_PRESCRIPTIONS: Prescription[] = [
  {
    rxId: "rx_2512D_001",
    orderId: "ORD-2512D",
    patientId: "usr_dev_001",
    medicine: "semaglutide",
    doseSchedule: [{ month: 1, mg: 0.5 }],
    refillsAuthorized: 0,
    refillsUsed: 0,
    issuedAt: "2025-12-06T09:00:00Z",
    expiresAt: "2026-03-06T09:00:00Z",
    issuedBy: "staff_002",
    issuedByName: "Dr. Sarah Mills",
    status: "expired",
    notes: "Patient starting at base dose. Reassess in 1 month.",
  },
  {
    rxId: "rx_2602C_001",
    orderId: "ORD-2602C",
    patientId: "usr_dev_001",
    medicine: "semaglutide",
    doseSchedule: [{ month: 1, mg: 1.0 }],
    refillsAuthorized: 0,
    refillsUsed: 0,
    issuedAt: "2026-02-15T10:00:00Z",
    expiresAt: "2026-05-15T10:00:00Z",
    issuedBy: "staff_002",
    issuedByName: "Dr. Sarah Mills",
    status: "active",
    notes:
      "Returning patient. Tolerated 0.5mg well. Escalating to 1.0mg for this period.",
  },
];

// ─── Audit log ────────────────────────────────────────────────────────────────

export const STUB_AUDIT_LOG: AuditLogEntry[] = [
  // ORD-2512D (delivered)
  { logId: "log_001", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "order_created",    performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2025-12-05T13:00:00Z" },
  { logId: "log_002", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "intake_submitted", performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2025-12-05T13:20:00Z" },
  { logId: "log_003", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "order_approved",   performedBy: "staff_002",  performedByName: "Dr. Sarah Mills", timestamp: "2025-12-06T09:00:00Z", note: "BMI 38.5, T2DM confirmed. Appropriate candidate. Starting semaglutide 0.5mg." },
  { logId: "log_004", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "rx_written",       performedBy: "staff_002",  performedByName: "Dr. Sarah Mills", timestamp: "2025-12-06T09:01:00Z" },
  { logId: "log_005", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "marked_shipped",   performedBy: "staff_003",  performedByName: "Pharmacy Team",  timestamp: "2025-12-08T14:00:00Z", note: "Tracking: 1ZA9999W0123456785" },
  { logId: "log_006", orderId: "ORD-2512D", patientId: "usr_dev_001", action: "marked_delivered", performedBy: "system",     performedByName: "System",         timestamp: "2025-12-12T09:15:00Z" },

  // ORD-2602C (shipped)
  { logId: "log_007", orderId: "ORD-2602C", patientId: "usr_dev_001", action: "order_created",    performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2026-02-14T09:00:00Z" },
  { logId: "log_008", orderId: "ORD-2602C", patientId: "usr_dev_001", action: "intake_submitted", performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2026-02-14T09:30:00Z" },
  { logId: "log_009", orderId: "ORD-2602C", patientId: "usr_dev_001", action: "order_approved",   performedBy: "staff_002",  performedByName: "Dr. Sarah Mills", timestamp: "2026-02-15T10:00:00Z", note: "Returning patient. Good tolerance. Escalating to semaglutide 1.0mg." },
  { logId: "log_010", orderId: "ORD-2602C", patientId: "usr_dev_001", action: "rx_written",       performedBy: "staff_002",  performedByName: "Dr. Sarah Mills", timestamp: "2026-02-15T10:01:00Z" },
  { logId: "log_011", orderId: "ORD-2602C", patientId: "usr_dev_001", action: "marked_shipped",   performedBy: "staff_003",  performedByName: "Pharmacy Team",  timestamp: "2026-02-19T11:30:00Z", note: "Tracking: 1ZA9999W0123456784" },

  // ORD-2603B (pending_review)
  { logId: "log_012", orderId: "ORD-2603B", patientId: "usr_dev_001", action: "order_created",    performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2026-03-22T10:15:00Z" },
  { logId: "log_013", orderId: "ORD-2603B", patientId: "usr_dev_001", action: "intake_submitted", performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2026-03-22T10:45:00Z" },
  { logId: "log_014", orderId: "ORD-2603B", patientId: "usr_dev_001", action: "provider_note_added", performedBy: "staff_002", performedByName: "Dr. Sarah Mills", timestamp: "2026-03-22T16:45:00Z", note: "Reviewing bloodwork history. Will follow up within 24 hours." },

  // ORD-2604A (pending_intake)
  { logId: "log_015", orderId: "ORD-2604A", patientId: "usr_dev_001", action: "order_created",    performedBy: "patient",    performedByName: "Alex Johnson",   timestamp: "2026-04-10T14:30:00Z" },

  // ORD-2605E (Maria, pending_review)
  { logId: "log_016", orderId: "ORD-2605E", patientId: "usr_dev_002", action: "order_created",    performedBy: "patient",    performedByName: "Maria Garcia",   timestamp: "2026-04-08T11:20:00Z" },
  { logId: "log_017", orderId: "ORD-2605E", patientId: "usr_dev_002", action: "intake_submitted", performedBy: "patient",    performedByName: "Maria Garcia",   timestamp: "2026-04-08T12:10:00Z" },

  // ORD-2606F (David, pending_intake)
  { logId: "log_018", orderId: "ORD-2606F", patientId: "usr_dev_003", action: "order_created",    performedBy: "patient",    performedByName: "David Chen",     timestamp: "2026-04-12T08:30:00Z" },
];

// ─── Helper queries ───────────────────────────────────────────────────────────

export function getPatientById(patientId: string): AdminPatient | undefined {
  return STUB_PATIENTS.find((p) => p.patientId === patientId);
}

export function getOrdersByPatient(patientId: string): AdminOrder[] {
  return STUB_ALL_ORDERS.filter((o) => o.patientId === patientId);
}

export function getAdminOrderById(orderId: string): AdminOrder | undefined {
  return STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
}

export function getIntakeByOrder(orderId: string): IntakeSubmission | undefined {
  return STUB_INTAKE_SUBMISSIONS.find((s) => s.orderId === orderId);
}

export function getPrescriptionByOrder(orderId: string): Prescription | undefined {
  return STUB_PRESCRIPTIONS.find((rx) => rx.orderId === orderId);
}

export function getAuditLogByOrder(orderId: string): AuditLogEntry[] {
  return STUB_AUDIT_LOG.filter((e) => e.orderId === orderId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getIntakesByPatient(patientId: string): IntakeSubmission[] {
  return STUB_INTAKE_SUBMISSIONS.filter((s) => s.patientId === patientId);
}

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return STUB_PRESCRIPTIONS.filter((rx) => rx.patientId === patientId);
}

export function getPendingReviewOrders(): AdminOrder[] {
  return STUB_ALL_ORDERS.filter((o) => o.status === "pending_review");
}

export function getPendingIntakeOrders(): AdminOrder[] {
  return STUB_ALL_ORDERS.filter((o) => o.status === "pending_intake");
}
