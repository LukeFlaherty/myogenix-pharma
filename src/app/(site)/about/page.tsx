import type { Metadata } from "next";
import {
  SupplementalCta,
  SupplementalGrid,
  SupplementalHero,
  SupplementalIntro,
} from "@/components/supplemental/SupplementalPage";

export const metadata: Metadata = {
  title: "About Us - MyoGenix Pharma",
  description:
    "Learn about MyoGenix Pharma's concierge telehealth model for performance-focused care, physician review, lab testing, and human support.",
};

const PRINCIPLES = [
  {
    title: "Human guidance",
    body: "Patients are not dropped into a generic checkout flow. Our care model pairs online convenience with real people who can help them understand the next step.",
    icon: "headphones.svg",
  },
  {
    title: "Clinical oversight",
    body: "Treatment paths are built around medical intake, provider review, and appropriate diagnostics when labs are part of the care journey.",
    icon: "doctor.svg",
  },
  {
    title: "Performance roots",
    body: "MyoGenix was shaped by decades in performance, wellness, and patient education, with an emphasis on practical outcomes over hype.",
    icon: "hospital-staff.webp",
  },
  {
    title: "Clear process",
    body: "From evaluation to provider review to fulfillment, patients should know where they are in the process and what happens next.",
    icon: "laptop-check.svg",
  },
  {
    title: "Personalized plans",
    body: "Care decisions consider medical history, goals, symptoms, and lab markers when applicable. The point is fit, not one-size-fits-all care.",
    icon: "rx.svg",
  },
  {
    title: "Reliable follow-up",
    body: "Our team stays available after checkout, because questions often come up once a patient begins the care journey.",
    icon: "box.svg",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <SupplementalHero
        eyebrow="About MyoGenix"
        title="Built for"
        accent="performance care"
        body="Concierge telehealth with clinical review, lab-aware treatment paths, and human support from start to finish."
        image="/assets/grunge-redesign/mgrx-hero-team.webp"
        imageAlt="MyoGenix Pharma care team"
      />
      <SupplementalIntro
        kicker="Our story"
        title="From performance"
        accent="to patient care"
        body="MyoGenix Pharma was created for people who want a more guided way to pursue weight management, hormone health, sexual wellness, and peptide-based programs. We bring together online access, licensed provider oversight, diagnostic partners, and concierge support so patients can move through care with more confidence."
        checks={[
          "Online medical intake",
          "Licensed provider review",
          "Quest diagnostics when needed",
          "Discreet medication delivery",
        ]}
      />
      <SupplementalGrid
        kicker="What guides us"
        title="Clear standards."
        accent="Real support."
        items={PRINCIPLES}
      />
      <SupplementalCta
        title="Have questions?"
        accent="Talk to us."
        body="Our team can help you understand the care journey before you begin an evaluation."
        href="/contact"
        label="Contact support"
      />
    </div>
  );
}
