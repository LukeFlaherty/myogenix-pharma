"use client";

import { cn } from "@/lib/utils";
import type { PurchaseType } from "@/lib/pdp-types";

interface Props {
  value: PurchaseType;
  onChange: (type: PurchaseType) => void;
  consultFee: number;
}

export function PurchaseTypeToggle({ value, onChange, consultFee }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Purchase type
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange("subscription")}
          className={cn(
            "flex-1 rounded-xl border p-4 text-left transition-all duration-150",
            value === "subscription"
              ? "border-black bg-zinc-100 shadow-[0_0_0_1px_black]"
              : "border-zinc-200 bg-white hover:border-zinc-400"
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">Subscribe</p>
            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
              Save 10%
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Auto-renews at your final month&apos;s dose. Cancel anytime.
          </p>
        </button>

        <button
          onClick={() => onChange("one-time")}
          className={cn(
            "flex-1 rounded-xl border p-4 text-left transition-all duration-150",
            value === "one-time"
              ? "border-black bg-zinc-100 shadow-[0_0_0_1px_black]"
              : "border-zinc-200 bg-white hover:border-zinc-400"
          )}
        >
          <p className="text-sm font-semibold text-black">One-time</p>
          <p className="mt-1 text-xs text-zinc-500">
            Includes ${consultFee} provider consult fee.
          </p>
        </button>
      </div>
    </div>
  );
}
