import type { Metadata } from "next";
import { CategoryLanding } from "@/components/category/CategoryLanding";
import { PEPTIDE_MEDICINES } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Peptides — MyoGenix Pharma",
  description:
    "Provider-reviewed compounded peptide protocols for recovery, performance, and longevity.",
};

export default function PeptidesPage() {
  return (
    <CategoryLanding
      eyebrow="Compounded peptides"
      title="Peptides"
      titleAccent="Peptides"
      subtitle="Physician-guided support for recovery, performance, and health goals."
      body="Online intake, provider review, personalized options, and concierge support."
      medicines={PEPTIDE_MEDICINES}
      hrefBase="/peptides"
      optionLabel="Peptide"
      priceUnit="vial"
      heroCtaHref="/peptides/bpc157"
      heroImage="/assets/grunge-redesign/peptides-category-vials.webp"
      heroImageAlt="Peptide treatment vials"
    />
  );
}
