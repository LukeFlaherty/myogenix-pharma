/**
 * Discount Code System — Stub Implementation
 * ============================================
 * All functions return hardcoded stub values. Replace with real backend calls
 * when a database and server actions are in place.
 *
 * ─── HOW TO UPGRADE ──────────────────────────────────────────────────────────
 *
 * 1. DATABASE SCHEMA
 *    Add two tables:
 *
 *    discount_codes {
 *      id          uuid primary key
 *      code        text unique not null          -- e.g. "WELCOME10" or "MYOG-A3F2"
 *      type        enum('percentage','fixed')    -- how the discount is calculated
 *      value       numeric not null              -- 0.10 for 10% | 10.00 for $10 flat
 *      description text not null                 -- shown to the user, e.g. "10% off first order"
 *      max_uses    int default null              -- null = unlimited
 *      used_count  int default 0
 *      expires_at  timestamptz default null
 *      active      boolean default true
 *    }
 *
 *    code_redemptions {
 *      id            uuid primary key
 *      code_id       uuid references discount_codes(id)
 *      order_id      text                        -- foreign key once orders table exists
 *      email         text not null
 *      redeemed_at   timestamptz default now()
 *    }
 *
 * 2. REPLACE generateLeadCode()
 *    - Accept { email, phone, source, affiliateSlug }
 *    - Create a unique code in discount_codes (or look up the shared welcome code)
 *    - Create a leads row: { email, phone, source, affiliateSlug, codeId, capturedAt }
 *    - Optionally send SMS/email confirmation via Twilio / SendGrid
 *    - Return the real DiscountCode record
 *
 * 3. REPLACE validateDiscountCode()
 *    - Query discount_codes WHERE code = $1 AND active = true
 *    - Check expires_at > now()
 *    - Check used_count < max_uses (or max_uses IS NULL)
 *    - Optionally check code_redemptions to prevent double-use per email
 *    - Return DiscountCode | null
 *
 * 4. WIRE INTO CHECKOUT
 *    - In calcOrderTotal() (order-params.ts), accept an optional promoCode param
 *    - If present and valid, subtract applyDiscount() from the total
 *    - Record a code_redemptions row on order creation (server action)
 *    - Increment discount_codes.used_count atomically
 *
 * 5. ADMIN UI
 *    - Build a /admin/discount-codes page to create, deactivate, and report codes
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DiscountType = "percentage" | "fixed";

/** A discount code record as surfaced to the frontend. */
export interface DiscountCode {
  /** The coupon string the user applies at checkout, e.g. "WELCOME10". */
  code: string;
  /** "percentage" = fractional (0.10 = 10%); "fixed" = dollar amount off. */
  type: DiscountType;
  /**
   * For percentage: 0–1 (e.g. 0.10 for 10%).
   * For fixed: dollar amount (e.g. 10 for $10 off).
   */
  value: number;
  /** Human-readable summary shown to the user, e.g. "10% off your first order". */
  description: string;
  /** Optional expiry. Undefined means no expiry. */
  expiresAt?: Date;
}

/**
 * Parameters collected from the lead-capture popup.
 * Extend this interface when you add more fields (e.g. name, birthday, zip).
 */
export interface LeadCaptureParams {
  email: string;
  phone: string;
  /** Where the lead was captured — matches PopupConfig.source. */
  source: string;
  /**
   * Affiliate slug from the HTTP-only cookie, if the user arrived via a
   * referral link. Passed through so the lead record can be attributed.
   * Null when no affiliate is present.
   */
  affiliateSlug: string | null;
}

/**
 * Generates (or looks up) a discount code for a captured lead.
 *
 * STUB — currently returns the same hardcoded "WELCOME10" code for every lead.
 * See the upgrade guide at the top of this file for production implementation.
 *
 * @param params - Lead contact details and attribution data.
 * @returns The discount code to display to the user.
 */
export async function generateLeadCode(params: LeadCaptureParams): Promise<DiscountCode> {
  // ── STUB ──────────────────────────────────────────────────────────────────
  // In production, replace this with a server action / API call that:
  //   1. Upserts a `leads` row (email, phone, source, affiliateSlug, capturedAt)
  //   2. Creates or retrieves a unique discount_codes row for this email
  //   3. Sends a confirmation SMS (Twilio) or email (SendGrid)
  //   4. Returns the real DiscountCode
  // ─────────────────────────────────────────────────────────────────────────
  console.log("[STUB] generateLeadCode — would save lead to DB:", params);

  return {
    code: "WELCOME10",
    type: "percentage",
    value: 0.1,
    description: "10% off your first order",
  };
}

/**
 * Validates a discount code string entered at checkout.
 *
 * STUB — currently accepts only "WELCOME10" (case-insensitive).
 * See the upgrade guide at the top of this file for production implementation.
 *
 * @param code - The raw string the user typed or copied.
 * @returns The matching DiscountCode, or null if invalid / expired.
 */
export async function validateDiscountCode(code: string): Promise<DiscountCode | null> {
  // ── STUB ──────────────────────────────────────────────────────────────────
  // In production, replace with a DB lookup:
  //   SELECT * FROM discount_codes
  //   WHERE code = $1 AND active = true AND (expires_at IS NULL OR expires_at > now())
  //       AND (max_uses IS NULL OR used_count < max_uses)
  // ─────────────────────────────────────────────────────────────────────────
  if (code.trim().toUpperCase() === "WELCOME10") {
    return {
      code: "WELCOME10",
      type: "percentage",
      value: 0.1,
      description: "10% off your first order",
    };
  }
  return null;
}

/**
 * Calculates the dollar discount amount for a given order subtotal and code.
 * Use this when displaying savings to the user and when computing the final charge.
 *
 * @param subtotal - Pre-discount order total in dollars.
 * @param code     - A validated DiscountCode (from validateDiscountCode).
 * @returns The dollar amount to subtract from the subtotal (always ≥ 0).
 */
export function applyDiscount(subtotal: number, code: DiscountCode): number {
  if (code.type === "percentage") {
    return subtotal * code.value;
  }
  // Fixed: can't discount more than the full subtotal
  return Math.min(code.value, subtotal);
}

/**
 * Formats a discount value for display, e.g. "10%" or "$10".
 */
export function formatDiscountValue(code: DiscountCode): string {
  if (code.type === "percentage") {
    return `${Math.round(code.value * 100)}%`;
  }
  return `$${code.value.toFixed(2)}`;
}
