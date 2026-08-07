import type { Metadata } from "next";
import { CategoryLanding } from "@/components/category/CategoryLanding";
import { GLP1_MEDICINES } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Weight Management — MyoGenix Pharma",
  description:
    "Compounded semaglutide, tirzepatide, and retatrutide programs, provider-reviewed and configured for your escalation protocol.",
};

export default function WeightManagementPage() {
  return (
    <CategoryLanding
      eyebrow="Physician-guided care"
      title="Weight Loss"
      titleAccent="Weight"
      subtitle="Physician-guided care, built around your goals."
      body="Online intake, provider review, personalized treatment options, and concierge support."
      medicines={GLP1_MEDICINES}
      hrefBase="/weight-management"
      optionLabel="Weight loss"
      priceUnit="mo"
      heroCtaHref="/weight-management/tirzepatide"
      heroImage="/assets/grunge-redesign/weight-loss-category-vials.webp"
      heroImageAlt="Weight loss treatment vials"
    />
  );
}
