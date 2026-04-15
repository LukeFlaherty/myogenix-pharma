"use client";

/**
 * Cart page — /cart
 * =================
 * Full-page view of all cart items. ONE checkout button covers all medicines.
 *
 * SINGLE ITEM:  encodes as ?order=<single> → /checkout (backward compat with PDP)
 * MULTIPLE ITEMS: encodes as ?batch=<array> → /checkout (multi-medicine flow)
 *
 * The checkout page accepts both param shapes and normalises to OrderConfig[]
 * before handing off to CheckoutShell — no branching needed here or there.
 *
 * After checkout, patients land on /checkout/confirmation → /portal/dashboard.
 * The portal dashboard shows a per-medicine "Complete intake" action for each
 * order with status "pending_intake", so every intake is reachable without
 * the cart needing to sequence them.
 */

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { calcOrderTotal, encodeOrder, encodeBatch } from "@/lib/order-params";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, closeDrawer, itemCount } = useCart();
  const router = useRouter();

  const grandTotal = items.reduce((sum, item) => {
    const { total } = calcOrderTotal(item.config);
    return sum + total;
  }, 0);

  function handleCheckout() {
    if (items.length === 1) {
      // Single item — use the canonical ?order= param so the checkout page
      // and any analytics can tell this came from a single-item session.
      const encoded = encodeOrder(items[0].config);
      router.push(`/checkout?order=${encoded}`);
    } else {
      // Multiple items — encode the whole batch so one checkout session covers
      // all medicines. The patient fills in patient info + payment once, then
      // their portal shows individual intake forms per medicine.
      const encoded = encodeBatch(items.map((i) => i.config));
      router.push(`/checkout?batch=${encoded}`);
    }
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <svg className="h-9 w-9 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-black">Your cart is empty</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Configure a medication program on a product page to add it to your cart.
          </p>
        </div>
        <Link
          href="/weight-management"
          className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
        >
          Browse programs →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-black">
          Your cart
          <span className="ml-2 text-base font-normal text-zinc-400">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </h1>
        <Link
          href="/weight-management"
          className="text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-black"
        >
          ← Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Item list — no per-item checkout buttons */}
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.medicine}
              item={item}
              onRemove={removeItem}
              // showCheckout intentionally omitted — checkout is unified below
            />
          ))}

          {items.length > 1 && (
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-600">Ordering multiple programs</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                All programs are purchased together in one checkout session. After payment, your patient portal will show a separate intake questionnaire for each medicine — complete them at your own pace.
              </p>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Summary
            </p>

            {/* Per-medicine line */}
            {items.map((item) => {
              const { total } = calcOrderTotal(item.config);
              return (
                <div key={item.medicine} className="flex justify-between py-1.5 text-sm">
                  <span className="capitalize text-zinc-600">{item.medicine}</span>
                  <span className="font-semibold text-black">${total.toFixed(0)}</span>
                </div>
              );
            })}

            {/* Grand total */}
            <div className="my-3 border-t border-zinc-200" />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-zinc-600">
                {items.length > 1 ? "Combined total" : "Total"}
              </span>
              <span className="text-base font-bold text-black">${grandTotal.toFixed(0)}</span>
            </div>

            {/* Single checkout button for all items */}
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-5 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              {items.length > 1
                ? `Checkout all ${items.length} programs →`
                : "Proceed to checkout →"}
            </button>

            {/* Trust items */}
            <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4">
              {[
                "Provider-reviewed within 24h",
                "Payment only captured on approval",
                "Cancel anytime",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-zinc-400">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] text-zinc-400">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
