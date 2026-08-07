import Image from "next/image";
import type { ReactNode } from "react";
import {
  PdpButton,
  PdpCheckLine,
  PdpKicker,
  PdpPanel,
  PdpSection,
  PdpWord,
} from "@/components/pdp/PdpDesignSystem";
import { uiFont } from "@/lib/ui-font";
import { cn } from "@/lib/utils";

const ASSET_BASE = "/assets/grunge-redesign";

export function SupplementalHero({
  eyebrow,
  title,
  accent,
  body,
  image = `${ASSET_BASE}/pharma support staff tp bg.png`,
  imageAlt = "",
  visual,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  image?: string;
  imageAlt?: string;
  visual?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-red-700/70 bg-black text-white">
      <Image
        src={`${ASSET_BASE}/hero bg.png`}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.93)_0%,rgba(0,0,0,0.66)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.7)_100%)]" />
      <div className="relative mx-auto grid min-h-[430px] max-w-6xl items-end gap-5 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.58fr)] lg:px-8">
        <div className="pb-4 text-center lg:text-left">
          <PdpKicker className="text-white">{eyebrow}</PdpKicker>
          <h1 className="mx-auto mt-3 max-w-[43rem] text-[5.2rem] font-black uppercase leading-[0.84] tracking-normal sm:text-[6.6rem] lg:mx-0 lg:text-[7.7rem]">
            <PdpWord>{title}</PdpWord>
            <PdpWord tone="red">{accent}</PdpWord>
          </h1>
          <p className={`${uiFont.className} mx-auto mt-4 max-w-[38rem] text-[1.9rem] font-normal uppercase leading-[0.98] tracking-[0.035em] text-zinc-100 sm:text-[2.25rem] lg:mx-0`}>
            {body}
          </p>
        </div>
        <div className="relative flex min-h-[260px] items-end justify-center lg:min-h-[360px] lg:justify-end">
          {visual ?? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_32px_55px_rgba(0,0,0,0.75)]"
              sizes="(max-width: 1024px) 100vw, 430px"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export function SupplementalIntro({
  kicker,
  title,
  accent,
  body,
  checks,
}: {
  kicker: string;
  title: string;
  accent: string;
  body: string;
  checks?: string[];
}) {
  return (
    <PdpSection className="py-10 sm:py-12">
      <div className="grid gap-7 lg:grid-cols-[0.58fr_1fr] lg:items-start">
        <div>
          <PdpKicker>{kicker}</PdpKicker>
          <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
            <PdpWord>{title}</PdpWord>
            <PdpWord tone="red">{accent}</PdpWord>
          </h2>
        </div>
        <div>
          <p className="font-[family-name:var(--font-poppins)] text-base font-medium leading-relaxed text-zinc-300">
            {body}
          </p>
          {checks && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {checks.map((item) => (
                <PdpCheckLine key={item} className="text-[1.25rem] leading-tight">
                  {item}
                </PdpCheckLine>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PdpSection>
  );
}

export function SupplementalGrid({
  kicker,
  title,
  accent,
  items,
}: {
  kicker: string;
  title: string;
  accent: string;
  items: { title: string; body: string; icon?: string }[];
}) {
  return (
    <PdpSection className="py-10 sm:py-12">
      <div>
        <PdpKicker>{kicker}</PdpKicker>
        <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
          <PdpWord>{title}</PdpWord>
          <PdpWord tone="red">{accent}</PdpWord>
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PdpPanel key={item.title} className="min-h-48 p-5">
              {item.icon && (
                <Image
                  src={`${ASSET_BASE}/${item.icon}`}
                  alt=""
                  width={46}
                  height={46}
                  className="mb-5 h-12 w-12 object-contain opacity-90"
                />
              )}
              <h3 className={`${uiFont.className} text-[1.55rem] font-normal uppercase leading-none tracking-[0.045em] text-white`}>
                {item.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
                {item.body}
              </p>
            </PdpPanel>
          ))}
        </div>
      </div>
    </PdpSection>
  );
}

export function LegalSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PdpPanel className={cn("p-5", className)}>
      <h2 className={`${uiFont.className} text-[1.8rem] font-normal uppercase leading-none tracking-[0.045em] text-white`}>
        {title}
      </h2>
      <div className="mt-4 space-y-3 font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
        {children}
      </div>
    </PdpPanel>
  );
}

export function SupplementalCta({
  title,
  accent,
  body,
  href = "/contact",
  label = "Contact us",
}: {
  title: string;
  accent: string;
  body: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-red-700/70 bg-black text-white">
      <Image
        src={`${ASSET_BASE}/thin section bg.png`}
        alt=""
        fill
        className="object-cover opacity-70"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.38),transparent_42%),linear-gradient(90deg,rgba(0,0,0,0.86),rgba(127,29,29,0.18),rgba(0,0,0,0.86))]" />
      <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
        <div>
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
            <PdpWord>{title}</PdpWord>
            <PdpWord tone="red">{accent}</PdpWord>
          </h2>
          <p className="mt-4 font-[family-name:var(--font-poppins)] text-base font-medium leading-relaxed text-zinc-300">
            {body}
          </p>
        </div>
        <div className="flex lg:justify-end">
          <PdpButton href={href} className="w-full sm:w-auto">
            {label}
          </PdpButton>
        </div>
      </div>
    </section>
  );
}
