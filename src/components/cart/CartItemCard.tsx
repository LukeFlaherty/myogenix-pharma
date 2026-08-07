"use client";

import Image from "next/image";
import { ArrowRight, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/cart-context";
import type { Medicine } from "@/lib/pdp-types";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import { encodeOrder } from "@/lib/order-params";
import { useRouter } from "next/navigation";
import { uiFont } from "@/lib/ui-font";

interface Props {
  item: CartItem;
  onRemove: (medicine: Medicine) => void;
  /** Pass true on the full cart page to show the per-item Checkout button */
  showCheckout?: boolean;
  /** Called after navigation so the parent (drawer) can close itself */
  onCheckout?: () => void;
  compact?: boolean;
}

const MEDICINE_COLORS: Partial<Record<Medicine, string>> = {
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
    <div className="grunge-panel border border-white/15 bg-black/70 p-4 text-white shadow-[0_18px_42px_rgba(0,0,0,0.34)]">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${MEDICINE_COLORS[item.medicine] ?? "bg-zinc-800 text-zinc-300"}`}>
            {item.medicine}
          </span>
          <span className="border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            {item.config.purchaseType}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.medicine)}
          className="p-1.5 text-zinc-500 transition-colors hover:bg-red-600/15 hover:text-red-400"
          aria-label="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-[4.75rem_1fr] gap-3">
        <div className="relative aspect-square border border-white/10 bg-white/[0.03]">
          <Image
            src={`/products/${item.medicine}.webp`}
            alt={config.name}
            fill
            className="object-contain p-2 drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]"
            sizes="76px"
          />
        </div>
        <div>
          <p className={`${uiFont.className} text-[1.75rem] uppercase leading-[0.9] tracking-[0.035em] text-white`}>
            {config.name}
          </p>
          <p className="mt-1 font-[family-name:var(--font-poppins)] text-[11px] leading-snug text-zinc-500">
            {item.config.monthCount} month{item.config.monthCount > 1 ? "s" : ""} configured. Provider review required before fulfillment.
          </p>
        </div>
      </div>

      {/* Line items */}
      <div className={`space-y-1 ${compact ? "" : "mb-3"}`}>
        {lineItems.map((line, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">{line.label}</span>
            <span className="shrink-0 text-xs font-semibold text-zinc-100">${line.price.toFixed(0)}</span>
          </div>
        ))}
        {item.config.purchaseType === "one-time" && (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">Provider consultation</span>
            <span className="shrink-0 text-xs font-semibold text-zinc-100">${consultFee}</span>
          </div>
        )}
        {item.config.purchaseType === "subscription" && savings > 0 && (
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500">Subscription savings</span>
            <span className="shrink-0 text-xs font-semibold text-red-400">-${savings.toFixed(0)}</span>
          </div>
        )}
      </div>

      {/* Divider + total */}
      <div className="my-3 border-t border-white/10" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Total today</p>
          <p className={`${uiFont.className} text-[1.8rem] uppercase leading-none text-white`}>${total.toFixed(0)}</p>
        </div>

        {showCheckout && (
          <button
            type="button"
            onClick={handleCheckout}
            className={`${uiFont.className} inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-[1.15rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500`}
          >
            Checkout
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
