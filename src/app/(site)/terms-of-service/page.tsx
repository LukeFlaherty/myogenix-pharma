import type { Metadata } from "next";
import {
  LegalSection,
  SupplementalHero,
} from "@/components/supplemental/SupplementalPage";
import { PdpKicker, PdpWord } from "@/components/pdp/PdpDesignSystem";

export const metadata: Metadata = {
  title: "Terms of Service - MyoGenix Pharma",
  description:
    "Review the MyoGenix Pharma terms of service for website use, telehealth workflows, orders, and disclaimers.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-black text-white">
      <SupplementalHero
        eyebrow="Legal"
        title="Terms of"
        accent="service"
        body="The terms that apply when using the MyoGenix Pharma website and related services."
        image="/assets/grunge-redesign/rx.svg"
      />
      <section className="relative overflow-hidden border-t border-red-700/70 bg-black py-10 text-white sm:py-12">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PdpKicker>Last updated August 6, 2026</PdpKicker>
          <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
            <PdpWord>Website terms.</PdpWord>
            <PdpWord tone="red">Care disclaimers.</PdpWord>
          </h2>
          <div className="mt-7 grid gap-4">
            <LegalSection title="Acceptance of terms">
              <p>
                By accessing or using the MyoGenix Pharma website, you agree to these Terms of Service. If you do not agree, do not use the website or submit information through it.
              </p>
            </LegalSection>
            <LegalSection title="No emergency care">
              <p>
                MyoGenix Pharma does not provide emergency medical services through this website. If you are experiencing a medical emergency, call 911 or seek emergency care immediately.
              </p>
            </LegalSection>
            <LegalSection title="Informational content">
              <p>
                Website content is for informational purposes only and is not medical advice, diagnosis, or treatment. Care decisions require review by an appropriately licensed provider.
              </p>
            </LegalSection>
            <LegalSection title="Telehealth and eligibility">
              <p>
                Submitting an intake, creating an account, or placing an order does not guarantee eligibility, prescription approval, or fulfillment. A licensed provider may determine that a requested treatment is not appropriate.
              </p>
            </LegalSection>
            <LegalSection title="Orders and payments">
              <p>
                Product availability, pricing, subscriptions, shipping timelines, and treatment options may change. Orders may be delayed, denied, modified, or canceled based on provider review, payment status, compliance requirements, or operational needs.
              </p>
            </LegalSection>
            <LegalSection title="Compounded medications">
              <p>
                Certain medications may be compounded. Compounded medications are not FDA-approved and may be prescribed only when a provider determines they are appropriate for an individual patient.
              </p>
            </LegalSection>
            <LegalSection title="User responsibilities">
              <p>
                You agree to provide accurate, current, and complete information, keep account credentials secure, comply with applicable laws, and use the website only for lawful purposes.
              </p>
            </LegalSection>
            <LegalSection title="Contact">
              <p>
                For questions about these terms, contact support@myogenixpharma.com.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </div>
  );
}
