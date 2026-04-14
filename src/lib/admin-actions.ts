"use server";

/**
 * Admin portal server actions.
 *
 * CURRENT STATE: All actions mutate in-memory stub arrays and revalidate
 * the relevant paths. Mutations persist for the lifetime of the dev server
 * process (not across restarts). This mirrors the interface that real DB
 * mutations will have — only the implementation changes.
 *
 * TO WIRE REAL DB:
 *   Replace each stub mutation block with the corresponding Prisma call, e.g.:
 *   await prisma.order.update({ where: { orderId }, data: { status: "approved" } })
 *   await prisma.auditLog.create({ data: { ... } })
 *
 * NOTIFICATION STUB:
 *   Each action has a TODO comment for the email that should fire.
 *   Use Resend (or SendGrid) to send transactional emails to the patient.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  STUB_ALL_ORDERS,
  STUB_AUDIT_LOG,
  STUB_PRESCRIPTIONS,
} from "./admin-stub-data";
import { getAdminSession } from "./admin-auth";
import type { AuditLogEntry, Prescription } from "./admin-types";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function adminSignOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("dev_admin_bypass");
  // TODO: cookieStore.delete("next-auth.admin-session-token");
  redirect("/admin/login");
}

export async function devAdminBypassAction(formData: FormData) {
  // TODO: remove dev bypass before real auth launch
  const role = formData.get("role") as string;
  if (!["admin", "provider", "pharmacy"].includes(role)) {
    throw new Error("Invalid role.");
  }
  const cookieStore = await cookies();
  cookieStore.set("dev_admin_bypass", role, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin/dashboard");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function logAudit(entry: Omit<AuditLogEntry, "logId">): void {
  STUB_AUDIT_LOG.push({
    logId: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...entry,
  });
  // TODO: await prisma.auditLog.create({ data: entry })
}

function revalidateOrder(orderId: string) {
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

// ─── Order actions ────────────────────────────────────────────────────────────

export async function approveOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const note = (formData.get("note") as string | null)?.trim() ?? "";

  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending_review") throw new Error("Order is not pending review");

  // Mutate order status
  order.status = "approved";
  if (note) order.providerNote = note;

  // Write prescription
  const rx: Prescription = {
    rxId: `rx_${orderId.toLowerCase()}_${Date.now()}`,
    orderId,
    patientId: order.patientId,
    medicine: order.medicine,
    doseSchedule: order.selections,
    refillsAuthorized: order.monthCount - 1,
    refillsUsed: 0,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + order.monthCount * 30 * 24 * 60 * 60 * 1000).toISOString(),
    issuedBy: session.staffId,
    issuedByName: `${session.firstName} ${session.lastName}`,
    status: "active",
    notes: note || undefined,
  };
  STUB_PRESCRIPTIONS.push(rx);
  // TODO: await prisma.prescription.create({ data: rx })

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "order_approved",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
    note: note || undefined,
  });

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "rx_written",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
  });

  // TODO: Send "Your order has been approved" email to patient via Resend

  revalidateOrder(orderId);
}

export async function denyOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const note = (formData.get("note") as string | null)?.trim() ?? "";

  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");

  order.status = "denied";
  order.providerNote = note || "Your order did not meet approval criteria at this time.";

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "order_denied",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
    note: order.providerNote,
  });

  // TODO: Send "Order update" email to patient with denial reason

  revalidateOrder(orderId);
}

export async function requestBloodworkAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const note = (formData.get("note") as string | null)?.trim() ?? "";

  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");

  order.requiresBloodwork = true;
  if (note) order.providerNote = note;

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "bloodwork_requested",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
    note: note || "Provider has requested recent bloodwork before approval.",
  });

  // TODO: Send "Action required — bloodwork needed" email to patient

  revalidateOrder(orderId);
}

export async function addProviderNoteAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const note = (formData.get("note") as string | null)?.trim() ?? "";
  if (!note) return;

  const session = await getAdminSession();
  if (!session || session.role === "pharmacy") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");

  order.providerNote = note;

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "provider_note_added",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
    note,
  });

  revalidateOrder(orderId);
}

export async function markShippedAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const trackingNumber = (formData.get("trackingNumber") as string | null)?.trim() ?? "";
  const estimatedDelivery = (formData.get("estimatedDelivery") as string | null)?.trim() ?? "";

  const session = await getAdminSession();
  if (!session || session.role === "provider") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "approved") throw new Error("Order is not approved");

  order.status = "shipped";
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "marked_shipped",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
    note: trackingNumber ? `Tracking: ${trackingNumber}` : undefined,
  });

  // TODO: Send "Your order has shipped" email to patient with tracking number

  revalidateOrder(orderId);
}

export async function markDeliveredAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;

  const session = await getAdminSession();
  if (!session || session.role === "provider") throw new Error("Unauthorized");

  const order = STUB_ALL_ORDERS.find((o) => o.orderId === orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "shipped") throw new Error("Order is not shipped");

  order.status = "delivered";

  logAudit({
    orderId,
    patientId: order.patientId,
    action: "marked_delivered",
    performedBy: session.staffId,
    performedByName: `${session.firstName} ${session.lastName}`,
    timestamp: new Date().toISOString(),
  });

  revalidateOrder(orderId);
}
