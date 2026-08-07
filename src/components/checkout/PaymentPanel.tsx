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
import { CreditCard, LockKeyhole, ShieldCheck, Wrench } from "lucide-react";
import type { PaymentFormState } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";
import { uiFont } from "@/lib/ui-font";

interface Props {
  data: PaymentFormState;
  onChange: (field: keyof PaymentFormState, value: string) => void;
  onDevSkip?: () => void;
}

const inputCls =
  "w-full border border-white/15 bg-black/55 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/30 focus:border-red-500 focus:outline-none";

export function PaymentPanel({ data, onChange, onDevSkip }: Props) {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="grunge-panel space-y-4 border border-white/15 bg-black/72 p-5 text-white shadow-[0_22px_55px_rgba(0,0,0,0.34)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center border border-red-600/60 bg-red-600/10 text-red-400">
          <CreditCard className="h-4 w-4" />
        </span>
        <div>
          <p className={`${uiFont.className} text-[1.8rem] uppercase leading-none tracking-[0.045em] text-white`}>
            Payment
          </p>
          <p className="text-[11px] text-zinc-500">Authorized today, captured after provider approval.</p>
        </div>
      </div>

      {/* Stripe badge */}
      <div className="flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-red-400" />
        <span className="text-xs text-zinc-400">
          Payments secured by{" "}
          <span className="font-semibold text-white">Stripe</span>
          {" "}· SSL encrypted
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400">
          Cardholder name<span className="ml-0.5 text-red-500">*</span>
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
        <label className="text-xs font-semibold text-zinc-400">
          Card number<span className="ml-0.5 text-red-500">*</span>
        </label>
        {/* STUB: replace with <CardNumberElement> or <CardElement> */}
        <div
          className={cn(
            "flex items-center border bg-black/55 px-4 py-3 text-sm text-zinc-600 transition-colors",
            focused === "card" ? "border-red-500" : "border-white/15"
          )}
          onClick={() => setFocused("card")}
        >
          <span className="flex-1">0000 0000 0000 0000</span>
          <div className="flex gap-1.5 text-zinc-500">
            <CreditCard className="h-4 w-4" />
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400">
            Expiry<span className="ml-0.5 text-red-500">*</span>
          </label>
          {/* STUB: replace with <CardExpiryElement> */}
          <div className="border border-white/15 bg-black/55 px-4 py-3 text-sm text-zinc-600">
            MM / YY
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400">
            CVC<span className="ml-0.5 text-red-500">*</span>
          </label>
          {/* STUB: replace with <CardCvcElement> */}
          <div className="border border-white/15 bg-black/55 px-4 py-3 text-sm text-zinc-600">
            000
          </div>
        </div>
      </div>

      {/* Dev mode notice */}
      <div className="flex flex-col gap-3 border border-red-900/70 bg-red-950/20 p-3">
        <div className="flex items-start gap-2">
          <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
          <p className="text-xs leading-relaxed text-zinc-400">
            <span className="font-semibold text-white">Dev stub.</span>{" "}
            Card fields are placeholders. Wire up{" "}
            <code className="bg-black/50 px-1 py-0.5 font-mono text-[10px] text-zinc-200">@stripe/react-stripe-js</code>{" "}
            and replace with{" "}
            <code className="bg-black/50 px-1 py-0.5 font-mono text-[10px] text-zinc-200">&lt;PaymentElement /&gt;</code>.
          </p>
        </div>
        {onDevSkip && (
          <button
            type="button"
            onClick={onDevSkip}
            className={`${uiFont.className} w-full border border-red-600/70 bg-black/40 py-2 text-[1.1rem] uppercase leading-none tracking-[0.045em] text-red-300 transition-colors hover:bg-red-600 hover:text-white`}
          >
            Dev skip to confirmation
          </button>
        )}
      </div>
    </div>
  );
}
