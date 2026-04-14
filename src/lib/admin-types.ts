import type { Medicine, MonthDoseSelection } from "./pdp-types";
import type { IntakeData } from "./checkout-types";
import type { PortalOrder } from "./portal-types";

// ─── Staff / Session ──────────────────────────────────────────────────────────

export type AdminRole = "provider" | "pharmacy" | "admin";

export const ADMIN_ROLE_CONFIG: Record<AdminRole, { label: string; color: string }> = {
  provider: { label: "Provider",        color: "bg-blue-50  text-blue-700  border-blue-200"  },
  pharmacy: { label: "Pharmacy",        color: "bg-green-50 text-green-700 border-green-200" },
  admin:    { label: "Admin",           color: "bg-amber-50 text-amber-700 border-amber-200" },
};

export interface AdminSession {
  staffId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  /** True when this is the dev-bypass mock session */
  isDevStub: boolean;
}

export interface StaffMember {
  staffId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  title?: string; // e.g. "Medical Director", "Compounding Pharmacist"
}

// ─── Patient (admin view) ─────────────────────────────────────────────────────

export interface AdminPatient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;     // ISO date "YYYY-MM-DD"
  state: string;   // 2-letter abbrev
  createdAt: string;
}

// ─── Intake submission ────────────────────────────────────────────────────────

/**
 * The persisted result of a patient completing their intake questionnaire.
 * In production: stored in `intake_submissions` table.
 * For now: stub objects in admin-stub-data.ts.
 */
export interface IntakeSubmission {
  submissionId: string;
  orderId: string;
  patientId: string;
  submittedAt: string;
  data: IntakeData;
}

// ─── Prescription ─────────────────────────────────────────────────────────────

/**
 * Written by a licensed provider after approving an order.
 * This is the clinical authorization that allows the pharmacy to compound & ship.
 *
 * INTEGRATION NOTE: In production this would be transmitted to the pharmacy
 * partner via API (e.g. DrFirst, RxNT) or printed/faxed. For now we store
 * it internally and a pharmacy team member reads it in the admin portal.
 */
export interface Prescription {
  rxId: string;
  orderId: string;
  patientId: string;
  medicine: Medicine;
  doseSchedule: MonthDoseSelection[];
  /** Number of refill shipments authorized beyond the initial fill */
  refillsAuthorized: number;
  refillsUsed: number;
  issuedAt: string;
  expiresAt: string;
  issuedBy: string;       // staffId
  issuedByName: string;
  status: "active" | "expired" | "cancelled";
  notes?: string;
}

// ─── Audit log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | "order_created"
  | "intake_submitted"
  | "order_approved"
  | "order_denied"
  | "bloodwork_requested"
  | "provider_note_added"
  | "rx_written"
  | "marked_shipped"
  | "marked_delivered";

export interface AuditLogEntry {
  logId: string;
  orderId: string;
  patientId: string;
  action: AuditAction;
  /** staffId, "system", or "patient" */
  performedBy: string;
  performedByName: string;
  timestamp: string;
  note?: string;
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  order_created:       "Order placed",
  intake_submitted:    "Intake submitted",
  order_approved:      "Order approved",
  order_denied:        "Order denied",
  bloodwork_requested: "Bloodwork requested",
  provider_note_added: "Provider note added",
  rx_written:          "Prescription written",
  marked_shipped:      "Marked as shipped",
  marked_delivered:    "Marked as delivered",
};

// ─── Admin order view ─────────────────────────────────────────────────────────

/**
 * PortalOrder + patientId link. In production this is a DB join.
 * The admin sees all patients' orders; the patient portal only sees its own.
 */
export interface AdminOrder extends PortalOrder {
  patientId: string;
}
