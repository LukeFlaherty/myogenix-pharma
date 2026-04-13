import Link from "next/link";
import type { Metadata } from "next";
import { decodeOrder, defaultOrder, calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Payment Confirmed — MyoGenix Pharma",
};

interface Props {
  searchParams: Promise<{ order?: string; orderId?: string }>;
}

const NEXT_STEPS = [
  {
    icon: "📋",
    title: "Complete your medical intake",
    body: "A short questionnaire helps your assigned provider review your health history before approving the order.",
  },
  {
    icon: "🔍",
    title: "Provider review (within 24h)",
    body: "A licensed provider reviews your intake and order. If anything needs clarification they'll reach out by email.",
  },
  {
    icon: "✅",
    title: "Approval & dispatch",
    body: "Once approved, your medication is sent to our compounding pharmacy and ships within 2–3 business days.",
  },
  {
    icon: "📦",
    title: "Shipped refrigerated",
    body: "Discreet packaging with a cold pack rated for 72h transit. Tracking info sent to your email.",
  },
];

export default async function CheckoutConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = params.order ? (decodeOrder(params.order) ?? defaultOrder()) : defaultOrder();
  const orderId = params.orderId ?? "ORD-DEMO";
  const intakeHref = `/intake?order=${params.order ?? ""}&orderId=${orderId}`;

  const { lineItems, savings, consultFee, total } = calcOrderTotal(order);
  const config = MEDICINE_CONFIG[order.medicine];

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
            Your order{" "}
            <span className="font-semibold text-black">{orderId}</span> has been received.
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

          {/* Product badge */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200">
              <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-black">{config.name}</p>
              <p className="text-xs capitalize text-zinc-400">
                {order.purchaseType} · {order.monthCount} month{order.monthCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-sm text-zinc-600">{item.label}</span>
                <span className="text-sm font-semibold text-black">${item.price.toFixed(0)}</span>
              </div>
            ))}

            {order.purchaseType === "one-time" && (
              <div className="flex justify-between border-t border-zinc-200 pt-2">
                <span className="text-sm text-zinc-500">Provider consultation</span>
                <span className="text-sm text-zinc-500">${consultFee}</span>
              </div>
            )}

            {order.purchaseType === "subscription" && savings > 0 && (
              <div className="flex justify-between border-t border-zinc-200 pt-2">
                <span className="text-xs text-zinc-500">Subscription savings (10%)</span>
                <span className="text-xs font-semibold text-black">−${savings.toFixed(0)}</span>
              </div>
            )}
          </div>

          <div className="my-4 border-t border-zinc-200" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-zinc-600">Total charged</span>
            <span className="text-xl font-bold text-black">${total.toFixed(0)}</span>
          </div>
        </div>

        {/* What happens next */}
        <div className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">What happens next</p>
          {NEXT_STEPS.map((s, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5"
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-bold text-black">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — intake form (placeholder until post-checkout flow is wired) */}
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="mb-1 text-sm font-bold text-black">Ready to continue?</p>
          <p className="mb-4 text-xs text-zinc-500">
            Complete your medical intake so a provider can review and approve your order.
          </p>
          <div className="flex gap-3">
            <Link
              href={intakeHref}
              className="flex flex-1 items-center justify-center rounded-xl bg-black py-3 text-center text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Start medical intake →
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
