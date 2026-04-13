"use client";

import type { CartItem } from "@/lib/cart-context";
import type { Medicine } from "@/lib/pdp-types";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import { encodeOrder } from "@/lib/order-params";
import { useRouter } from "next/navigation";

interface Props {
  item: CartItem;
  onRemove: (medicine: Medicine) => void;
  /** Pass true on the full cart page to show the per-item Checkout button */
  showCheckout?: boolean;
  /** Called after navigation so the parent (drawer) can close itself */
  onCheckout?: () => void;
  compact?: boolean;
}

const MEDICINE_COLORS: Record<Medicine, string> = {
  tirzepatide: "bg-zinc-900 text-white",
  semaglutide: "bg-zinc-200 text-zinc-800",
};

export function CartItemCard({ item, onRemove, showCheckout, onCheckout, compact }: Props) {
  const router = useRouter();
  const config = MEDICINE_CONFIG[item.medicine];
  const { lineItems, savings, consultFee, total } = calcOrderTotal(item.config);

  function handleCheckout() {
    const encoded = encodeOrder(item.config);
    onCheckout?.();
    router.push(`/checkout?order=${encoded}`);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${MEDICINE_COLORS[item.medicine]}`}>
            {item.medicine}
          </span>
          <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-zinc-500">
            {item.config.purchaseType}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.medicine)}
          className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Remove from cart"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Medicine name */}
      <p className="mb-2 text-sm font-bold text-black">{config.name}</p>

      {/* Line items */}
      <div className={`space-y-1 ${compact ? "" : "mb-3"}`}>
        {lineItems.map((line, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">{line.label}</span>
            <span className="shrink-0 text-xs font-semibold text-black">${line.price.toFixed(0)}</span>
          </div>
        ))}
        {item.config.purchaseType === "one-time" && (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">Provider consultation</span>
            <span className="shrink-0 text-xs font-semibold text-black">${consultFee}</span>
          </div>
        )}
        {item.config.purchaseType === "subscription" && savings > 0 && (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">Subscription savings</span>
            <span className="shrink-0 text-xs font-semibold text-black">−${savings.toFixed(0)}</span>
          </div>
        )}
      </div>

      {/* Divider + total */}
      <div className="my-2.5 border-t border-zinc-100" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-zinc-400">Total</p>
          <p className="text-base font-bold text-black">${total.toFixed(0)}</p>
        </div>

        {showCheckout && (
          <button
            type="button"
            onClick={handleCheckout}
            className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-800"
          >
            Checkout →
          </button>
        )}
      </div>
    </div>
  );
}
