"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "join" | "active";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
      {children}
    </p>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-sm text-zinc-600">{children}</span>
    </li>
  );
}

// ─── Join tab ────────────────────────────────────────────────────────────────

function JoinTab() {
  return (
    <div className="space-y-10">

      {/* Hero block */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-8 py-10 text-center">
        <span className="mb-4 inline-block rounded-full border border-zinc-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Retail Partner Program
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Earn 10% on every sale.<br className="hidden sm:block" /> No inventory. No hassle.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-500">
          Partner with MyoGenix Pharma as an in-store affiliate. We provide a
          branded QR sign — your customers scan, order, and you earn. Payouts
          land on the last business day of every month.
        </p>
        <a
          href="mailto:partners@myogenixpharma.com?subject=Affiliate%20Program%20Inquiry"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-black px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
        >
          Apply now →
        </a>
        <p className="mt-3 text-xs text-zinc-400">
          We respond within 1–2 business days.
        </p>
      </div>

      {/* How it works */}
      <div>
        <SectionHeader>How it works</SectionHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Contact us",
              body: "Send us a quick email with your store name and location. We'll confirm eligibility and get you set up in 24–48 hours.",
            },
            {
              step: "02",
              title: "Get your sign",
              body: "We ship you a branded QR code sign — framed, ready to hang. Your unique store code is embedded in the QR URL so every scan is tracked to you.",
            },
            {
              step: "03",
              title: "Hang it up & earn",
              body: "Put the sign anywhere with foot traffic. When a customer scans, orders, and pays, you earn 10% of the order total. Payouts processed monthly.",
            },
          ].map((item) => (
            <Card key={item.step}>
              <span className="mb-3 block text-3xl font-bold text-zinc-200">{item.step}</span>
              <p className="mb-1.5 font-bold text-black">{item.title}</p>
              <p className="text-sm leading-relaxed text-zinc-500">{item.body}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Why partner */}
      <div>
        <SectionHeader>Why retail partners choose MyoGenix</SectionHeader>
        <Card>
          <ul className="space-y-4">
            <CheckItem>
              <strong>10% commission</strong> on every completed order — one of the highest rates in the compounded pharmaceutical space.
            </CheckItem>
            <CheckItem>
              <strong>Monthly payouts</strong> on the last business day of each month. No minimum threshold.
            </CheckItem>
            <CheckItem>
              <strong>Zero inventory or fulfillment.</strong> We handle all ordering, provider review, compounding, and shipping. You just hang a sign.
            </CheckItem>
            <CheckItem>
              <strong>30-day attribution window.</strong> If a customer scans your QR code and converts any time in the next 30 days, that sale is credited to you.
            </CheckItem>
            <CheckItem>
              <strong>No upfront cost.</strong> The QR sign is provided free of charge to approved partners.
            </CheckItem>
            <CheckItem>
              <strong>High-demand products.</strong> GLP-1 weight management and compounded peptides are among the fastest-growing categories in wellness retail.
            </CheckItem>
          </ul>
        </Card>
      </div>

      {/* Good fit */}
      <div>
        <SectionHeader>Who is this a good fit for?</SectionHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Vitamin & supplement shops",
            "Fitness centers & gyms",
            "Wellness clinics & med spas",
            "Chiropractic & physical therapy offices",
            "Naturopathic & integrative health practices",
            "Health food stores",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              <span className="text-sm text-zinc-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="text-center">
        <h3 className="mb-2 text-lg font-bold text-black">Ready to get started?</h3>
        <p className="mx-auto mb-6 max-w-sm text-sm text-zinc-500">
          Email us with your store name, location, and a brief description of your business.
          We'll take it from there.
        </p>
        <a
          href="mailto:partners@myogenixpharma.com?subject=Affiliate%20Program%20Inquiry"
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
        >
          partners@myogenixpharma.com →
        </a>
      </Card>
    </div>
  );
}

// ─── Active affiliate tab ─────────────────────────────────────────────────────

function ActiveTab() {
  return (
    <div className="space-y-10">

      {/* How your link works */}
      <div>
        <SectionHeader>How your QR code works</SectionHeader>
        <Card>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600">
            Your QR code links to our site with your store's unique identifier in the URL:
          </p>
          <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-700">
            https://myogenixpharma.com<span className="font-bold text-black">?store=yourstorename</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600">
            When a customer scans the code, we record a <strong>30-day attribution window</strong>.
            If they place and pay for an order anytime within those 30 days — even if they leave and come back later —
            the sale is credited to your store. They don't need to scan again.
          </p>
        </Card>
      </div>

      {/* Payout structure */}
      <div>
        <SectionHeader>Payout structure</SectionHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Commission rate",
              value: "10%",
              sub: "of the gross order total",
            },
            {
              label: "Payout schedule",
              value: "Monthly",
              sub: "last business day of each month",
            },
            {
              label: "Attribution window",
              value: "30 days",
              sub: "from first scan to order placement",
            },
          ].map((item) => (
            <Card key={item.label} className="text-center">
              <p className="text-3xl font-bold text-black">{item.value}</p>
              <p className="mt-1 text-xs font-semibold text-zinc-600">{item.label}</p>
              <p className="mt-1 text-[11px] text-zinc-400">{item.sub}</p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-400">
          Commissions are calculated on completed orders only (provider-approved and paid).
          Denied or refunded orders are not commissioned.
        </p>
      </div>

      {/* Payout example */}
      <div>
        <SectionHeader>Example payout calculation</SectionHeader>
        <Card>
          <div className="space-y-3">
            {[
              { label: "Customer orders Tirzepatide (3 months, subscription)", amount: "$879" },
              { label: "Your commission (10%)", amount: "$87.90", highlight: true },
            ].map((row) => (
              <div key={row.label} className={`flex items-center justify-between rounded-xl px-4 py-3 ${row.highlight ? "bg-black" : "bg-zinc-50"}`}>
                <span className={`text-sm ${row.highlight ? "font-semibold text-white" : "text-zinc-600"}`}>{row.label}</span>
                <span className={`text-sm font-bold ${row.highlight ? "text-white" : "text-black"}`}>{row.amount}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            If you referred 10 such orders in a month, your payout would be <strong className="text-zinc-700">$879.00</strong>.
            Payouts are sent via ACH, Venmo, or check — whichever you prefer.
          </p>
        </Card>
      </div>

      {/* What qualifies */}
      <div>
        <SectionHeader>What qualifies for commission</SectionHeader>
        <Card>
          <ul className="space-y-4">
            <CheckItem>
              Any order placed within 30 days of the customer's first scan of your QR code.
            </CheckItem>
            <CheckItem>
              Subscription and one-time orders both qualify. Subscription orders earn commission on the first payment only.
            </CheckItem>
            <CheckItem>
              The customer's order must be provider-approved and paid before commission is recognized.
            </CheckItem>
            <CheckItem>
              If a customer scans multiple affiliate QR codes, the most recent scan within 30 days takes attribution.
            </CheckItem>
          </ul>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <SectionHeader>Common questions</SectionHeader>
        <div className="space-y-3">
          {[
            {
              q: "When do I get paid?",
              a: "Payouts are processed on the last business day of each month. You'll receive a summary of all attributed conversions and the payout amount.",
            },
            {
              q: "Can I have more than one QR code sign?",
              a: "Yes — if you have multiple locations or high-traffic areas in one store, contact us and we'll send additional signs. Each sign uses the same store code.",
            },
            {
              q: "What if my QR code sign gets damaged?",
              a: "Email us and we'll send a replacement free of charge. Your store code and attribution history are not affected.",
            },
            {
              q: "How do I check my attribution stats?",
              a: "A self-serve affiliate dashboard is in development. For now, email us and we'll send a conversion report for your store any time.",
            },
            {
              q: "Can I share my store link online (social media, email, etc.)?",
              a: "Yes! Your link works anywhere. Print it, post it, or share it digitally — any conversion within 30 days of a click counts.",
            },
          ].map((item) => (
            <Card key={item.q}>
              <p className="mb-1.5 text-sm font-semibold text-black">{item.q}</p>
              <p className="text-sm leading-relaxed text-zinc-500">{item.a}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact */}
      <Card className="text-center">
        <p className="mb-1 text-sm font-semibold text-black">Questions about your account?</p>
        <p className="mb-4 text-xs text-zinc-500">We respond within 1 business day.</p>
        <a
          href="mailto:partners@myogenixpharma.com"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-50"
        >
          partners@myogenixpharma.com →
        </a>
      </Card>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AffiliatesContent() {
  const [tab, setTab] = useState<Tab>("join");

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black">Affiliate Program</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Affiliate Program
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            Partner with MyoGenix Pharma — earn 10% on every conversion.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-10 flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => setTab("join")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              tab === "join"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            I want to be an affiliate
          </button>
          <button
            type="button"
            onClick={() => setTab("active")}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              tab === "active"
                ? "bg-black text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            I&apos;m already an affiliate
          </button>
        </div>

        {/* Tab content */}
        {tab === "join" ? <JoinTab /> : <ActiveTab />}
      </div>
    </>
  );
}
