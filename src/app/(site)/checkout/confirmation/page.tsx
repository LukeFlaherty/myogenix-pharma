/**
 * Checkout confirmation page
 * ==========================
 * Shown after payment is authorised. Accepts:
 *
 *   ?batch=<encoded>   — the OrderConfig[] (for displaying medicine names + pricing)
 *   ?orderIds=<ids>    — comma-separated order IDs generated server-side
 *
 * Legacy single-order params are also supported for backwards compatibility:
 *   ?order=<encoded>&orderId=<id>
 *
 * THE PRIMARY CTA IS THE PATIENT PORTAL.
 * Intake forms are no longer launched directly from here. Instead, the portal
 * dashboard shows a per-medicine "Complete intake" action card for every order
 * with status "pending_intake". This lets patients complete each intake at
 * their own pace and makes it clear when there are multiple forms to fill.
 *
 * TO UPGRADE:
 *   Once real order IDs come from the DB, the confirmation page can fetch
 *   order details server-side rather than decoding them from URL params.
 *   Replace decodeBatch(params.batch) with:
 *     const orders = await db.order.findMany({ where: { id: { in: orderIds } } });
 */

import Link from "next/link";
import type { Metadata } from "next";
import { decodeBatch, decodeOrder, calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import type { OrderConfig } from "@/lib/checkout-types";

export const metadata: Metadata = {
  title: "Payment Confirmed — MyoGenix Pharma",
};

interface Props {
  searchParams: Promise<{
    batch?: string;
    orderIds?: string;
    // legacy single-order params
    order?: string;
    orderId?: string;
  }>;
}

export default async function CheckoutConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;

  // ── Resolve orders and IDs ──────────────────────────────────────────────────
  let orders: OrderConfig[];
  let orderIds: string[];

  if (params.batch && params.orderIds) {
    orders = decodeBatch(params.batch) ?? [];
    orderIds = params.orderIds.split(",").filter(Boolean);
  } else if (params.order && params.orderId) {
    // Legacy single-order path (from PDP direct checkout)
    const single = decodeOrder(params.order);
    orders = single ? [single] : [];
    orderIds = [params.orderId];
  } else {
    orders = [];
    orderIds = ["ORD-DEMO"];
  }

  const isSingle = orders.length === 1;
  const grandTotal = orders.reduce((sum, o) => sum + calcOrderTotal(o).total, 0);

  const primaryOrderId = orderIds[0] ?? "ORD-DEMO";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-20">

        {/* Hero */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 14l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black">Payment confirmed</h1>
          <p className="mt-2 text-base text-zinc-500">
            {isSingle ? (
              <>
                Order <span className="font-semibold text-black">{primaryOrderId}</span> has been received.
              </>
            ) : (
              <>
                <span className="font-semibold text-black">{orders.length} programs</span> have been ordered successfully.
              </>
            )}
          </p>
          <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-600">
            Confirmation sent to your email
          </div>
        </div>

        {/* Order summary card */}
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Order summary
          </p>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const config = MEDICINE_CONFIG[order.medicine];
                const { lineItems, savings, consultFee, total } = calcOrderTotal(order);
                const orderId = orderIds[idx] ?? `ORD-${idx + 1}`;

                return (
                  <div
                    key={idx}
                    className={idx > 0 ? "border-t border-zinc-200 pt-4" : ""}
                  >
                    {/* Product badge */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-200">
                        <svg className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{config.name}</p>
                        <p className="text-xs capitalize text-zinc-400">
                          {order.purchaseType} · {order.monthCount} month{order.monthCount > 1 ? "s" : ""} · {orderId}
                        </p>
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="space-y-1.5">
                      {lineItems.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-sm text-zinc-600">{item.label}</span>
                          <span className="text-sm font-semibold text-black">${item.price.toFixed(0)}</span>
                        </div>
                      ))}
                      {order.purchaseType === "one-time" && (
                        <div className="flex justify-between">
                          <span className="text-sm text-zinc-500">Provider consultation</span>
                          <span className="text-sm text-zinc-500">${consultFee}</span>
                        </div>
                      )}
                      {order.purchaseType === "subscription" && savings > 0 && (
                        <div className="flex justify-between">
                          <span className="text-xs text-zinc-500">Subscription savings (10%)</span>
                          <span className="text-xs font-semibold text-black">−${savings.toFixed(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Per-medicine subtotal in multi-order view */}
                    {!isSingle && (
                      <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2">
                        <span className="text-xs font-semibold text-zinc-500">{config.name} subtotal</span>
                        <span className="text-sm font-bold text-black">${total.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="my-2 border-t border-zinc-300" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-zinc-600">Total authorized</span>
                <span className="text-xl font-bold text-black">${grandTotal.toFixed(0)}</span>
              </div>
              {!isSingle && (
                <p className="mt-1 text-[11px] text-zinc-400">
                  Payment is authorized now and captured separately for each program when provider-approved.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Order details unavailable.</p>
          )}
        </div>

        {/* What happens next */}
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">What happens next</p>

          {[
            {
              icon: "📋",
              title: isSingle
                ? "Complete your medical intake"
                : `Complete ${orders.length} medical intake forms`,
              body: isSingle
                ? "A short questionnaire helps your provider review your health history before approving the order. Start it from your patient portal."
                : `Each program requires its own intake questionnaire. Your portal shows a separate "Complete intake" card for each one — fill them out at your own pace.`,
            },
            {
              icon: "🔍",
              title: "Provider review (within 24h per order)",
              body: "A licensed provider reviews each intake and order independently. If anything needs clarification they'll reach out by email.",
            },
            {
              icon: "✅",
              title: "Approval & dispatch",
              body: "Once each order is approved, payment is captured and your medication is sent to our compounding pharmacy.",
            },
            {
              icon: "📦",
              title: "Ships refrigerated",
              body: "Discreet packaging with a cold pack rated for 72h transit. Tracking info sent to your email for each shipment.",
            },
          ].map((s, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-bold text-black">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Portal CTA */}
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="mb-1 text-sm font-bold text-black">Go to your patient portal</p>
          <p className="mb-4 text-xs leading-relaxed text-zinc-500">
            Your portal shows your intake forms, order status, provider messages, and shipping updates — all in one place.
            {!isSingle && " Each program has its own intake card waiting for you."}
          </p>
          <div className="flex gap-3">
            {/*
             * TODO: Replace /portal/dashboard href with a login-gated redirect
             * once Auth.js / Clerk is wired up. The portal should authenticate
             * the patient by email from the order's patient row.
             */}
            <Link
              href="/portal/dashboard"
              className="flex flex-1 items-center justify-center rounded-xl bg-black py-3 text-center text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Open patient portal →
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:border-zinc-400 hover:text-black"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-zinc-400">
          Questions? Email{" "}
          <a href="mailto:support@myogenixpharma.com" className="font-semibold text-black">
            support@myogenixpharma.com
          </a>
        </p>
      </div>
    </div>
  );
}
