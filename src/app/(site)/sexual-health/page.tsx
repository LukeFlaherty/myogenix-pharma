import type { Metadata } from "next";
import { CategoryLanding } from "@/components/category/CategoryLanding";
import { SEXUAL_HEALTH_MEDICINES } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Sexual Health — MyoGenix Pharma",
  description:
    "Provider-reviewed ED therapy with sildenafil and tadalafil, shipped discreetly.",
};

export default function SexualHealthPage() {
  return (
    <CategoryLanding
      eyebrow="Discreet provider review"
      title="Sexual Health"
      titleAccent="Sexual"
      subtitle="Provider-guided ED support, shipped discreetly to your door."
      body="Online intake, licensed provider review, personalized options, and private shipping."
      medicines={SEXUAL_HEALTH_MEDICINES}
      hrefBase="/sexual-health"
      optionLabel="Treatment"
      priceUnit="dose"
      heroCtaHref="/sexual-health/tadalafil"
      heroImage="/assets/grunge-redesign/sexual-health-products.webp"
      heroImageAlt="Sildenafil and tadalafil bottles"
    />
  );
}
