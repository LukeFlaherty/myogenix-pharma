import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intake Complete — MyoGenix Pharma",
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

const NEXT_STEPS = [
  {
    icon: "🔍",
    title: "Provider review (within 24h)",
    body: "A licensed provider will review your intake and order. If anything needs clarification, they'll reach out by email.",
  },
  {
    icon: "📋",
    title: "Bloodwork (if applicable)",
    body: "If you're a returning patient starting above the base dose, your provider will request recent bloodwork through your patient portal. Check your email for instructions.",
  },
  {
    icon: "✅",
    title: "Approval & payment capture",
    body: "Once your order is approved, your payment is captured and your medication is sent to our compounding pharmacy.",
  },
  {
    icon: "📦",
    title: "Ships within 2–3 business days",
    body: "Shipped refrigerated in discreet packaging with a cold pack rated for 72h transit.",
  },
];

export default async function IntakeCompletePage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.orderId ?? "ORD-DEMO";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* Confirmation mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M5 14l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black">Intake submitted</h1>
          <p className="mt-2 text-base text-zinc-500">
            Your medical intake for order{" "}
            <span className="font-semibold text-black">{orderId}</span> is with our
            provider team.
          </p>
          <div className="mt-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-600">
            Confirmation sent to your email
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

        {/* Patient portal stub */}
        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="mb-1 text-sm font-bold text-black">Patient portal</p>
          <p className="mb-4 text-xs text-zinc-500">
            Track your order status, upload bloodwork, message your care team, and manage your subscription from your portal.
          </p>
          <div className="flex gap-3">
            {/*
             * TODO: Replace href with real portal URL once auth is implemented.
             * The portal should be behind authentication (NextAuth / Clerk / Auth.js).
             * Order status should be fetched server-side by orderId.
             */}
            <Link
              href="#"
              className="flex-1 rounded-xl bg-black py-3 text-center text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Go to patient portal →
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
          </a>{" "}
          or message your care team through the portal.
        </p>
      </div>
    </div>
  );
}
