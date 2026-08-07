import type { Medicine } from "./pdp-types";
import { PEPTIDE_MEDICINES } from "./pdp-config";

export type PdpTemplateTag = "peptide";

export const PDP_TEMPLATE_BY_MEDICINE: Partial<Record<Medicine, PdpTemplateTag>> =
  Object.fromEntries(PEPTIDE_MEDICINES.map((medicine) => [medicine, "peptide"])) as Partial<
    Record<Medicine, PdpTemplateTag>
  >;

export const PDP_COPY = {
  primaryCta: "Continue to evaluation",
  secondaryCta: "Ask a question",
  categoryCardCta: "Start Now",
  selectPlanCta: "Select plan",
  reviewHeading: "Plan review first",
  reviewBody: "Personalized after provider review.",
  supportHeading: "Fast answers. Guided support.",
  supportBody:
    "We are here to guide you through every step and answer questions before, during, and after your treatment.",
  disclaimer: "Prescription required if approved. Plan review by licensed provider.",
} as const;

export const PDP_CARE_FEATURES = [
  { label: "Physician-guided care", icon: "doctor.svg" },
  { label: "Online intake", icon: "laptop-check.svg" },
  { label: "Personalized dosing", icon: "rx.svg" },
  { label: "Shipped to your door", icon: "box.svg" },
  { label: "Concierge support", icon: "headphones.svg" },
] as const;

export const PDP_PROCESS_STEPS = [
  {
    number: "1",
    title: "Quick online intake",
    body: "Complete your confidential medical questionnaire in minutes.",
    icon: "laptop-check.svg",
  },
  {
    number: "2",
    title: "Provider review",
    body: "A licensed provider reviews your health history and goals.",
    icon: "doctor.svg",
  },
  {
    number: "3",
    title: "Personalized plan",
    body: "Your protocol is reviewed for the selected dose and supply.",
    icon: "rx.svg",
  },
  {
    number: "4",
    title: "Shipped to your door",
    body: "Discreet, temperature-aware shipping direct to you.",
    icon: "box.svg",
  },
] as const;

export const PDP_FAQS = [
  {
    q: "How is my dose selected?",
    a: "You choose a starting configuration, then a licensed provider reviews whether it is appropriate for your health history and goals.",
  },
  {
    q: "Can I change my quantity?",
    a: "Yes. You can select a different supply before checkout. Future protocol changes should be guided by your provider.",
  },
  {
    q: "What happens after provider review?",
    a: "If approved, your medication is prepared and shipped. If the provider needs more information, the care team will follow up.",
  },
] as const;
