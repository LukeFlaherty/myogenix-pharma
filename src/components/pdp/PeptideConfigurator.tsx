"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PeptideMedicine } from "@/lib/pdp-types";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import { encodeOrder } from "@/lib/order-params";
import { useCart } from "@/lib/cart-context";
import { ProductHero } from "./ProductHero";
import { cn } from "@/lib/utils";

interface Props {
  medicine: PeptideMedicine;
}

const BOTTLE_OPTIONS = [1, 2, 3] as const;
type BottleCount = (typeof BOTTLE_OPTIONS)[number];

const BOTTLE_LABEL: Record<BottleCount, string> = {
  1: "1 vial",
  2: "2 vials",
  3: "3 vials",
};

// ~30–60 day supply per vial depending on dosing protocol
const SUPPLY_LABEL: Record<BottleCount, string> = {
  1: "~30 day supply",
  2: "~60 day supply",
  3: "~90 day supply",
};

export function PeptideConfigurator({ medicine }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const config = MEDICINE_CONFIG[medicine];

  const [selectedDoseMg, setSelectedDoseMg] = useState(config.startingDose);
  const [bottleCount, setBottleCount] = useState<BottleCount>(1);

  const selectedDose = config.doses.find((d) => d.mg === selectedDoseMg)!;
  const subtotal = selectedDose.pricePerMonth * bottleCount;
  const total = subtotal + config.consultFee;

  const handleCheckout = useCallback(() => {
    const orderConfig = {
      medicine,
      purchaseType: "one-time" as const,
      monthCount: bottleCount,
      selections: Array.from({ length: bottleCount }, (_, i) => ({
        month: i + 1,
        mg: selectedDoseMg,
      })),
    };
    addItem(orderConfig);
    router.push(`/checkout?order=${encodeOrder(orderConfig)}`);
  }, [medicine, bottleCount, selectedDoseMg, addItem, router]);

  return (
    <section id="configure" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Left: Hero + image + trust */}
          <div className="flex flex-col gap-8">
            <ProductHero medicine={medicine} />

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
                { icon: "❄️", label: "Cold-chain shipping", sub: "Refrigerated, discreet" },
                { icon: "🔬", label: "Pharmaceutical grade", sub: "COA available on request" },
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
          </div>

          {/* Right: Configurator */}
          <div className="flex flex-col gap-6">

            {/* Vial size selector */}
            {config.doses.length > 1 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Select vial strength
                </p>
                <div className="flex flex-col gap-2">
                  {config.doses.map((dose) => {
                    const isSelected = dose.mg === selectedDoseMg;
                    return (
                      <button
                        key={dose.mg}
                        type="button"
                        onClick={() => setSelectedDoseMg(dose.mg)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all",
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border-2",
                            isSelected ? "border-white bg-white" : "border-zinc-300"
                          )}>
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-black" />
                            )}
                          </span>
                          <span className="text-sm font-semibold">{dose.label}</span>
                        </div>
                        <span className={cn(
                          "text-sm font-bold",
                          isSelected ? "text-white" : "text-black"
                        )}>
                          ${dose.pricePerMonth}/vial
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottle quantity */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                How many vials?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {BOTTLE_OPTIONS.map((n) => {
                  const isSelected = n === bottleCount;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setBottleCount(n)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-2xl border py-3.5 text-center transition-all",
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                      )}
                    >
                      <span className="text-sm font-bold">{BOTTLE_LABEL[n]}</span>
                      <span className={cn(
                        "text-[10px]",
                        isSelected ? "text-zinc-300" : "text-zinc-400"
                      )}>
                        {SUPPLY_LABEL[n]}
                      </span>
                    </button>
                  );
                })}
              </div>
              {bottleCount > 1 && (
                <p className="mt-2 text-[11px] text-zinc-400">
                  Ordering multiple vials at once ensures uninterrupted supply throughout your protocol.
                </p>
              )}
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Order summary
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">
                    {bottleCount} × {selectedDose.label}
                  </span>
                  <span className="text-sm font-semibold text-black">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                  <span className="text-sm text-zinc-500">Provider consultation</span>
                  <span className="text-sm text-zinc-500">${config.consultFee}</span>
                </div>
              </div>

              <div className="my-4 border-t border-zinc-200" />

              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-zinc-700">Total today</span>
                <span className="text-2xl font-bold text-black">${total}</span>
              </div>

              <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3">
                <p className="text-xs text-zinc-500">
                  A licensed provider reviews your order before it ships. The consult fee is non-refundable once your order is approved.
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-black px-6 py-4 text-base font-bold text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.98]"
            >
              Order now →
            </button>

            <p className="text-center text-xs text-zinc-400">
              Your order is reviewed by a licensed provider within 24 hours. No auto-renewals — this is a one-time purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
