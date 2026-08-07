/**
 * Home Page
 * =========
 * The lead-capture popup is mounted here so it only appears on the home page.
 * To add a popup to another page, see the guide in
 * src/components/popup/types.ts.
 */

import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import type { CSSProperties } from "react";
import { SupportOptionsCard } from "@/components/grunge/SupportOptionsCard";
import { LeadCapturePopup } from "@/components/popup/LeadCapturePopup";
import { getAffiliateCode } from "@/lib/affiliate";
import { uiFont } from "@/lib/ui-font";
import type { PopupConfig } from "@/components/popup/types";

const ASSET_BASE = "/assets/grunge-redesign";

const oswald = Oswald({ subsets: ["latin"], weight: "700" });

const HOME_POPUP_CONFIG: PopupConfig = {
  storageKey: "myogenix_popup_home_v2",
  delayMs: 4000,
  suppressDays: 7,
  heading: "Unlock 10% off your first order",
  body: "Enter your details and we will send your private code.",
  source: "homepage_popup",
};

const CARE_FEATURES = [
  { label: "Physician-guided care", icon: "doctor.svg" },
  { label: "Lab testing with Quest", icon: "vial.svg" },
  { label: "Personalized treatment plans", icon: "rx.svg" },
  { label: "Medication shipped to your door", icon: "box.svg" },
  { label: "Dedicated concierge support", icon: "headphones.svg" },
];

const STEPS = [
  {
    number: "1",
    title: "Quick online intake",
    body: "Complete your medical questionnaire in minutes.",
  },
  {
    number: "2",
    title: "Quest lab testing",
    body: "Get diagnostic labs at a trusted local Quest.",
  },
  {
    number: "3",
    title: "Physician review",
    body: "A licensed provider reviews your results and health history.",
  },
  {
    number: "4",
    title: "Personalized plan",
    body: "Your dose is built for your goals, symptoms, and markers.",
  },
  {
    number: "5",
    title: "Shipped to your door",
    body: "Medication arrives discreetly with ongoing concierge care.",
  },
];

const CHECK_ITEMS = [
  "Online enrollment",
  "Licensed providers",
  "Personalized dosing",
  "Doorstep delivery",
  "Human concierge support",
];

const SYMPTOMS = [
  "Low energy",
  "Brain fog",
  "Loss of strength",
  "Increased body fat",
  "Low libido",
  "Poor recovery",
  "Mood changes",
  "Poor sleep",
];

const SYMPTOM_COLUMNS = [
  SYMPTOMS.slice(0, 4),
  SYMPTOMS.slice(4),
];

const TRUST_ITEMS = [
  { title: "Built for athletes", body: "Performance roots. Clinical standards.", icon: "muscle-icon.webp" },
  { title: "Physician-guided care", body: "Licensed medical oversight.", icon: "hospital-staff.webp" },
  { title: "Quest diagnostics", body: "Industry-leading lab partner.", icon: "quest-logo-new.webp" },
  { title: "Concierge follow-up", body: "Real support. Always here.", icon: "headphones" },
];

const FAQS = [
  {
    q: "How do I start?",
    a: "Start with the online evaluation. We collect your goals, medical history, and the details a provider needs to determine next steps.",
  },
  {
    q: "Do I need labs?",
    a: "For TRT, labs are part of the care path. We use diagnostics to help guide eligibility, treatment planning, and follow-up.",
  },
  {
    q: "Who reviews my results?",
    a: "A licensed provider reviews your intake and lab results before a treatment plan is approved.",
  },
  {
    q: "How long does it take?",
    a: "Timing depends on lab completion and provider review, but many patients can complete the evaluation process in one to two weeks.",
  },
  {
    q: "Can I ask questions first?",
    a: "Yes. You can reach out before starting, and our team can help you understand the care journey before you submit an evaluation.",
  },
];

function GrungeButton({
  href,
  children,
  variant = "red",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "red" | "dark";
  className?: string;
}) {
  const baseClass = `${uiFont.className} inline-flex min-h-9 items-center justify-center gap-2 px-2.5 py-1.5 text-[22px] font-normal uppercase tracking-[0.055em] text-white transition lg:text-[20px]`;

  return (
    <Link
      href={href}
      className={
        variant === "red"
          ? `${baseClass} bg-red-600 shadow-[0_0_24px_rgba(220,38,38,0.35)] hover:bg-red-500 ${className}`
          : `${baseClass} border-2 border-white/45 bg-black/70 hover:border-white/75 hover:text-red-100 ${className}`
      }
    >
      <span>{children}</span>
      <Image src={`${ASSET_BASE}/cta-arrow.svg`} alt="" width={22} height={18} style={{ width: "22px", height: "auto" }} />
    </Link>
  );
}

function GrungeWord({
  children,
  tone = "white",
}: {
  children: string;
  tone?: "red" | "white";
}) {
  return (
    <span
      className={`${oswald.className} grunge-word`}
      data-text={children}
      data-tone={tone}
      style={{ "--grunge-color": tone === "red" ? "#dc2626" : "#ffffff" } as CSSProperties}
    >
      {children}
    </span>
  );
}

function SectionShell({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative overflow-hidden border-t border-red-700/70 bg-black text-white ${className}`}>
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: `url("${ASSET_BASE}/grunge black section bg blank.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(190,18,60,0.16),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.82))]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function Kicker({
  children,
  className = "text-red-500",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p className={`${uiFont.className} grunge-kicker uppercase ${className}`} style={style}>
      {children}
    </p>
  );
}

function CheckLine({
  children,
  className = "",
  iconClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <li className={`${uiFont.className} flex items-center gap-2 text-[1.2rem] font-normal uppercase tracking-[0.055em] text-zinc-200 ${className}`}>
      <Image
        src={`${ASSET_BASE}/checkbox.svg`}
        alt=""
        width={14}
        height={14}
        className={`h-[14px] w-[14px] shrink-0 ${iconClassName}`}
      />
      <span>{children}</span>
    </li>
  );
}

function TrustIcon({ icon }: { icon: string }) {
  if (icon === "headphones") {
    return (
      <Image
        src={`${ASSET_BASE}/headphones.svg`}
        alt=""
        width={82}
        height={82}
        className="mx-auto -mt-3 h-20 w-20 object-contain opacity-95 sm:-mt-2 sm:h-14 sm:w-14 lg:h-[4.2rem] lg:w-[4.2rem]"
      />
    );
  }

  return (
    <Image
      src={`${ASSET_BASE}/${icon}`}
      alt=""
      width={82}
      height={82}
      className="mx-auto h-20 w-20 object-contain sm:h-14 sm:w-14 lg:h-[4.2rem] lg:w-[4.2rem]"
    />
  );
}

export default async function Home() {
  const affiliateSlug = await getAffiliateCode();

  return (
    <>
      <LeadCapturePopup config={HOME_POPUP_CONFIG} affiliateSlug={affiliateSlug} />

      <div className={`${uiFont.className} bg-black text-white`}>
        <section className="relative isolate overflow-hidden bg-black text-white">
          <Image
            src={`${ASSET_BASE}/hero bg.png`}
            alt=""
            fill
            priority
            className="object-cover object-center opacity-95"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.5)_42%,rgba(0,0,0,0.08)_100%),linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.52)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-red-600" />

          <div className="relative mx-auto grid min-h-[500px] max-w-6xl items-end gap-5 px-4 pb-8 pt-10 sm:px-6 lg:min-h-[520px] lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pt-12">
            <div className="pb-4 text-center lg:text-left">
              <Kicker className="text-white" style={{ "--kicker-size": "0.87rem" } as CSSProperties}>25+ years of performance</Kicker>
              <h1 className="mx-auto mt-4 max-w-[33rem] text-[6.7rem] font-black uppercase leading-[0.8] tracking-normal sm:max-w-2xl sm:text-[5.4rem] lg:mx-0 lg:text-[7.2rem]">
                <GrungeWord tone="red">MyoGenix</GrungeWord>
                <GrungeWord>Pharma</GrungeWord>
              </h1>
              <p className="mx-auto mt-5 max-w-[24rem] text-[2.05rem] font-normal uppercase leading-[0.92] tracking-[0.035em] text-white sm:max-w-2xl sm:text-[2.4rem] lg:mx-0">
                Concierge telehealth for TRT
                <span className="block text-red-500">Performance care, guided by humans.</span>
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <GrungeButton
                  href="/mens-health/testosterone"
                  className="w-full max-w-[22rem] bg-[linear-gradient(rgba(220,38,38,0.82),rgba(220,38,38,0.82)),url('/assets/grunge-redesign/concrete-texture.jpg')] bg-[length:auto,420px_280px] bg-center [background-blend-mode:normal,multiply] sm:w-auto sm:max-w-none"
                >
                  Start your evaluation
                </GrungeButton>
                <GrungeButton href="#faq" variant="dark" className="w-full max-w-[22rem] sm:w-auto sm:max-w-none">
                  Ask a question
                </GrungeButton>
              </div>
            </div>

            <div className="relative min-h-[390px] lg:min-h-[500px] lg:-mr-8">
              <Image
                src={`${ASSET_BASE}/mgrx-hero-team.webp`}
                alt="MyoGenix Pharma care team with TRT treatment"
                fill
                priority
                className="scale-105 object-contain object-bottom drop-shadow-[0_30px_55px_rgba(0,0,0,0.75)]"
                sizes="(max-width: 1024px) 100vw, 620px"
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-red-700/70 bg-[#080808]">
          <Image
            src={`${ASSET_BASE}/thin section bg.png`}
            alt=""
            fill
            className="object-cover opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-red-950/80 px-4 sm:px-6 md:grid-cols-5 md:divide-y-0 lg:px-8">
            {CARE_FEATURES.map((feature, index) => (
              <div
                key={feature.label}
                className={`flex min-h-32 flex-col items-center justify-center gap-3 px-3 py-5 text-center ${
                  index === CARE_FEATURES.length - 1 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Image
                  src={`${ASSET_BASE}/${feature.icon}`}
                  alt=""
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] object-contain opacity-90"
                />
                <p className="max-w-36 text-[1.5rem] font-normal uppercase leading-[0.95] tracking-[0.04em] text-zinc-200 md:text-[1.25rem]">
                  {feature.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <SectionShell id="how-it-works" className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
            <div>
              <Kicker>How it works</Kicker>
              <h2 className="mt-2 text-5xl font-black uppercase leading-[0.88] tracking-normal sm:text-6xl">
                <GrungeWord>Getting evaluated</GrungeWord>
                <span className="block text-[0.6em] leading-[0.9]">
                  <GrungeWord tone="red">is easier than ever</GrungeWord>
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-[1.6rem] font-normal uppercase leading-tight tracking-[0.035em] text-zinc-300">
                Many patients complete the process in as little as
                <span className="ml-2 inline-flex border border-white/20 px-3 py-1 text-white">1-2 weeks</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {STEPS.map((step) => (
                <div key={step.number} className={`relative min-h-44 overflow-hidden border border-white/12 bg-zinc-950/75 p-3 sm:min-h-52 ${step.number === "5" ? "col-span-2 sm:col-span-1" : ""}`}>
                  <div className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center bg-red-600 text-[1.35rem] font-normal">
                    {step.number}
                  </div>
                  <div className={`relative z-10 mx-auto h-24 w-28 overflow-visible ${step.number === "4" ? "mt-3 -translate-y-2" : "mt-8"}`}>
                    <Image
                      src={
                        step.number === "1"
                          ? `${ASSET_BASE}/mgrx-phone-care-journey.webp`
                          : step.number === "2"
                            ? `${ASSET_BASE}/quest-logo-new.webp`
                            : step.number === "3"
                              ? `${ASSET_BASE}/doctor.svg`
                              : step.number === "4"
                                ? `${ASSET_BASE}/icon-box.webp`
                                : `${ASSET_BASE}/trt-category-image.webp`
                      }
                      alt=""
                      fill
                      className={`object-contain ${
                        step.number === "1"
                          ? "scale-[1.45] sm:scale-[1.23]"
                          : step.number === "2"
                            ? "scale-125 sm:scale-[1.06]"
                            : step.number === "3"
                              ? "scale-110 sm:scale-[0.94]"
                              : step.number === "4"
                                ? "scale-[1.32] sm:scale-[1.18]"
                                : "scale-[1.9] sm:scale-[1.22]"
                      }`}
                      sizes="112px"
                    />
                  </div>
                  <h3 className="mt-4 text-[1.25rem] font-normal uppercase leading-[0.95] tracking-[0.035em] text-white">{step.title}</h3>
                  <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs font-medium leading-snug text-zinc-400">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <section className="relative z-20 overflow-visible border-t border-red-700/70 bg-black text-white">
          <Image
            src={`${ASSET_BASE}/bg-genetic-wire.webp`}
            alt=""
            fill
            className="object-cover opacity-95"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.2),rgba(0,0,0,0.72)_46%,rgba(0,0,0,0.18))]" />
          <div className="relative mx-auto grid min-h-[330px] max-w-6xl items-stretch gap-3 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.78fr_1.07fr] lg:gap-6 lg:px-8 lg:py-10">
            <div className="relative min-h-[13.5rem] pt-8 sm:pr-56 lg:min-h-64 lg:pr-32 lg:pt-0">
              <h2 className="relative z-30 text-[4.25rem] font-black uppercase leading-[0.86] tracking-normal sm:text-6xl lg:text-[4.45rem]">
                <GrungeWord>Concierge</GrungeWord>
                <GrungeWord>telehealth</GrungeWord>
                <span className="block">
                  <GrungeWord tone="red">for TRT</GrungeWord>
                </span>
              </h2>
              <Image
                src={`${ASSET_BASE}/trt-category-image.webp`}
                alt="TRT bottles"
                width={246}
                height={246}
                className="relative z-20 mt-4 hidden h-auto w-[15.4rem] object-contain opacity-75 lg:absolute lg:bottom-[-5rem] lg:left-4 lg:mt-0 lg:block lg:w-[18.5rem]"
              />
            </div>

            <div className="relative -mt-4 grid grid-cols-1 items-start gap-2 lg:mt-0 lg:contents">
              <Image
                src={`${ASSET_BASE}/guy-helping-1.webp`}
                alt=""
                fill
                className="pointer-events-none z-0 scale-[1.15] object-contain object-right-bottom opacity-70 blur-[0.2px] lg:hidden"
                sizes="260px"
              />
              <div className="relative z-20 flex flex-col justify-center">
                <p className="max-w-xs text-[1.85rem] font-normal uppercase leading-[1.1] tracking-[0.025em] text-zinc-100">
                  <span className="block text-red-500">Physician-guided</span>
                  <span className="block">treatment.</span>
                  <span className="block">Human support.</span>
                </p>
                <ul className="mt-5 grid gap-3">
                  {CHECK_ITEMS.map((item) => (
                    <CheckLine key={item} className="text-[1.2rem]" iconClassName="h-[29px] w-[29px] lg:h-[24px] lg:w-[24px]">{item}</CheckLine>
                  ))}
                </ul>
                <div className="mt-7">
                  <GrungeButton href="/mens-health/testosterone" className="w-full max-w-none lg:w-auto">
                    Start TRT
                  </GrungeButton>
                </div>
              </div>

              <div className="relative z-10 hidden min-h-72 overflow-visible lg:mt-0 lg:block lg:min-h-72 lg:translate-x-0">
                <Image
                  src={`${ASSET_BASE}/bg-genetic-wire.webp`}
                  alt=""
                  fill
                  className="object-cover opacity-80"
                  sizes="420px"
                />
                <div className="absolute inset-0 bg-black/35" />
                <Image
                  src={`${ASSET_BASE}/mgrx-phone-care-journey.webp`}
                  alt="MyoGenix Pharma care journey on mobile"
                  fill
                  className="hidden scale-[1.38] object-contain object-top drop-shadow-[0_28px_45px_rgba(0,0,0,0.8)] sm:scale-110 lg:block lg:scale-110 lg:object-center"
                  sizes="360px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 overflow-hidden border-t border-red-700/70 bg-black text-white">
          <Image
            src={`${ASSET_BASE}/section bg 2.png`}
            alt=""
            fill
            className="object-cover opacity-85"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18),rgba(0,0,0,0.34)_45%,rgba(0,0,0,0.72))]" />
          <div className="relative mx-auto grid min-h-[320px] max-w-6xl grid-cols-[0.9fr_1.1fr] items-center gap-5 px-4 py-12 sm:px-6 lg:grid-cols-[0.78fr_1.02fr_0.95fr] lg:gap-5 lg:px-8">
            <div className="pointer-events-none absolute left-0 top-10 z-0 h-64 w-56 lg:pointer-events-auto lg:relative lg:left-auto lg:top-auto lg:z-auto lg:h-auto lg:w-auto lg:min-h-64">
              <Image
                src={`${ASSET_BASE}/guy-sad.webp`}
                alt="Man considering symptoms of low testosterone"
                fill
                className="origin-top-left -translate-x-[20%] object-contain object-left-top drop-shadow-[0_28px_40px_rgba(0,0,0,0.85)] scale-[1.7] sm:scale-[1.6] lg:origin-center lg:translate-x-0 lg:scale-125 lg:object-left-bottom"
                sizes="360px"
              />
            </div>
            <div className="relative z-10 col-start-2 lg:col-start-auto">
              <h2 className="text-[3.65rem] font-black uppercase leading-[0.86] tracking-normal sm:text-6xl">
                <GrungeWord>Common</GrungeWord>
                <GrungeWord tone="red">symptoms</GrungeWord>
                <GrungeWord>of low T</GrungeWord>
              </h2>
            </div>
            <div className="relative z-30 col-span-2 mt-2 lg:col-span-1 lg:mt-0 lg:w-full">
              <div className="grid grid-cols-2 gap-x-7 lg:gap-x-10">
                {SYMPTOM_COLUMNS.map((column, index) => (
                  <ul key={index} className="grid gap-3">
                    {column.map((item) => (
                      <CheckLine
                        key={item}
                        className="text-[1.55rem] leading-[1.05] tracking-normal lg:text-[1.47rem] lg:tracking-wide"
                        iconClassName="h-[18px] w-[18px] lg:h-6 lg:w-6"
                      >
                        {item}
                      </CheckLine>
                    ))}
                  </ul>
                ))}
              </div>
              <div className="mt-7">
                <GrungeButton href="/mens-health/testosterone" className="w-full max-w-none">
                  See if TRT is right for you
                </GrungeButton>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-red-700/70 bg-black text-white">
          <Image
            src={`${ASSET_BASE}/red-dots-grid-background.webp`}
            alt=""
            fill
            className="object-cover opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.55)_52%,rgba(0,0,0,0.92))]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_0.72fr_0.88fr] lg:px-8">
            <div className="relative z-20 min-h-[17rem] pr-24 lg:min-h-0 lg:pr-0">
              <Kicker>Our approach</Kicker>
              <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal">
                <GrungeWord>Not a hard sell.</GrungeWord>
                <GrungeWord tone="red">A human hand holder.</GrungeWord>
              </h2>
            </div>
            <div className="pointer-events-none absolute right-[-54px] top-20 z-10 h-80 w-80 lg:pointer-events-auto lg:relative lg:right-auto lg:top-auto lg:z-20 lg:h-auto lg:min-h-64 lg:w-auto lg:-ml-16">
              <Image
                src={`${ASSET_BASE}/guy-helping-2.webp`}
                alt="MyoGenix Pharma support specialist"
                fill
                className="scale-125 object-contain object-bottom sm:scale-[1.32] lg:scale-[1.55]"
                sizes="360px"
              />
            </div>
            <div className="relative z-30 grid gap-3">
              <SupportOptionsCard />
            </div>
          </div>
        </section>

        <SectionShell className="py-10 sm:py-12">
          <div className="grid gap-7 lg:grid-cols-[0.55fr_1fr] lg:items-center">
            <div>
              <Kicker>Why athletes trust us</Kicker>
              <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal">
                <GrungeWord>25+ years of</GrungeWord>
                <GrungeWord>performance</GrungeWord>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-red-950/80 sm:grid-cols-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item.title} className="min-h-44 bg-black/70 p-4 text-center">
                  <TrustIcon icon={item.icon} />
                  <h3 className="mt-4 text-[1.32rem] font-normal uppercase leading-[0.95] tracking-[0.035em] text-white">{item.title}</h3>
                  <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs font-medium leading-snug text-zinc-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <section id="faq" className="relative overflow-hidden border-t border-red-700/70 bg-black py-6 text-white sm:py-8">
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `url("${ASSET_BASE}/concrete-texture.jpg")`,
              backgroundSize: "520px 350px",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_34%,rgba(190,18,60,0.22),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.9)_42%,rgba(0,0,0,0.7))]" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.6fr_1fr]">
            <div>
              <Kicker>FAQ</Kicker>
              <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal">
                <GrungeWord>Your questions.</GrungeWord>
                <GrungeWord tone="red">Answered.</GrungeWord>
              </h2>
              <div className="mt-6">
                <GrungeButton href="/mens-health/testosterone" variant="dark">Ask a question</GrungeButton>
              </div>
            </div>
            <div className="grid gap-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group border-2 border-white/20 bg-black/35">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="text-[1.35rem] font-normal uppercase tracking-[0.04em] text-zinc-200">{faq.q}</span>
                    <span className="text-xl font-black text-white transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="border-t border-white/10 px-4 pb-4 pt-3 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-zinc-300">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-red-700/70 bg-[#070707] text-white">
          <Image
            src={`${ASSET_BASE}/thin section bg.png`}
            alt=""
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-[0.58fr_1.42fr_0.82fr] lg:px-8">
            <Image
              src={`${ASSET_BASE}/red and white logo.svg`}
              alt="MyoGenix Pharma"
              width={220}
              height={64}
              className="mx-auto h-14 w-auto md:mx-0"
            />
            <h2 className="justify-self-center text-center text-[3.6rem] font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <GrungeWord>Concierge care</GrungeWord>
              <GrungeWord tone="red">is live</GrungeWord>
            </h2>
            <div className="flex flex-col gap-3 justify-self-stretch">
              <GrungeButton href="/mens-health/testosterone">Start your evaluation</GrungeButton>
              <GrungeButton href="#faq" variant="dark">Ask a question</GrungeButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
