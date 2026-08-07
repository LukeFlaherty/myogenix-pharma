/**
 * OrderReviewPanel
 * ================
 * Sticky sidebar shown during checkout. Accepts an array of OrderConfigs so
 * it can display one medicine or many from a single checkout session.
 */

import { Check, ShieldCheck, Syringe } from "lucide-react";
import type { OrderConfig } from "@/lib/checkout-types";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import { uiFont } from "@/lib/ui-font";

interface Props {
  orders: OrderConfig[];
  affiliateName?: string | null;
}

export function OrderReviewPanel({ orders, affiliateName }: Props) {
  const grandTotal = orders.reduce((sum, order) => {
    const { total } = calcOrderTotal(order);
    return sum + total;
  }, 0);

  const isSingle = orders.length === 1;

  return (
    <div className="grunge-panel border border-white/15 bg-black/72 p-6 text-white shadow-[0_22px_55px_rgba(0,0,0,0.4)]">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-red-400">
        Order summary
      </p>

      <div className="space-y-5">
        {orders.map((order, idx) => {
          const config = MEDICINE_CONFIG[order.medicine];
          const { lineItems, savings, consultFee, total } = calcOrderTotal(order);
          const renewalDose = order.selections[order.selections.length - 1];
          const renewalConfig = config.doses.find((d) => d.mg === renewalDose.mg)!;
          const renewalPrice = renewalConfig.pricePerMonth * 0.9;

          return (
            <div key={idx} className={!isSingle && idx > 0 ? "border-t border-white/10 pt-5" : ""}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-red-600/60 bg-red-600/10">
                  <Syringe className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className={`${uiFont.className} text-[1.45rem] uppercase leading-none tracking-[0.035em] text-white`}>
                    {config.name}
                  </p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {order.purchaseType} · {order.monthCount} month{order.monthCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                {lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-500">{item.label}</span>
                    <span className="shrink-0 text-xs font-semibold text-zinc-100">${item.price.toFixed(0)}</span>
                  </div>
                ))}
                {order.purchaseType === "one-time" && (
                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-500">Provider consultation</span>
                    <span className="shrink-0 text-xs text-zinc-300">${consultFee}</span>
                  </div>
                )}
                {order.purchaseType === "subscription" && savings > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-500">Subscription savings (10%)</span>
                    <span className="shrink-0 text-xs font-semibold text-red-400">-${savings.toFixed(0)}</span>
                  </div>
                )}
              </div>

              {!isSingle && (
                <div className="mt-2 flex justify-between border-t border-white/10 pt-2">
                  <span className="text-xs font-semibold text-zinc-400">{config.name} subtotal</span>
                  <span className="text-sm font-bold text-white">${total.toFixed(0)}</span>
                </div>
              )}

              {isSingle && (
                <>
                  <div className="my-4 border-t border-white/10" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-zinc-400">Total today</span>
                    <span className={`${uiFont.className} text-[2.15rem] uppercase leading-none text-white`}>
                      ${total.toFixed(0)}
                    </span>
                  </div>
                  {order.purchaseType === "subscription" && (
                    <div className="mt-4 border border-red-900/70 bg-red-950/20 p-3">
                      <p className="text-xs text-zinc-500">
                        <span className="font-semibold text-white">Auto-renews</span> at{" "}
                        <span className="font-semibold text-white">
                          {renewalDose.mg} mg · ${renewalPrice.toFixed(0)}/mo
                        </span>{" "}
                        after supply ends. Cancel anytime.
                      </p>
                    </div>
                  )}
                  {order.purchaseType === "one-time" && (
                    <div className="mt-4 border border-red-900/70 bg-red-950/20 p-3">
                      <p className="text-xs text-zinc-500">
                        Includes a $79 provider consultation. Charged only if your order is approved.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {!isSingle && (
        <>
          <div className="my-4 border-t-2 border-red-700/70" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-zinc-400">Total today</span>
            <span className={`${uiFont.className} text-[2.15rem] uppercase leading-none text-white`}>
              ${grandTotal.toFixed(0)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Covers all {orders.length} programs. Payment authorized now, captured only when each order is provider-approved.
          </p>
        </>
      )}

      {affiliateName && (
        <div className="mt-4 flex items-center gap-2 border border-red-600/40 bg-red-600/10 px-3 py-2">
          <Check className="h-3 w-3 text-red-400" />
          <p className="text-[11px] text-zinc-400">
            Referred by <span className="font-semibold text-white">{affiliateName}</span>
          </p>
        </div>
      )}

      <div className="mt-4 space-y-1.5">
        {["SSL encrypted checkout", "HIPAA-compliant data handling", "24h provider review"].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-red-400" />
            <span className="text-[11px] text-zinc-500">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
