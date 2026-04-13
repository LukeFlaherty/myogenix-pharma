"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { encodeOrder } from "@/lib/order-params";
import { CartItemCard } from "./CartItemCard";

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, removeItem, itemCount } = useCart();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (drawerOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  function handleCheckout() {
    if (items.length === 1) {
      const encoded = encodeOrder(items[0].config);
      closeDrawer();
      router.push(`/checkout?order=${encoded}`);
    } else {
      closeDrawer();
      router.push("/cart");
    }
  }

  return (
    // Portal-like: always in the DOM, invisible when closed
    <div
      className={`fixed inset-0 z-50 ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!drawerOpen}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-black">Your cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Your cart is empty</p>
                <p className="mt-1 text-xs text-zinc-500">Configure a medication program to get started.</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
              >
                Browse programs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.medicine}
                  item={item}
                  onRemove={removeItem}
                  compact
                />
              ))}

              {items.length > 1 && (
                <p className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
                  You have {items.length} programs in your cart. Proceed to the cart page to check out each one individually.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="shrink-0 space-y-2.5 border-t border-zinc-100 px-5 py-5">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              {items.length === 1 ? "Proceed to checkout →" : "View cart to checkout →"}
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="w-full rounded-2xl border border-zinc-200 py-3.5 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
            >
              Continue shopping
            </button>
            {items.length > 1 && (
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block text-center text-xs text-zinc-400 underline underline-offset-2 hover:text-black"
              >
                View full cart
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
