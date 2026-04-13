"use client";

/**
 * Cart page — /cart
 *
 * Full-page view of cart items. Each item has its own Checkout button that
 * takes the user to /checkout?order=<encoded> for that specific medicine config.
 *
 * Multi-item note: a patient should only proceed through checkout with one
 * medicine at a time. The per-item Checkout buttons enforce this naturally.
 */

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { calcOrderTotal } from "@/lib/order-params";

export default function CartPage() {
  const { items, removeItem, closeDrawer, itemCount } = useCart();

  const grandTotal = items.reduce((sum, item) => {
    const { total } = calcOrderTotal(item.config);
    return sum + total;
  }, 0);

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
        {/* Item list */}
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.medicine}
              item={item}
              onRemove={removeItem}
              showCheckout
              onCheckout={closeDrawer}
            />
          ))}

          {items.length > 1 && (
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-600">Ordering multiple programs</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Each medication program requires a separate checkout and provider review. Use the Checkout button on each program card to start that order.
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

            {items.map((item) => {
              const { total } = calcOrderTotal(item.config);
              return (
                <div key={item.medicine} className="flex justify-between py-1.5 text-sm">
                  <span className="capitalize text-zinc-600">{item.medicine}</span>
                  <span className="font-semibold text-black">${total.toFixed(0)}</span>
                </div>
              );
            })}

            {items.length > 1 && (
              <>
                <div className="my-3 border-t border-zinc-200" />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-zinc-600">Combined total</span>
                  <span className="text-base font-bold text-black">${grandTotal.toFixed(0)}</span>
                </div>
              </>
            )}

            <div className="mt-5 space-y-2">
              {items.length === 1 ? (
                <CartItemCard
                  item={items[0]}
                  onRemove={removeItem}
                  showCheckout
                  onCheckout={closeDrawer}
                  compact
                />
              ) : (
                <p className="text-center text-xs text-zinc-400">
                  Use the Checkout button on each program card above.
                </p>
              )}
            </div>

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
