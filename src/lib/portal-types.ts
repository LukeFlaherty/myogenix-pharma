import type { Medicine, PurchaseType, MonthDoseSelection } from "./pdp-types";

// ─── Order status lifecycle ───────────────────────────────────────────────────

export type OrderStatus =
  | "pending_intake"   // patient hasn't completed intake yet
  | "pending_review"   // intake done, waiting for provider approval
  | "approved"         // provider approved, payment captured
  | "shipped"          // medication dispatched
  | "delivered"        // confirmed delivered
  | "cancelled"        // cancelled before shipment
  | "denied";          // provider denied the order

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  pending_intake: { label: "Intake required",   color: "bg-amber-50  text-amber-700  border-amber-200" },
  pending_review: { label: "Under review",      color: "bg-blue-50   text-blue-700   border-blue-200"  },
  approved:       { label: "Approved",          color: "bg-green-50  text-green-700  border-green-200" },
  shipped:        { label: "Shipped",           color: "bg-indigo-50 text-indigo-700 border-indigo-200"},
  delivered:      { label: "Delivered",         color: "bg-green-50  text-green-700  border-green-200" },
  cancelled:      { label: "Cancelled",         color: "bg-zinc-100  text-zinc-500   border-zinc-200"  },
  denied:         { label: "Denied",            color: "bg-red-50    text-red-700    border-red-200"   },
};

// ─── Pending action ───────────────────────────────────────────────────────────

export type PendingActionType =
  | "complete_intake"
  | "bloodwork_required"
  | "provider_message"
  | "payment_failed";

export interface PendingAction {
  type: PendingActionType;
  orderId: string;
  label: string;
  description: string;
  href: string;
  priority: "urgent" | "normal";
}

// ─── Portal order ─────────────────────────────────────────────────────────────

/**
 * A PortalOrder embeds the OrderConfig fields so the portal can reconstruct
 * intake URLs and display pricing without a separate DB join.
 *
 * DATABASE NOTE: In production this would be fetched from the `orders` table,
 * joined with `patients` and `intake_submissions`.
 */
export interface PortalOrder {
  orderId: string;

  /**
   * Groups orders that were placed together in a single checkout session.
   * All orders in one cart checkout share the same orderGroupId.
   *
   * DB: This is the `order_batches.id` FK once the batches table exists.
   * Use this to visually group orders on the portal orders page, and to
   * determine whether a patient has OTHER orders from the same session that
   * may also need intake completion.
   *
   * Undefined for orders placed before the batch checkout feature.
   */
  orderGroupId?: string;

  // Order config (mirrors OrderConfig from checkout-types)
  medicine: Medicine;
  purchaseType: PurchaseType;
  monthCount: number;
  selections: MonthDoseSelection[];

  // Portal state
  status: OrderStatus;
  total: number;
  createdAt: string;    // ISO 8601
  updatedAt: string;
  intakeCompleted: boolean;

  // Optional fields populated as order progresses
  trackingNumber?: string;
  estimatedDelivery?: string;
  providerNote?: string;
  requiresBloodwork?: boolean;
}

// ─── Session ──────────────────────────────────────────────────────────────────

/**
 * Shape of the authenticated portal session.
 *
 * TODO: When integrating Auth.js, map the Auth.js Session type to this shape
 * inside getPortalSession() so the rest of the portal stays type-stable.
 */
export interface PortalSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  /** True when this is the dev-bypass mock session */
  isDevStub: boolean;
}
