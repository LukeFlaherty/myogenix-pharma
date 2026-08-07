import type { Metadata } from "next";
import { CategoryLanding } from "@/components/category/CategoryLanding";
import { MENS_HEALTH_MEDICINES } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Mens Health — MyoGenix Pharma",
  description:
    "Provider-managed testosterone replacement therapy, compounded to order and shipped discreetly.",
};

export default function MensHealthPage() {
  return (
    <CategoryLanding
      eyebrow="Hormone optimization"
      title="Men's Health"
      titleAccent="Men's"
      subtitle="Provider-managed TRT, built around your labs and goals."
      body="Online intake, provider review, personalized treatment options, and concierge support."
      medicines={MENS_HEALTH_MEDICINES}
      hrefBase="/mens-health"
      optionLabel="Men's health"
      priceUnit="vial"
      heroCtaHref="/mens-health/testosterone"
      heroImage="/assets/grunge-redesign/mgrx-hero-team.webp"
      heroImageAlt="MyoGenix Pharma care team with testosterone treatment"
    />
  );
}
