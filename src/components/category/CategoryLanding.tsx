import Image from "next/image";
import type { Medicine } from "@/lib/pdp-types";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import {
  PDP_CARE_FEATURES,
  PDP_COPY,
  PDP_PROCESS_STEPS,
} from "@/lib/pdp-design-config";
import { uiFont } from "@/lib/ui-font";
import {
  PdpButton,
  PdpIcon,
  PdpKicker,
  PdpPanel,
  PdpSection,
  PdpWord,
} from "@/components/pdp/PdpDesignSystem";
import { cn } from "@/lib/utils";

interface CategoryLandingProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  body: string;
  medicines: readonly Medicine[];
  hrefBase: string;
  optionLabel: string;
  priceUnit: string;
  heroCtaHref: string;
  heroImage?: string;
  heroImageAlt?: string;
}

function titleParts(title: string, accent?: string) {
  if (!accent || !title.includes(accent)) {
    return { before: title, accent: "", after: "" };
  }
  const [before, after = ""] = title.split(accent);
  return { before: before.trim(), accent, after: after.trim() };
}

export function CategoryLanding({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  body,
  medicines,
  hrefBase,
  optionLabel,
  priceUnit,
  heroCtaHref,
  heroImage,
  heroImageAlt = "",
}: CategoryLandingProps) {
  const featuredMedicines = medicines.slice(0, 5);
  const heading = titleParts(title, titleAccent);

  return (
    <div className="bg-black text-white">
      <section className="relative isolate overflow-hidden border-b border-red-700/70 bg-black">
        <Image
          src="/assets/grunge-redesign/hero bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.66)_42%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.68)_100%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)] lg:px-8 lg:py-10">
          <div className="flex flex-col justify-end pb-4 text-center lg:text-left">
            <PdpKicker className="text-white">{eyebrow}</PdpKicker>
            <h1 className="mx-auto mt-3 max-w-[43rem] text-[5.6rem] font-black uppercase leading-[0.82] tracking-normal sm:text-[7rem] lg:mx-0 lg:text-[8.4rem]">
              {heading.before && <PdpWord tone={heading.accent ? "white" : "red"}>{heading.before}</PdpWord>}
              {heading.accent && <PdpWord tone="red">{heading.accent}</PdpWord>}
              {heading.after && <PdpWord>{heading.after}</PdpWord>}
            </h1>
            <p className={`${uiFont.className} mx-auto mt-4 max-w-[38rem] text-[2rem] font-normal uppercase leading-[0.96] tracking-[0.035em] text-zinc-100 sm:text-[2.45rem] lg:mx-0`}>
              {subtitle}
            </p>
            <p className={`${uiFont.className} mx-auto mt-4 max-w-[33rem] text-[1.35rem] font-normal uppercase leading-[1.05] tracking-[0.035em] text-zinc-300 lg:mx-0`}>
              {body}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <PdpButton href={heroCtaHref} className="w-full max-w-[20rem] px-5 sm:w-auto sm:min-w-[16rem] sm:max-w-none">
                {PDP_COPY.primaryCta}
              </PdpButton>
              <PdpButton href="/contact" variant="dark" className="w-full max-w-[20rem] px-5 sm:w-auto sm:min-w-[13rem] sm:max-w-none">
                {PDP_COPY.secondaryCta}
              </PdpButton>
            </div>
          </div>

          <div className="relative min-h-[260px] lg:min-h-[390px]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                className="object-contain object-bottom drop-shadow-[0_32px_55px_rgba(0,0,0,0.75)]"
                sizes="(max-width: 1024px) 100vw, 430px"
              />
            ) : (
              <div className="absolute inset-0 flex items-end justify-center opacity-90">
                {featuredMedicines.map((medicine, index) => {
                  const offset = index - (featuredMedicines.length - 1) / 2;
                  const isCenter = Math.abs(offset) < 0.5;
                  return (
                    <div
                      key={medicine}
                      className={cn(
                        "absolute bottom-3 aspect-square w-[34%] max-w-[12.5rem] transition",
                        isCenter ? "z-30 scale-110" : "z-20 scale-90 opacity-85",
                        Math.abs(offset) > 1.5 && "hidden sm:block opacity-60"
                      )}
                      style={{ transform: `translateX(${offset * 52}%) scale(${isCenter ? 1.1 : 0.86})` }}
                    >
                      <Image
                        src={`/products/${medicine}.webp`}
                        alt={MEDICINE_CONFIG[medicine].name}
                        fill
                        className="object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.75)]"
                        sizes="(max-width: 768px) 34vw, 200px"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-red-700/70 bg-[#080808]">
        <Image
          src="/assets/grunge-redesign/thin section bg.png"
          alt=""
          fill
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-red-950/80 px-4 sm:px-6 md:grid-cols-5 md:divide-y-0 lg:px-8">
          {PDP_CARE_FEATURES.map((feature, index) => (
            <div
              key={feature.label}
              className={cn(
                "flex min-h-32 flex-col items-center justify-center gap-3 px-3 py-5 text-center",
                index === PDP_CARE_FEATURES.length - 1 && "col-span-2 md:col-span-1"
              )}
            >
              <PdpIcon icon={feature.icon} />
              <p className="max-w-36 text-[1.4rem] font-normal uppercase leading-[0.95] tracking-[0.04em] text-zinc-200 md:text-[1.18rem]">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PdpSection className="py-10 sm:py-12">
        <div>
          <PdpKicker>Choose your {optionLabel.toLowerCase()} option</PdpKicker>
          <h2 className="mt-2 text-[3.8rem] font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
            <PdpWord>Choose your</PdpWord>
            <PdpWord tone="red">{`${optionLabel} option`}</PdpWord>
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {medicines.map((medicine) => {
              const config = MEDICINE_CONFIG[medicine];
              const startingPrice = Math.min(...config.doses.map((dose) => dose.pricePerMonth));

              return (
                <PdpPanel key={medicine} className="group flex min-h-[31rem] flex-col p-4 transition hover:border-red-500/80">
                  <h3 className="text-center text-[2.55rem] font-black uppercase leading-[0.95] tracking-normal text-white">
                    <PdpWord>{config.name}</PdpWord>
                  </h3>
                  <div className="mx-auto mt-4 h-px w-4/5 bg-red-600" />
                  <p className="mt-4 min-h-10 text-center font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-zinc-300">
                    {config.tagline}
                  </p>
                  <div className="relative mx-auto mt-3 aspect-square w-56 flex-1">
                    <Image
                      src={`/products/${medicine}.webp`}
                      alt={config.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                      sizes="224px"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
                    <div>
                      <p className="font-[family-name:var(--font-poppins)] text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Starting at
                      </p>
                      <p className="text-[1.55rem] font-normal uppercase leading-none tracking-[0.04em] text-red-500">
                        ${startingPrice}
                        <span className="ml-1 text-[1rem] text-zinc-400">/{priceUnit}</span>
                      </p>
                    </div>
                    <PdpButton href={`${hrefBase}/${medicine}`} className="min-h-10 px-3 text-[1.1rem]">
                      {PDP_COPY.categoryCardCta}
                    </PdpButton>
                  </div>
                </PdpPanel>
              );
            })}
          </div>
        </div>
      </PdpSection>

      <PdpSection className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-start">
          <div>
            <PdpKicker>How it works</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Getting started</PdpWord>
              <PdpWord tone="red">is simple</PdpWord>
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {PDP_PROCESS_STEPS.map((step) => (
              <PdpPanel key={step.number} className="relative min-h-52 p-4">
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center bg-red-600 text-[1.35rem] font-normal">
                  {step.number}
                </div>
                <div className="mx-auto mt-7 flex h-24 w-28 items-center justify-center">
                  <PdpIcon icon={step.icon} className="h-20 w-20" />
                </div>
                <h3 className="mt-4 text-[1.25rem] font-normal uppercase leading-[0.95] tracking-[0.035em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-poppins)] text-xs font-medium leading-snug text-zinc-400">
                  {step.body}
                </p>
              </PdpPanel>
            ))}
          </div>
        </div>
      </PdpSection>

      <section id="category-faq" className="relative overflow-hidden border-y border-red-700/70 bg-black text-white">
        <Image
          src="/assets/grunge-redesign/thin section bg.png"
          alt=""
          fill
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.44),transparent_42%),linear-gradient(90deg,rgba(0,0,0,0.86),rgba(127,29,29,0.18),rgba(0,0,0,0.86))]" />
        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
          <div>
            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Ready to start?</PdpWord>
              <PdpWord tone="red">We are here to help.</PdpWord>
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PdpButton href={heroCtaHref}>{PDP_COPY.primaryCta}</PdpButton>
            <PdpButton href="/contact" variant="dark">{PDP_COPY.secondaryCta}</PdpButton>
          </div>
        </div>
      </section>
    </div>
  );
}
