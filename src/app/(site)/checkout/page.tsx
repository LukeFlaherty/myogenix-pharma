/**
 * Checkout page
 * =============
 * Accepts orders via two URL param conventions:
 *
 * ?order=<encoded>        — single OrderConfig (direct from PDP "Buy now" button
 *                           or from the cart drawer when only one item is in cart)
 *
 * ?batch=<encoded>        — OrderConfig[] (from the cart page when 2+ medicines
 *                           are present; encoded by encodeBatch() in order-params)
 *
 * Both are normalised to OrderConfig[] before being passed to CheckoutShell,
 * so the shell never has to care about how the user arrived.
 *
 * TO ADD a third entry point (e.g. a "reorder" button in the portal):
 *   Encode the order(s) as a batch and link to /checkout?batch=<encoded>.
 *   No changes to this file or CheckoutShell needed.
 */

import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { decodeOrder, defaultOrder, decodeBatch } from "@/lib/order-params";
import { getAffiliateCode, affiliateDisplayName } from "@/lib/affiliate";
import type { OrderConfig } from "@/lib/checkout-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — MyoGenix Pharma",
};

interface Props {
  searchParams: Promise<{ order?: string; batch?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;

  // Resolve to an OrderConfig array regardless of which param was used
  let orders: OrderConfig[];
  if (params.batch) {
    // Multi-medicine batch from cart page
    orders = decodeBatch(params.batch) ?? [defaultOrder()];
  } else if (params.order) {
    // Single medicine from PDP or cart drawer
    orders = [decodeOrder(params.order) ?? defaultOrder()];
  } else {
    orders = [defaultOrder()];
  }

  const affiliateSlug = await getAffiliateCode();
  const affiliateName = affiliateSlug ? affiliateDisplayName(affiliateSlug) : null;

  return (
    <div className="min-h-screen bg-white">
      <CheckoutShell orders={orders} affiliateName={affiliateName} />
    </div>
  );
}
