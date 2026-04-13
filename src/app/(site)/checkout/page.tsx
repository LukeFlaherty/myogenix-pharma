import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { decodeOrder, defaultOrder } from "@/lib/order-params";
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

  return (
    <div className="min-h-screen bg-white">
      <CheckoutShell order={order} />
    </div>
  );
}
