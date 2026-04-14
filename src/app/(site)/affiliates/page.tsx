import type { Metadata } from "next";
import { AffiliatesContent } from "@/components/affiliates/AffiliatesContent";

export const metadata: Metadata = {
  title: "Affiliate Program — MyoGenix Pharma",
  description:
    "Partner with MyoGenix Pharma as a retail affiliate. Earn 10% commission on every conversion from your QR code. Monthly payouts, no hassle.",
};

export default function AffiliatesPage() {
  return <AffiliatesContent />;
}
