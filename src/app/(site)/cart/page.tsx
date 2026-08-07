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
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { calcOrderTotal, encodeOrder, encodeBatch } from "@/lib/order-params";
import { useRouter } from "next/navigation";
import { uiFont } from "@/lib/ui-font";

export default function CartPage() {
  const { items, removeItem, itemCount } = useCart();
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
      <div className="relative min-h-[70vh] overflow-hidden bg-black px-4 py-16 text-center text-white">
        <Image
          src="/assets/grunge-redesign/grunge black section bg blank.png"
          alt=""
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.28),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.88))]" />
        <div className="relative mx-auto flex max-w-xl flex-col items-center justify-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center border border-red-600/60 bg-red-600/10">
            <ShoppingCart className="h-9 w-9 text-red-400" />
          </div>
          <div>
            <h1 className={`${uiFont.className} text-[3rem] uppercase leading-none tracking-[0.045em] text-white sm:text-[4rem]`}>
              Your cart is empty
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Configure a medication program on a product page to add it to your cart.
            </p>
          </div>
          <Link
            href="/weight-management"
            className={`${uiFont.className} inline-flex items-center gap-2 bg-red-600 px-6 py-3 text-[1.35rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500`}
          >
            Browse programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Image
        src="/assets/grunge-redesign/grunge black section bg blank.png"
        alt=""
        fill
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_4%,rgba(220,38,38,0.26),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.34),rgba(0,0,0,0.92))]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 border-b border-red-700/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`${uiFont.className} text-[1.25rem] uppercase tracking-[0.24em] text-red-500`}>
            Review programs
          </p>
          <h1 className={`${uiFont.className} mt-1 text-[4rem] uppercase leading-none tracking-[0.035em] text-white sm:text-[5.5rem]`}>
            Your cart
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {itemCount} {itemCount === 1 ? "program" : "programs"} ready for checkout.
          </p>
        </div>
        <Link
          href="/weight-management"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 underline underline-offset-4 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
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
            <div className="border border-red-900/70 bg-black/55 p-4">
              <p className={`${uiFont.className} text-[1.4rem] uppercase leading-none tracking-[0.045em] text-white`}>
                Ordering multiple programs
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                All programs are purchased together in one checkout session. After payment, your patient portal will show a separate intake questionnaire for each medicine.
              </p>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="grunge-panel border border-white/15 bg-black/72 p-5 shadow-[0_22px_55px_rgba(0,0,0,0.4)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-red-400">
              Summary
            </p>

            {/* Per-medicine line */}
            {items.map((item) => {
              const { total } = calcOrderTotal(item.config);
              return (
                <div key={item.medicine} className="flex justify-between py-1.5 text-sm">
                  <span className="capitalize text-zinc-400">{item.medicine}</span>
                  <span className="font-semibold text-white">${total.toFixed(0)}</span>
                </div>
              );
            })}

            {/* Grand total */}
            <div className="my-3 border-t border-white/10" />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-zinc-400">
                {items.length > 1 ? "Combined total" : "Total"}
              </span>
              <span className={`${uiFont.className} text-[2rem] uppercase leading-none text-white`}>${grandTotal.toFixed(0)}</span>
            </div>

            {/* Single checkout button for all items */}
            <button
              type="button"
              onClick={handleCheckout}
              className={`${uiFont.className} mt-5 flex w-full items-center justify-center gap-2 bg-red-600 py-3 text-[1.35rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500`}
            >
              {items.length > 1
                ? `Checkout all ${items.length} programs`
                : "Proceed to checkout"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Trust items */}
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
              {[
                "Provider-reviewed within 24h",
                "Payment only captured on approval",
                "Cancel anytime",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-red-400" />
                  <span className="text-[11px] text-zinc-500">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
