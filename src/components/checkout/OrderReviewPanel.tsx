import type { OrderConfig } from "@/lib/checkout-types";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";

interface Props {
  order: OrderConfig;
  affiliateName?: string | null;
}

export function OrderReviewPanel({ order, affiliateName }: Props) {
  const { lineItems, savings, consultFee, total } = calcOrderTotal(order);
  const config = MEDICINE_CONFIG[order.medicine];
  const renewalDose = order.selections[order.selections.length - 1];
  const renewalConfig = config.doses.find((d) => d.mg === renewalDose.mg)!;
  const renewalPrice = renewalConfig.pricePerMonth * 0.9;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Order summary
      </p>

      {/* Product badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200">
          <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-black">{config.name}</p>
          <p className="text-xs text-zinc-400 capitalize">
            {order.purchaseType} · {order.monthCount} month{order.monthCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-2">
        {lineItems.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-sm text-zinc-600">{item.label}</span>
            <span className="text-sm font-semibold text-black">${item.price.toFixed(0)}</span>
          </div>
        ))}

        {order.purchaseType === "one-time" && (
          <div className="flex justify-between border-t border-zinc-200 pt-2">
            <span className="text-sm text-zinc-500">Provider consultation</span>
            <span className="text-sm text-zinc-500">${consultFee}</span>
          </div>
        )}

        {order.purchaseType === "subscription" && savings > 0 && (
          <div className="flex justify-between border-t border-zinc-200 pt-2">
            <span className="text-xs text-zinc-500">Subscription savings (10%)</span>
            <span className="text-xs font-semibold text-black">−${savings.toFixed(0)}</span>
          </div>
        )}
      </div>

      <div className="my-4 border-t border-zinc-200" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-zinc-600">Total today</span>
        <span className="text-xl font-bold text-black">${total.toFixed(0)}</span>
      </div>

      {order.purchaseType === "subscription" && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">
            <span className="font-semibold text-black">Auto-renews</span> at{" "}
            <span className="font-semibold text-black">
              {renewalDose.mg} mg · ${renewalPrice.toFixed(0)}/mo
            </span>{" "}
            after supply ends. Cancel anytime.
          </p>
        </div>
      )}

      {order.purchaseType === "one-time" && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-xs text-zinc-500">
            Includes a $79 provider consultation. Charged only if your order is approved.
          </p>
        </div>
      )}

      {/* Affiliate attribution */}
      {affiliateName && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <span className="text-emerald-600">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <p className="text-[11px] text-emerald-800">
            Referred by <span className="font-semibold">{affiliateName}</span>
          </p>
        </div>
      )}

      {/* Trust row */}
      <div className="mt-4 space-y-1.5">
        {["SSL encrypted checkout", "HIPAA-compliant data handling", "24h provider review"].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-zinc-400">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] text-zinc-400">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
