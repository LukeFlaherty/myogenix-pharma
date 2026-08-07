import type { Metadata } from "next";
import Image from "next/image";
import { PdpButton, PdpKicker, PdpPanel, PdpWord } from "@/components/pdp/PdpDesignSystem";
import {
  SupplementalGrid,
  SupplementalHero,
} from "@/components/supplemental/SupplementalPage";
import { uiFont } from "@/lib/ui-font";

export const metadata: Metadata = {
  title: "Contact - MyoGenix Pharma",
  description:
    "Contact MyoGenix Pharma for questions about evaluations, orders, support, partnerships, and the patient care journey.",
};

const CONTACT_OPTIONS = [
  {
    title: "Patient support",
    body: "Questions about evaluations, order status, subscriptions, or next steps in your care journey.",
    icon: "headphones.svg",
  },
  {
    title: "Medical process",
    body: "Need help understanding intake, labs, provider review, or how treatment eligibility is determined.",
    icon: "doctor.svg",
  },
  {
    title: "Partnerships",
    body: "Retail partners, gyms, clinics, and wellness brands can ask about affiliate opportunities.",
    icon: "quest-logo-new.webp",
  },
];

const inputClass =
  "w-full border border-white/15 bg-black/70 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm font-medium text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500";

export default function ContactPage() {
  return (
    <div className="bg-black text-white">
      <SupplementalHero
        eyebrow="Contact"
        title="Questions?"
        accent="We can help."
        body="Reach the MyoGenix Pharma team for support, care journey questions, or partnership inquiries."
        image="/assets/grunge-redesign/pharma support staff tp bg.png"
        imageAlt="MyoGenix Pharma support staff"
      />

      <section className="relative overflow-hidden border-t border-red-700/70 bg-black py-10 text-white sm:py-12">
        <Image
          src="/assets/grunge-redesign/grunge black section bg blank.png"
          alt=""
          fill
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(220,38,38,0.16),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.58fr_1fr] lg:px-8">
          <div>
            <PdpKicker>Get in touch</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Send us</PdpWord>
              <PdpWord tone="red">a message</PdpWord>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-poppins)] text-base font-medium leading-relaxed text-zinc-300">
              Use the form and our support team will route your message to the right person.
            </p>
            <div className={`${uiFont.className} mt-6 border-l-2 border-red-600 pl-4 text-[1.35rem] font-normal uppercase leading-tight tracking-[0.045em] text-zinc-200`}>
              Email: support@myogenixpharma.com
            </div>
          </div>

          <PdpPanel className="p-5">
            <form
              action="mailto:support@myogenixpharma.com"
              method="post"
              encType="text/plain"
              className="grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>First name</span>
                  <input className={inputClass} name="firstName" autoComplete="given-name" required />
                </label>
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Last name</span>
                  <input className={inputClass} name="lastName" autoComplete="family-name" required />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Email</span>
                  <input className={inputClass} name="email" type="email" autoComplete="email" required />
                </label>
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Topic</span>
                  <select className={inputClass} name="topic" defaultValue="Patient support">
                    <option>Patient support</option>
                    <option>Provider review</option>
                    <option>Order or subscription</option>
                    <option>Affiliate partnership</option>
                    <option>General question</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Message</span>
                <textarea className={`${inputClass} min-h-40 resize-y`} name="message" required />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-[family-name:var(--font-poppins)] text-xs font-medium leading-relaxed text-zinc-500">
                  Please do not include urgent medical information in this form.
                </p>
                <PdpButton type="submit" className="w-full sm:w-auto">
                  Send message
                </PdpButton>
              </div>
            </form>
          </PdpPanel>
        </div>
      </section>

      <SupplementalGrid
        kicker="Support paths"
        title="The right help."
        accent="Faster answers."
        items={CONTACT_OPTIONS}
      />
    </div>
  );
}
