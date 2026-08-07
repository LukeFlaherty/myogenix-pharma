import {
  PdpButton,
  PdpCheckLine,
  PdpKicker,
  PdpPanel,
  PdpSection,
  PdpWord,
} from "@/components/pdp/PdpDesignSystem";
import { SupportOptionsCard } from "@/components/grunge/SupportOptionsCard";
import {
  SupplementalCta,
  SupplementalGrid,
  SupplementalHero,
} from "@/components/supplemental/SupplementalPage";
import { uiFont } from "@/lib/ui-font";

const STEPS = [
  {
    number: "01",
    title: "Contact us",
    body: "Send your store name, location, and a quick note about your business. We will confirm fit and next steps.",
  },
  {
    number: "02",
    title: "Get your QR code",
    body: "Approved partners receive a tracked referral link or QR code tied to their store attribution.",
  },
  {
    number: "03",
    title: "Share and earn",
    body: "Customers scan, shop, and complete their care journey online. Qualified conversions are credited to you.",
  },
];

const PARTNER_FITS = [
  "Vitamin and supplement shops",
  "Fitness centers and gyms",
  "Wellness clinics and med spas",
  "Chiropractic offices",
  "Physical therapy practices",
  "Health food stores",
];

const PROGRAM_FEATURES = [
  {
    title: "10% commission",
    body: "Earn commission on completed, qualifying first orders attributed to your referral code.",
    icon: "checkbox.svg",
  },
  {
    title: "No inventory",
    body: "MyoGenix handles the website, provider review workflow, fulfillment coordination, and support.",
    icon: "box.svg",
  },
  {
    title: "Monthly payouts",
    body: "Commission reporting and partner payouts are handled on a monthly cadence for approved accounts.",
    icon: "rx.svg",
  },
];

const inputClass =
  "w-full border border-white/15 bg-black/70 px-4 py-3 font-[family-name:var(--font-poppins)] text-sm font-medium text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500";

export function AffiliatesContent() {
  return (
    <div className="bg-black text-white">
      <SupplementalHero
        eyebrow="Affiliate program"
        title="Partner with"
        accent="MyoGenix"
        body="A simple retail referral program for wellness shops, gyms, clinics, and performance-focused brands."
        visual={
          <SupportOptionsCard
            className="mx-auto max-w-[23rem] lg:mr-8 lg:max-w-[22rem] lg:scale-110"
            ctaHref="#affiliate-application"
            ctaLabel="Apply now"
          />
        }
      />

      <PdpSection className="py-10 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[0.58fr_1fr] lg:items-start">
          <div>
            <PdpKicker>Retail partner program</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Earn 10%</PdpWord>
              <PdpWord tone="red">no inventory</PdpWord>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-poppins)] text-base font-medium leading-relaxed text-zinc-300">
              We provide a tracked referral path. Your customers scan, learn, and order through MyoGenix Pharma while your business earns on qualifying conversions.
            </p>
            <div className="mt-6">
              <PdpButton href="#affiliate-application">
                Apply now
              </PdpButton>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <PdpPanel key={step.number} className="min-h-56 p-4">
                <span className={`${uiFont.className} text-[2.6rem] font-normal uppercase leading-none text-red-600`}>
                  {step.number}
                </span>
                <h3 className={`${uiFont.className} mt-4 text-[1.4rem] font-normal uppercase leading-none tracking-[0.045em] text-white`}>
                  {step.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
                  {step.body}
                </p>
              </PdpPanel>
            ))}
          </div>
        </div>
      </PdpSection>

      <SupplementalGrid
        kicker="Why partner"
        title="Simple program."
        accent="High demand."
        items={PROGRAM_FEATURES}
      />

      <PdpSection id="affiliate-application" className="py-10 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[0.58fr_1fr] lg:items-start">
          <div>
            <PdpKicker>Apply on page</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Tell us</PdpWord>
              <PdpWord tone="red">about your business</PdpWord>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-poppins)] text-base font-medium leading-relaxed text-zinc-300">
              Share the basics and our partner team will review fit, attribution setup, and next steps.
            </p>
          </div>
          <PdpPanel className="p-5">
            <form
              action="mailto:partners@myogenixpharma.com"
              method="post"
              encType="text/plain"
              className="grid gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Business name</span>
                  <input className={inputClass} name="businessName" autoComplete="organization" required />
                </label>
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Contact name</span>
                  <input className={inputClass} name="contactName" autoComplete="name" required />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Email</span>
                  <input className={inputClass} name="email" type="email" autoComplete="email" required />
                </label>
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Phone</span>
                  <input className={inputClass} name="phone" type="tel" autoComplete="tel" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Business type</span>
                  <select className={inputClass} name="businessType" defaultValue="Wellness retail">
                    <option>Wellness retail</option>
                    <option>Gym or fitness studio</option>
                    <option>Clinic or med spa</option>
                    <option>Chiropractic or PT</option>
                    <option>Performance brand</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Location</span>
                  <input className={inputClass} name="location" autoComplete="address-level2" placeholder="City, state" />
                </label>
              </div>
              <label className="grid gap-2">
                <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Website or social</span>
                <input className={inputClass} name="website" type="url" placeholder="https://" />
              </label>
              <label className="grid gap-2">
                <span className={`${uiFont.className} text-[1.15rem] font-normal uppercase tracking-[0.08em] text-zinc-300`}>Quick note</span>
                <textarea className={`${inputClass} min-h-36 resize-y`} name="message" placeholder="Tell us about your customers and why the affiliate program fits." required />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-[family-name:var(--font-poppins)] text-xs font-medium leading-relaxed text-zinc-500">
                  This demo form opens an email draft with your application details.
                </p>
                <PdpButton type="submit" className="w-full sm:w-auto">
                  Submit application
                </PdpButton>
              </div>
            </form>
          </PdpPanel>
        </div>
      </PdpSection>

      <PdpSection className="py-10 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[0.58fr_1fr] lg:items-center">
          <div>
            <PdpKicker>Good fit</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Built for</PdpWord>
              <PdpWord tone="red">wellness retail</PdpWord>
            </h2>
          </div>
          <PdpPanel className="p-5">
            <ul className="grid gap-3 sm:grid-cols-2">
              {PARTNER_FITS.map((fit) => (
                <PdpCheckLine key={fit} className="text-[1.25rem] leading-tight">
                  {fit}
                </PdpCheckLine>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
                Use the application form on this page with your business name, location, and the best contact person. We will respond with program details and approval steps.
              </p>
            </div>
          </PdpPanel>
        </div>
      </PdpSection>

      <SupplementalCta
        title="Ready to"
        accent="partner?"
        body="Tell us about your store, studio, clinic, or brand and we will help you understand the affiliate path."
        href="#affiliate-application"
        label="Apply on page"
      />
    </div>
  );
}
