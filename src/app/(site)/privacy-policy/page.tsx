import type { Metadata } from "next";
import {
  LegalSection,
  SupplementalHero,
} from "@/components/supplemental/SupplementalPage";
import { PdpKicker, PdpWord } from "@/components/pdp/PdpDesignSystem";

export const metadata: Metadata = {
  title: "Privacy Policy - MyoGenix Pharma",
  description:
    "Read the MyoGenix Pharma privacy policy for information about data collection, use, sharing, and patient privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black text-white">
      <SupplementalHero
        eyebrow="Privacy"
        title="Privacy"
        accent="policy"
        body="How MyoGenix Pharma handles information collected through our site and care journey."
        image="/assets/grunge-redesign/laptop-check.svg"
      />
      <section className="relative overflow-hidden border-t border-red-700/70 bg-black py-10 text-white sm:py-12">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PdpKicker>Last updated August 6, 2026</PdpKicker>
          <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
            <PdpWord>Your data.</PdpWord>
            <PdpWord tone="red">Handled carefully.</PdpWord>
          </h2>
          <div className="mt-7 grid gap-4">
            <LegalSection title="Overview">
              <p>
                This Privacy Policy explains how MyoGenix Pharma collects, uses, discloses, and protects information when you visit our website, submit forms, create an account, complete an intake, or interact with our support team.
              </p>
            </LegalSection>
            <LegalSection title="Information we collect">
              <p>
                We may collect contact details, account information, order details, intake responses, payment-related information, device data, analytics data, and communications you send to us.
              </p>
              <p>
                When medical intake or provider review is involved, information may include health history, symptoms, goals, medication history, lab-related details, and other information needed to evaluate care options.
              </p>
            </LegalSection>
            <LegalSection title="How we use information">
              <p>
                We use information to operate the website, process requests, support patient accounts, coordinate provider review, communicate about orders, improve services, prevent fraud, comply with legal obligations, and respond to inquiries.
              </p>
            </LegalSection>
            <LegalSection title="Sharing information">
              <p>
                We may share information with service providers, payment processors, fulfillment partners, diagnostic partners, licensed providers, technology vendors, and other parties involved in operating the care journey.
              </p>
              <p>
                We may also disclose information when required by law, to protect rights and safety, or in connection with a business transaction.
              </p>
            </LegalSection>
            <LegalSection title="Cookies and analytics">
              <p>
                We may use cookies, pixels, and similar technologies to remember preferences, understand site usage, attribute affiliate referrals, improve performance, and support marketing or analytics.
              </p>
            </LegalSection>
            <LegalSection title="Your choices">
              <p>
                You may contact us to request access, correction, deletion, or other assistance with personal information, subject to legal, medical, operational, and security requirements.
              </p>
            </LegalSection>
            <LegalSection title="Contact">
              <p>
                For privacy questions, contact us at support@myogenixpharma.com.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </div>
  );
}
