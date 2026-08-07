"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { encodeOrder } from "@/lib/order-params";
import { uiFont } from "@/lib/ui-font";
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
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
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
        className={`absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col overflow-hidden border-l border-red-700/70 bg-black text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Image
          src="/assets/grunge-redesign/thin section bg.png"
          alt=""
          fill
          className="object-cover opacity-45"
          sizes="480px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.72),rgba(0,0,0,0.94)),radial-gradient(circle_at_20%_10%,rgba(220,38,38,0.26),transparent_36%)]" />

        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between border-b border-red-700/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-red-600/70 bg-red-600/15 text-red-400">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <div>
              <p className={`${uiFont.className} text-[1.7rem] uppercase leading-none tracking-[0.045em] text-white`}>
                Your cart
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-[11px] text-zinc-500">
                Provider-reviewed programs
              </p>
            </div>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center bg-red-600 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="relative flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center border border-red-600/50 bg-red-600/10">
                <ShoppingCart className="h-7 w-7 text-red-400" />
              </div>
              <div>
                <p className={`${uiFont.className} text-[1.7rem] uppercase leading-none text-white`}>Your cart is empty</p>
                <p className="mt-1 text-xs text-zinc-500">Configure a medication program to get started.</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className={`${uiFont.className} border border-red-600/70 bg-red-600 px-5 py-2 text-[1.25rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500`}
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
                <div className="border border-red-900/70 bg-black/55 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-400">
                    Batch checkout ready
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    One checkout covers all {items.length} programs. Your portal will separate the medical intake by medicine.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="relative shrink-0 space-y-2.5 border-t border-red-700/70 bg-black/72 px-5 py-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
              Authorized now. Captured after provider approval.
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className={`${uiFont.className} flex w-full items-center justify-center gap-2 bg-red-600 py-3 text-[1.45rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500`}
            >
              {items.length === 1 ? "Proceed to checkout" : "View cart to checkout"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className={`${uiFont.className} w-full border border-white/20 py-3 text-[1.25rem] uppercase leading-none tracking-[0.045em] text-zinc-300 transition-colors hover:border-white/50 hover:text-white`}
            >
              Continue shopping
            </button>
            {items.length > 1 && (
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block text-center text-xs text-zinc-500 underline underline-offset-2 hover:text-white"
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
