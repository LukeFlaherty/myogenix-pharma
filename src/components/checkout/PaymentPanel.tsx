"use client";

/**
 * PaymentPanel — Stripe integration stub
 *
 * TO IMPLEMENT:
 * 1. npm install @stripe/stripe-js @stripe/react-stripe-js
 * 2. Wrap this component (or the checkout page) in <Elements stripe={stripePromise}>
 *    where stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
 * 3. Replace the fake card inputs below with <CardElement> (or <PaymentElement>
 *    for the newer Payment Element which handles all payment methods automatically)
 * 4. On submit: call stripe.createPaymentMethod({ type: 'card', card: cardElement })
 *    → send the resulting PaymentMethod ID to your server action / API route
 * 5. Server: create a Stripe Customer, then a PaymentIntent (one-time) or
 *    Subscription (recurring) using the PaymentMethod ID
 * 6. Return the client_secret → call stripe.confirmCardPayment(clientSecret)
 *    to complete 3D Secure if required
 */

import { useState } from "react";
import type { PaymentFormState } from "@/lib/checkout-types";

interface Props {
  data: PaymentFormState;
  onChange: (field: keyof PaymentFormState, value: string) => void;
  onDevSkip?: () => void;
}

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-black placeholder-zinc-400 transition-colors hover:border-zinc-400 focus:border-black focus:outline-none";

export function PaymentPanel({ data, onChange, onDevSkip }: Props) {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-base font-bold text-black">Payment</p>

      {/* Stripe badge */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-400">
          <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M1 6h12" stroke="currentColor" strokeWidth="1.25"/>
        </svg>
        <span className="text-xs text-zinc-500">
          Payments secured by{" "}
          <span className="font-semibold text-black">Stripe</span>
          {" "}· SSL encrypted
        </span>
        {/* TODO: Replace with actual Stripe logo SVG once integrating */}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Cardholder name<span className="ml-0.5 text-black">*</span>
        </label>
        <input
          className={inputCls}
          placeholder="Jane Smith"
          value={data.cardholderName}
          onChange={(e) => onChange("cardholderName", e.target.value)}
        />
      </div>

      {/*
       * ─── STRIPE ELEMENT MOUNT POINT ──────────────────────────────────────────
       * Replace the three fake inputs below with:
       *   <CardElement options={{ style: { base: { fontSize: '14px' } } }} />
       * or:
       *   <PaymentElement />
       * after wrapping the page in <Elements stripe={stripePromise} options={{ clientSecret }}>
       * ─────────────────────────────────────────────────────────────────────────
       */}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-600">
          Card number<span className="ml-0.5 text-black">*</span>
        </label>
        {/* STUB: replace with <CardNumberElement> or <CardElement> */}
        <div
          className="flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-400"
          onClick={() => setFocused("card")}
        >
          <span className="flex-1">•••• •••• •••• ••••</span>
          <div className="flex gap-1.5">
            {["💳", "🏦"].map((i) => (
              <span key={i} className="text-base">{i}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600">
            Expiry<span className="ml-0.5 text-black">*</span>
          </label>
          {/* STUB: replace with <CardExpiryElement> */}
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-400">
            MM / YY
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-600">
            CVC<span className="ml-0.5 text-black">*</span>
          </label>
          {/* STUB: replace with <CardCvcElement> */}
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-400">
            •••
          </div>
        </div>
      </div>

      {/* Dev mode notice */}
      <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-xs">🔧</span>
          <p className="text-xs text-zinc-500">
            <span className="font-semibold text-black">Dev stub.</span>{" "}
            Card fields are placeholders. Wire up{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[10px]">@stripe/react-stripe-js</code>{" "}
            and replace with{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-[10px]">&lt;PaymentElement /&gt;</code>.
          </p>
        </div>
        {onDevSkip && (
          <button
            type="button"
            onClick={onDevSkip}
            className="w-full rounded-lg border border-amber-400 bg-white py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
          >
            [Dev] Skip to confirmation →
          </button>
        )}
      </div>
    </div>
  );
}
