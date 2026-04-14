import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { decodeOrder, defaultOrder } from "@/lib/order-params";
import { getAffiliateCode, affiliateDisplayName } from "@/lib/affiliate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — MyoGenix Pharma",
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = params.order ? (decodeOrder(params.order) ?? defaultOrder()) : defaultOrder();

  const affiliateSlug = await getAffiliateCode();
  const affiliateName = affiliateSlug ? affiliateDisplayName(affiliateSlug) : null;

  return (
    <div className="min-h-screen bg-white">
      <CheckoutShell order={order} affiliateName={affiliateName} />
    </div>
  );
}
