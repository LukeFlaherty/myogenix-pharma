"use client";

import { type CSSProperties, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Medicine, MonthDoseSelection, PurchaseType } from "@/lib/pdp-types";
import {
  MEDICINE_CONFIG,
  MONTH_LABEL,
  SUBSCRIPTION_DISCOUNT,
  buildDefaultSelections,
  getNextRecommendedDose,
} from "@/lib/pdp-config";
import {
  PDP_CARE_FEATURES,
  PDP_COPY,
  PDP_FAQS,
  PDP_PROCESS_STEPS,
} from "@/lib/pdp-design-config";
import { encodeOrder } from "@/lib/order-params";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import {
  PdpButton,
  PdpCheckLine,
  PdpIcon,
  PdpKicker,
  PdpPanel,
  PdpSection,
  PdpWord,
} from "./PdpDesignSystem";

interface Props {
  medicine: Medicine;
}

const MONTH_OPTIONS: { value: 1 | 2 | 3; label: string; sublabel: string }[] = [
  { value: 1, label: "1 month", sublabel: "Single supply" },
  { value: 2, label: "2 months", sublabel: "Escalation pair" },
  { value: 3, label: "3 months", sublabel: "Most popular" },
];

function splitBenefit(benefit: string) {
  return benefit
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function Configurator({ medicine }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const config = MEDICINE_CONFIG[medicine];

  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");
  const [monthCount, setMonthCount] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<MonthDoseSelection[]>(() =>
    buildDefaultSelections(config, 1)
  );

  const benefits = useMemo(() => splitBenefit(config.benefit), [config.benefit]);

  const lineItems = selections.map((sel) => {
    const dose = config.doses.find((d) => d.mg === sel.mg)!;
    const finalPrice =
      purchaseType === "subscription"
        ? dose.pricePerMonth * (1 - SUBSCRIPTION_DISCOUNT)
        : dose.pricePerMonth;
    return {
      label: `${MONTH_LABEL[sel.month - 1]} - ${dose.label}`,
      finalPrice,
      basePrice: dose.pricePerMonth,
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.basePrice, 0);
  const medicineTotal = lineItems.reduce((sum, item) => sum + item.finalPrice, 0);
  const savings = subtotal - medicineTotal;
  const consultFee = purchaseType === "one-time" ? config.consultFee : 0;
  const total = medicineTotal + consultFee;
  const renewalSelection = selections[selections.length - 1];
  const renewalDose = config.doses.find((dose) => dose.mg === renewalSelection.mg)!;
  const renewalPrice = renewalDose.pricePerMonth * (1 - SUBSCRIPTION_DISCOUNT);

  function handleCheckout() {
    const orderConfig = { medicine, purchaseType, monthCount, selections };
    addItem(orderConfig);
    router.push(`/checkout?order=${encodeOrder(orderConfig)}`);
  }

  const handleMonthCountChange = useCallback((months: 1 | 2 | 3) => {
    setMonthCount(months);
    setSelections((prev) => {
      if (months <= prev.length) return prev.slice(0, months);

      const lastMg = prev[prev.length - 1].mg;
      const extra = buildDefaultSelections(config, months - prev.length, lastMg);
      return [
        ...prev,
        ...extra.map((item, index) => ({
          month: prev.length + 1 + index,
          mg: item.mg,
        })),
      ];
    });
  }, [config]);

  const handleDoseChange = useCallback((month: number, mg: number) => {
    setSelections((prev) =>
      prev.map((selection) =>
        selection.month === month ? { ...selection, mg } : selection
      )
    );
  }, []);

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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.68)_45%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.7)_100%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-8">
          <div className="flex flex-col justify-end pb-2 text-center lg:text-left">
            <PdpKicker className="text-white" style={{ "--kicker-size": "0.87rem" } as CSSProperties}>
              Provider-reviewed weight management
            </PdpKicker>
            <h1 className="mx-auto mt-3 max-w-[31rem] text-[3.85rem] font-black uppercase leading-[0.86] tracking-normal sm:text-[4.4rem] lg:mx-0 lg:text-[4.85rem]">
              <PdpWord tone="red">{config.name}</PdpWord>
              <PdpWord>Weight Management</PdpWord>
            </h1>
            <p className="mx-auto mt-4 max-w-[31rem] text-[1.55rem] font-normal uppercase leading-[0.98] tracking-[0.035em] text-zinc-100 sm:text-[1.9rem] lg:mx-0">
              {config.tagline}
              <span className="block text-red-500">{config.genericName}</span>
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <PdpButton onClick={handleCheckout} className="w-full max-w-[23rem] sm:w-auto sm:max-w-none">
                {PDP_COPY.primaryCta}
              </PdpButton>
              <PdpButton href="/contact" variant="dark" className="w-full max-w-[23rem] sm:w-auto sm:max-w-none">
                {PDP_COPY.secondaryCta}
              </PdpButton>
            </div>
          </div>

          <div className="relative min-h-[320px] lg:min-h-[440px]">
            <Image
              src={`/products/${medicine}.webp`}
              alt={config.name}
              fill
              priority
              className="object-contain drop-shadow-[0_32px_55px_rgba(0,0,0,0.75)]"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      <PdpSection id="configure" className="py-6 sm:py-7">
        <PdpPanel className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:p-6">
          <div>
            <PdpKicker>Build your plan</PdpKicker>
            <div className="mt-5 grid max-w-3xl gap-4">
              <div className="grid gap-3 lg:grid-cols-[10rem_1fr] lg:items-center">
                <p className="text-[1.35rem] font-normal uppercase leading-none tracking-[0.045em] text-zinc-100">
                  1. Purchase type
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      value: "subscription" as const,
                      label: "Subscribe",
                      sublabel: "Save 10%. Cancel anytime.",
                    },
                    {
                      value: "one-time" as const,
                      label: "One-time",
                      sublabel: `Includes $${config.consultFee} consult.`,
                    },
                  ].map((option) => {
                    const isSelected = purchaseType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPurchaseType(option.value)}
                        className={cn(
                          "min-h-14 border px-3 py-2 text-center transition",
                          isSelected
                            ? "border-red-500 bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.28)]"
                            : "border-white/25 bg-black/45 text-zinc-200 hover:border-red-500/80"
                        )}
                      >
                        <span className="block text-[1.14rem] font-normal uppercase leading-none tracking-[0.045em]">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-[family-name:var(--font-poppins)] text-[0.68rem] font-medium text-zinc-300">
                          {option.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[10rem_1fr] lg:items-center">
                <p className="text-[1.35rem] font-normal uppercase leading-none tracking-[0.045em] text-zinc-100">
                  2. Timeline
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_OPTIONS.map((option) => {
                    const isSelected = monthCount === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleMonthCountChange(option.value)}
                        className={cn(
                          "min-h-14 border px-2 py-2 text-center transition",
                          isSelected
                            ? "border-red-500 bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.28)]"
                            : "border-white/25 bg-black/45 text-zinc-200 hover:border-red-500/80"
                        )}
                      >
                        <span className="block text-[1.08rem] font-normal uppercase leading-none tracking-[0.045em]">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-[family-name:var(--font-poppins)] text-[0.66rem] font-medium text-zinc-300">
                          {option.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[10rem_1fr]">
                <p className="text-[1.35rem] font-normal uppercase leading-none tracking-[0.045em] text-zinc-100">
                  3. Dose path
                </p>
                <div className="grid gap-3">
                  {selections.map((selection, index) => {
                    const recommendedMg =
                      index === 0
                        ? config.startingDose
                        : getNextRecommendedDose(config, selections[index - 1].mg);
                    const selectedDose = config.doses.find((dose) => dose.mg === selection.mg)!;
                    return (
                      <PdpPanel key={selection.month} className="p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[1.15rem] font-normal uppercase leading-none tracking-[0.045em] text-white">
                            {MONTH_LABEL[selection.month - 1]}
                          </p>
                          <span className="font-[family-name:var(--font-poppins)] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                            {index === 0 ? "Starting dose" : `Recommended: ${config.doses.find((dose) => dose.mg === recommendedMg)?.label}`}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {config.doses.map((dose) => {
                            const isSelected = dose.mg === selection.mg;
                            const isRecommended = dose.mg === recommendedMg && index > 0;
                            return (
                              <button
                                key={dose.mg}
                                type="button"
                                onClick={() => handleDoseChange(selection.month, dose.mg)}
                                className={cn(
                                  "min-h-10 border px-2 py-2 text-[1rem] font-normal uppercase leading-none tracking-[0.045em] transition",
                                  isSelected
                                    ? "border-red-500 bg-red-600 text-white"
                                    : isRecommended
                                      ? "border-white/35 bg-white/10 text-zinc-100 hover:border-red-500/80"
                                      : "border-white/20 bg-black/35 text-zinc-300 hover:border-red-500/80"
                                )}
                              >
                                {dose.label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 font-[family-name:var(--font-poppins)] text-[0.7rem] leading-snug text-zinc-500">
                          {selectedDose.mg} mg/month ={" "}
                          <span className="font-semibold text-zinc-300">
                            {selectedDose.mg / 4 % 1 === 0
                              ? selectedDose.mg / 4
                              : (selectedDose.mg / 4).toFixed(2)} mg/week
                          </span>
                          {" "}across 4 injections.
                        </p>
                      </PdpPanel>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <PdpPanel className="p-4 lg:p-5">
            <p className="font-[family-name:var(--font-poppins)] text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Dosing determined by licensed provider.
            </p>
            <h2 className="mt-3 text-[1.38rem] font-normal uppercase leading-[0.98] tracking-[0.05em] text-white">
              {PDP_COPY.reviewHeading}
              <span className="block text-red-500">{PDP_COPY.reviewBody}</span>
            </h2>
            <ul className="mt-4 grid gap-2">
              {["Safe. effective. supported.", "Prescription required", "Reviewed by licensed provider", "Shipped to your door"].map((item) => (
                <PdpCheckLine key={item} className="text-[1rem]" iconClassName="h-4 w-4">
                  {item}
                </PdpCheckLine>
              ))}
            </ul>
            <div className="mt-5 border-t border-white/15 pt-4">
              <div className="grid gap-2">
                {lineItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 font-[family-name:var(--font-poppins)] text-sm text-zinc-300">
                    <span>{item.label}</span>
                    <span className="font-semibold text-white">${item.finalPrice.toFixed(0)}</span>
                  </div>
                ))}
                {purchaseType === "one-time" && (
                  <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-2 font-[family-name:var(--font-poppins)] text-sm text-zinc-400">
                    <span>Provider consultation</span>
                    <span>${consultFee}</span>
                  </div>
                )}
                {purchaseType === "subscription" && savings > 0 && (
                  <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-2 font-[family-name:var(--font-poppins)] text-xs text-zinc-400">
                    <span>Subscription savings</span>
                    <span className="font-semibold text-red-500">-${savings.toFixed(0)}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
                <span className="text-[1.35rem] font-normal uppercase tracking-[0.045em] text-zinc-200">Total today</span>
                <span className="text-[2.4rem] font-normal leading-none text-white">${total.toFixed(0)}</span>
              </div>
              {purchaseType === "subscription" && (
                <p className="mt-3 font-[family-name:var(--font-poppins)] text-xs leading-relaxed text-zinc-400">
                  Renews at {renewalDose.label} - ${renewalPrice.toFixed(0)}/mo after your supply ends. Cancel anytime.
                </p>
              )}
            </div>
            <PdpButton onClick={handleCheckout} className="mt-5 w-full">
              {PDP_COPY.primaryCta}
            </PdpButton>
          </PdpPanel>
        </PdpPanel>
      </PdpSection>

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
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr]">
          <div>
            <PdpKicker>Choose your starting point</PdpKicker>
            <h2 className="mt-2 text-[4.2rem] font-black uppercase leading-[0.88] tracking-normal sm:text-6xl">
              <PdpWord>{renewalDose.label}</PdpWord>
              <PdpWord tone="red">{MONTH_OPTIONS.find((option) => option.value === monthCount)?.label ?? "1 month"}</PdpWord>
            </h2>
            <p className="mt-4 max-w-md font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-zinc-300">
              {config.description}
            </p>
          </div>

          <div className="grid gap-3 pt-7 sm:grid-cols-3">
            {MONTH_OPTIONS.map((option) => {
              const isSelected = option.value === monthCount;
              const isRecommended = option.value === 3;
              return (
                <PdpPanel
                  key={option.value}
                  className={cn(
                    "relative p-4 transition",
                    isSelected && "border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.24)]",
                    isRecommended && "border-red-600"
                  )}
                >
                  {isRecommended && (
                    <div className="absolute left-1/2 top-[-1.7rem] w-32 -translate-x-1/2 bg-red-600 px-3 py-1 text-center text-[1rem] font-normal uppercase tracking-[0.06em] text-white">
                      Popular
                    </div>
                  )}
                  <h3 className="mt-3 text-center text-[2rem] font-normal uppercase leading-none tracking-[0.045em] text-white">
                    {option.label}
                  </h3>
                  <p className="mt-1 text-center text-[1.08rem] font-normal uppercase leading-none tracking-[0.045em] text-zinc-300">
                    {option.sublabel}
                  </p>
                  <ul className="mt-5 grid gap-2 border-y border-white/15 py-4">
                    {benefits.map((benefit) => (
                      <PdpCheckLine key={benefit} className="text-[1rem]" iconClassName="h-[12px] w-[12px]">
                        {benefit}
                      </PdpCheckLine>
                    ))}
                  </ul>
                  <div className="mt-4 grid gap-2 border-t border-white/15 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[0.86rem] font-normal uppercase tracking-[0.06em] text-zinc-400">Start</p>
                      <p className="text-right text-[1.05rem] font-normal uppercase leading-tight tracking-[0.045em] text-red-500">
                        {config.doses[0].label}
                      </p>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[0.86rem] font-normal uppercase tracking-[0.06em] text-zinc-400">Duration</p>
                      <p className="text-right text-[1.05rem] font-normal uppercase leading-tight tracking-[0.045em] text-red-500">
                        {option.label}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMonthCountChange(option.value)}
                    className="mt-4 min-h-11 w-full bg-red-600 px-3 py-2 text-[1.18rem] font-normal uppercase leading-none tracking-[0.055em] text-white transition hover:bg-red-500"
                  >
                    {PDP_COPY.selectPlanCta}
                  </button>
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

      <PdpSection id="faq" className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.62fr_1fr]">
          <div>
            <PdpKicker>Support</PdpKicker>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
              <PdpWord>Fast answers.</PdpWord>
              <PdpWord tone="red">Guided support.</PdpWord>
            </h2>
            <p className="mt-4 max-w-sm font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-zinc-300">
              {PDP_COPY.supportBody}
            </p>
          </div>
          <div className="grid gap-3">
            {PDP_FAQS.map((faq) => (
              <details key={faq.q} className="group border-2 border-white/20 bg-black/35">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="text-[1.22rem] font-normal uppercase tracking-[0.04em] text-zinc-200 sm:text-[1.35rem]">
                    {faq.q}
                  </span>
                  <span className="text-xl font-black text-white transition group-open:rotate-45">+</span>
                </summary>
                <p className="border-t border-white/10 px-4 pb-4 pt-3 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-zinc-300">
                  {faq.a}
                </p>
              </details>
            ))}
            <div className="grid gap-3 border-t border-red-700/70 pt-5 sm:grid-cols-2">
              <PdpButton onClick={handleCheckout}>{PDP_COPY.primaryCta}</PdpButton>
              <PdpButton href="/contact" variant="dark">{PDP_COPY.secondaryCta}</PdpButton>
            </div>
            <p className="text-center font-[family-name:var(--font-poppins)] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {PDP_COPY.disclaimer}
            </p>
          </div>
        </div>
      </PdpSection>
    </div>
  );
}
