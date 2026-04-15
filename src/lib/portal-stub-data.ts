/**
 * Dev stub data for the patient portal.
 *
 * DATABASE NOTE: Replace all references to STUB_ORDERS / DEV_MOCK_SESSION with
 * real DB queries once Prisma + Auth.js are wired up. The shape of PortalOrder
 * and PortalSession is intentionally stable so pages only need to swap the
 * data source, not their rendering logic.
 */

import { encodeOrder } from "./order-params";
import type { PortalOrder, PortalSession, PendingAction } from "./portal-types";
import type { OrderConfig } from "./checkout-types";

// ─── Mock session ─────────────────────────────────────────────────────────────

export const DEV_MOCK_SESSION: PortalSession = {
  userId: "usr_dev_001",
  email: "alex@example.com",
  firstName: "Alex",
  lastName: "Johnson",
  isDevStub: true,
};

// ─── Mock orders ──────────────────────────────────────────────────────────────

export const STUB_ORDERS: PortalOrder[] = [
  {
    orderId: "ORD-2604P",
    medicine: "wolverine",
    purchaseType: "one-time",
    monthCount: 2,
    selections: [
      { month: 1, mg: 5 },
      { month: 2, mg: 5 },
    ],
    status: "approved",
    total: 387,
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-04-06T09:00:00Z",
    intakeCompleted: true,
  },
  // ── MULTI-MEDICINE BATCH DEMO ─────────────────────────────────────────────
  // ORD-2604A and ORD-2604B were placed in a single checkout session
  // (orderGroupId: "BATCH-2604"). Both start as "pending_intake" so the
  // portal dashboard shows two "Action required" cards — one per medicine.
  // This is the core of the multi-medicine intake UX: the patient pays once
  // and then completes each intake separately from their portal.
  //
  // When DB is live: orderGroupId maps to the `order_batches.id` row.
  {
    orderId: "ORD-2604A",
    orderGroupId: "BATCH-2604",
    medicine: "tirzepatide",
    purchaseType: "subscription",
    monthCount: 3,
    selections: [
      { month: 1, mg: 2.5 },
      { month: 2, mg: 5 },
      { month: 3, mg: 7.5 },
    ],
    status: "pending_intake",
    total: 567,
    createdAt: "2026-04-10T14:30:00Z",
    updatedAt: "2026-04-10T14:30:00Z",
    intakeCompleted: false,
  },
  {
    orderId: "ORD-2604B",
    orderGroupId: "BATCH-2604",
    medicine: "wolverine",
    purchaseType: "one-time",
    monthCount: 1,
    selections: [{ month: 1, mg: 5 }],
    status: "pending_intake",
    total: 197,
    createdAt: "2026-04-10T14:30:00Z",
    updatedAt: "2026-04-10T14:30:00Z",
    intakeCompleted: false,
  },
  // ── END BATCH DEMO ────────────────────────────────────────────────────────
  {
    orderId: "ORD-2603B",
    medicine: "tirzepatide",
    purchaseType: "subscription",
    monthCount: 1,
    selections: [{ month: 1, mg: 5 }],
    status: "pending_review",
    total: 233,
    createdAt: "2026-03-22T10:15:00Z",
    updatedAt: "2026-03-22T16:45:00Z",
    intakeCompleted: true,
    providerNote: "Reviewing bloodwork history. Will follow up within 24 hours.",
  },
  {
    orderId: "ORD-2602C",
    medicine: "semaglutide",
    purchaseType: "subscription",
    monthCount: 1,
    selections: [{ month: 1, mg: 1.0 }],
    status: "shipped",
    total: 179,
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-02-19T11:30:00Z",
    intakeCompleted: true,
    trackingNumber: "1ZA9999W0123456784",
    estimatedDelivery: "2026-02-22",
  },
  {
    orderId: "ORD-2512D",
    medicine: "semaglutide",
    purchaseType: "one-time",
    monthCount: 1,
    selections: [{ month: 1, mg: 0.5 }],
    status: "delivered",
    total: 258,
    createdAt: "2025-12-05T13:00:00Z",
    updatedAt: "2025-12-12T09:15:00Z",
    intakeCompleted: true,
    trackingNumber: "1ZA9999W0123456785",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the OrderConfig portion of a PortalOrder (for encoding as URL param). */
export function portalOrderToConfig(order: PortalOrder): OrderConfig {
  return {
    medicine: order.medicine,
    purchaseType: order.purchaseType,
    monthCount: order.monthCount,
    selections: order.selections,
  };
}

/** Derive outstanding actions from a list of orders. */
export function getPortalActions(orders: PortalOrder[]): PendingAction[] {
  const actions: PendingAction[] = [];

  for (const order of orders) {
    if (order.status === "pending_intake" && !order.intakeCompleted) {
      const encoded = encodeOrder(portalOrderToConfig(order));
      // Capitalize the medicine name for display, e.g. "tirzepatide" → "Tirzepatide"
      const medicineName =
        order.medicine.charAt(0).toUpperCase() + order.medicine.slice(1);
      actions.push({
        type: "complete_intake",
        orderId: order.orderId,
        label: `Complete intake for ${medicineName}`,
        description: `Your ${medicineName} intake questionnaire (order ${order.orderId}) must be submitted before our provider team can review and ship your order.`,
        href: `/intake?order=${encoded}&orderId=${order.orderId}`,
        priority: "urgent",
      });
    }

    if (order.requiresBloodwork) {
      actions.push({
        type: "bloodwork_required",
        orderId: order.orderId,
        label: "Upload required bloodwork",
        description: `Your provider has requested recent lab results (HbA1c, CMP) for order ${order.orderId} before approval.`,
        href: "#",   // TODO: bloodwork upload page
        priority: "urgent",
      });
    }
  }

  return actions;
}

/** Status timeline steps and whether they are complete for a given order. */
export interface TimelineStep {
  label: string;
  complete: boolean;
  current: boolean;
}

const STATUS_ORDER: Array<PortalOrder["status"]> = [
  "pending_intake",
  "pending_review",
  "approved",
  "shipped",
  "delivered",
];

export function getOrderTimeline(order: PortalOrder): TimelineStep[] {
  const STEP_LABELS: Record<string, string> = {
    pending_intake: "Intake questionnaire",
    pending_review: "Provider review",
    approved: "Approved & charged",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  if (order.status === "cancelled") {
    return [{ label: "Order cancelled", complete: true, current: true }];
  }
  if (order.status === "denied") {
    return [
      { label: "Intake questionnaire", complete: true, current: false },
      { label: "Provider review",      complete: true, current: false },
      { label: "Order denied",         complete: true, current: true  },
    ];
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  return STATUS_ORDER.map((s, i) => ({
    label: STEP_LABELS[s],
    complete: i < currentIdx,
    current: i === currentIdx,
  }));
}
