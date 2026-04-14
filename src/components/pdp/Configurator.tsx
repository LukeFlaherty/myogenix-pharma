"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Medicine, PurchaseType, MonthDoseSelection } from "@/lib/pdp-types";
import { MEDICINE_CONFIG, buildDefaultSelections } from "@/lib/pdp-config";
import { encodeOrder } from "@/lib/order-params";
import { MonthSelector } from "./MonthSelector";
import { DosePicker } from "./DosePicker";
import { PurchaseTypeToggle } from "./PurchaseTypeToggle";
import { OrderSummary } from "./OrderSummary";
import { ProductHero } from "./ProductHero";
import { useCart } from "@/lib/cart-context";

interface Props {
  medicine: Medicine;
}

const COMPARE_HREF: Partial<Record<Medicine, string>> = {
  tirzepatide: "/weight-management/semaglutide",
  semaglutide: "/weight-management/tirzepatide",
};

const COMPARE_LABEL: Partial<Record<Medicine, string>> = {
  tirzepatide: "Compare with Semaglutide →",
  semaglutide: "Compare with Tirzepatide →",
};

export function Configurator({ medicine }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");
  const [monthCount, setMonthCount] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<MonthDoseSelection[]>(() =>
    buildDefaultSelections(MEDICINE_CONFIG[medicine], 1)
  );

  function handleCheckout() {
    const config = { medicine, purchaseType, monthCount, selections };
    addItem(config); // silently populate cart so the icon reflects the item
    router.push(`/checkout?order=${encodeOrder(config)}`);
  }

  const handleMonthCountChange = useCallback((months: 1 | 2 | 3) => {
    setMonthCount(months);
    setSelections((prev) => {
      const config = MEDICINE_CONFIG[medicine];
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
  }, [medicine]);

  const handleDoseChange = useCallback((month: number, mg: number) => {
    setSelections((prev) =>
      prev.map((s) => (s.month === month ? { ...s, mg } : s))
    );
  }, []);

  const config = MEDICINE_CONFIG[medicine];

  return (
    <section id="configure" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: Hero + visual + trust */}
          <div className="flex flex-col gap-8">
            <ProductHero medicine={medicine} />

            {/* Product image */}
            <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50">
              <Image
                src={`/products/${medicine}.webp`}
                alt={config.name}
                width={480}
                height={480}
                className="aspect-square w-full object-cover"
                priority
              />
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

            {/* Compare link — GLP-1s only */}
            {COMPARE_HREF[medicine] && (
              <Link
                href={COMPARE_HREF[medicine]!}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-black"
              >
                {COMPARE_LABEL[medicine]}
              </Link>
            )}
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
                    key={`${medicine}-month-${sel.month}`}
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
              medicine={medicine}
              purchaseType={purchaseType}
              selections={selections}
            />

            <button
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-black px-6 py-4 text-base font-bold text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98]"
            >
              {purchaseType === "subscription" ? "Start subscription →" : "Order one-time →"}
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
