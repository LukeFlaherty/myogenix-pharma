"use client";

import { useCart } from "@/lib/cart-context";

export function CartIcon() {
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-zinc-100"
      aria-label={`Cart${itemCount > 0 ? ` (${itemCount} item${itemCount > 1 ? "s" : ""})` : ""}`}
    >
      {/* Shopping bag icon */}
      <svg
        className="h-5 w-5 text-zinc-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      {/* Badge */}
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
