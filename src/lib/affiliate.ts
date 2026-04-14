/**
 * Affiliate attribution helpers — server-only (uses next/headers).
 *
 * The affiliate store slug is captured from ?store= by middleware and stored
 * in an HTTP-only cookie. These helpers read that cookie in Server Components
 * and Server Actions so the attribution can be displayed and recorded.
 *
 * TO UPGRADE (real DB):
 *   1. Add an `affiliates` table: { id, slug, name, email, active, createdAt }
 *   2. Replace getAffiliateName() with a DB lookup: db.affiliate.findUnique({ where: { slug } })
 *   3. On order creation, record a `conversions` row: { affiliateSlug, orderId, amount, commission }
 *   4. Build a monthly payout export for accounting
 */

import { cookies } from "next/headers";

export const AFFILIATE_COOKIE = "affiliate_store";

/**
 * Returns the raw affiliate slug from the HTTP-only cookie, or null.
 * e.g. "jakesvitamin"
 */
export async function getAffiliateCode(): Promise<string | null> {
  const store = await cookies();
  const val = store.get(AFFILIATE_COOKIE)?.value;
  return val?.trim() || null;
}

/**
 * Converts a store slug to a display name.
 * Stub: just formats the slug. Replace with DB lookup once affiliates table exists.
 * e.g. "jakesvitamin" → "Jake's Vitamins"  (currently returns "Jakesvitamin")
 */
export function affiliateDisplayName(slug: string): string {
  // TODO: replace with db.affiliate.findUnique({ where: { slug } })?.name
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const COMMISSION_RATE = 0.10; // 10%
