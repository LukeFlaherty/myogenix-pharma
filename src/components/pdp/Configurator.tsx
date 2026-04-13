"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Medicine, PurchaseType, MonthDoseSelection } from "@/lib/pdp-types";
import { MEDICINE_CONFIG, buildDefaultSelections } from "@/lib/pdp-config";
import { encodeOrder } from "@/lib/order-params";
import { MonthSelector } from "./MonthSelector";
import { DosePicker } from "./DosePicker";
import { PurchaseTypeToggle } from "./PurchaseTypeToggle";
import { OrderSummary } from "./OrderSummary";
import { ProductHero } from "./ProductHero";

interface Props {
  defaultMedicine?: Medicine;
}

const COMPARE_HREF: Record<Medicine, string> = {
  tirzepatide: "/weight-management/semaglutide",
  semaglutide: "/weight-management/tirzepatide",
};

const COMPARE_LABEL: Record<Medicine, string> = {
  tirzepatide: "Compare with Semaglutide →",
  semaglutide: "Compare with Tirzepatide →",
};

export function Configurator({ defaultMedicine = "tirzepatide" }: Props) {
  const router = useRouter();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");
  const [monthCount, setMonthCount] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<MonthDoseSelection[]>(() =>
    buildDefaultSelections(MEDICINE_CONFIG[defaultMedicine], 1)
  );

  function handleCheckout() {
    const encoded = encodeOrder({
      medicine: defaultMedicine,
      purchaseType,
      monthCount,
      selections,
    });
    router.push(`/checkout?order=${encoded}`);
  }

  const handleMonthCountChange = useCallback((months: 1 | 2 | 3) => {
    setMonthCount(months);
    setSelections((prev) => {
      const config = MEDICINE_CONFIG[defaultMedicine];
      if (months <= prev.length) {
        return prev.slice(0, months);
      }
      const lastMg = prev[prev.length - 1].mg;
      const extra = buildDefaultSelections(config, months - prev.length, lastMg);
      return [
        ...prev,
        ...extra.map((e, i) => ({ month: prev.length + 1 + i, mg: e.mg })),
      ];
    });
  }, [defaultMedicine]);

  const handleDoseChange = useCallback((month: number, mg: number) => {
    setSelections((prev) =>
      prev.map((s) => (s.month === month ? { ...s, mg } : s))
    );
  }, []);

  const config = MEDICINE_CONFIG[defaultMedicine];

  return (
    <section id="configure" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: Hero + visual + trust */}
          <div className="flex flex-col gap-8">
            <ProductHero medicine={defaultMedicine} />

            {/* Product visual */}
            <div className="relative flex aspect-square max-w-xs items-center justify-center overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-200">
                  <svg
                    className="h-12 w-12 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122m-7.5 0A2.25 2.25 0 007.5 13.5m7.5-2.257a2.25 2.25 0 01-.659 1.591L10.5 17M10.5 17l3.75 3.75M10.5 17l-3.75 3.75"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-zinc-700">{config.name}</p>
                <p className="text-xs text-zinc-400">Compounded injectable</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏥", label: "Licensed providers", sub: "Board-certified MDs" },
                { icon: "🧪", label: "Compounded in USA", sub: "FDA-registered facility" },
                { icon: "🚚", label: "Free shipping", sub: "Discreet packaging" },
                { icon: "💬", label: "Ongoing support", sub: "Message your care team" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                >
                  <span className="text-lg">{badge.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-black">{badge.label}</p>
                    <p className="text-[11px] text-zinc-400">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare link */}
            <Link
              href={COMPARE_HREF[defaultMedicine]}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-black"
            >
              {COMPARE_LABEL[defaultMedicine]}
            </Link>
          </div>

          {/* Right: Configurator */}
          <div className="flex flex-col gap-6">
            <PurchaseTypeToggle
              value={purchaseType}
              onChange={setPurchaseType}
              consultFee={config.consultFee}
            />
            <MonthSelector value={monthCount} onChange={handleMonthCountChange} />

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Configure your doses
              </p>
              <div className="flex flex-col gap-3">
                {selections.map((sel, i) => (
                  <DosePicker
                    key={`${defaultMedicine}-month-${sel.month}`}
                    month={sel.month}
                    selectedMg={sel.mg}
                    prevMonthMg={i === 0 ? null : selections[i - 1].mg}
                    config={config}
                    onChange={(mg) => handleDoseChange(sel.month, mg)}
                  />
                ))}
              </div>
            </div>

            <OrderSummary
              medicine={defaultMedicine}
              purchaseType={purchaseType}
              selections={selections}
            />

            <button
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-black px-6 py-4 text-base font-bold text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98]"
            >
              {purchaseType === "subscription"
                ? "Start subscription →"
                : "Order one-time →"}
            </button>

            <p className="text-center text-xs text-zinc-400">
              {purchaseType === "subscription"
                ? "By subscribing, you authorize recurring charges at your renewal dose price. Cancel anytime."
                : "Your order is reviewed by a licensed provider within 24 hours."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
