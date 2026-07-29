import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo Instructions | MyoGenix Pharma",
  robots: { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-zinc-200 py-8 first:pt-0 last:border-0">
      <h2 className="mb-4 text-xl font-bold text-black">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-600">{children}</div>
    </section>
  );
}

function Card({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-black"
    >
      <p className="font-mono text-xs font-semibold text-zinc-400">{href}</p>
      <p className="mt-1 font-bold text-black">{title}</p>
      <p className="mt-1 text-xs text-zinc-500">{children}</p>
    </Link>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-black">
      {children}
    </code>
  );
}

export default function DemoInstructionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
        Internal — not linked from the public site
      </p>
      <h1 className="mb-3 text-3xl font-bold text-black">Demo Instructions</h1>
      <p className="mb-10 text-sm leading-relaxed text-zinc-600">
        This build is a fully-clickable front-end demo of the MyoGenix Pharma site. Every flow below
        works end-to-end in the browser, but nothing is wired to a real database, payment processor,
        or auth provider yet — see &ldquo;What&apos;s stubbed&rdquo; at the bottom for the exact list.
      </p>

      <Section title="Storefront">
        <p>Browse the marketing site and product pages — fully functional, no login required.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card href="/" title="Home page">
            Category cards, featured peptides, photo-based &ldquo;how it works&rdquo;.
          </Card>
          <Card href="/weight-management" title="Weight management">
            GLP-1 category landing page.
          </Card>
          <Card href="/weight-management/tirzepatide" title="Tirzepatide PDP">
            Dose picker + subscription configurator.
          </Card>
          <Card href="/weight-management/semaglutide" title="Semaglutide PDP">
            Same configurator, different dosing ladder.
          </Card>
          <Card href="/peptides" title="Peptides catalog">
            Wolverine, Tesamorelin, Klow, Glow, and general peptide bottle products.
          </Card>
          <Card href="/affiliates" title="Affiliate program">
            Public affiliate signup / info page.
          </Card>
        </div>
      </Section>

      <Section title="Cart & checkout">
        <p>
          Add one or more products to the cart (GLP-1 subscriptions and/or peptide bottles can be
          combined in a single order), then check out.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <Code>/cart</Code> — review items, quantities, and remove products before checkout.
          </li>
          <li>
            <Code>/checkout</Code> — enter any shipping details (not validated against a real
            address service) and a payment card (payment fields are cosmetic only — no card is
            charged; enter any values).
          </li>
          <li>
            Discount code: enter <Code>WELCOME10</Code> at checkout for 10% off — it&apos;s the only
            code that currently validates.
          </li>
          <li>
            A <span className="font-semibold text-black">&ldquo;skip payment (dev)&rdquo;</span>{" "}
            button on the payment step jumps straight to the confirmation page if you just want to
            see the order-confirmation UI.
          </li>
          <li>
            <Code>/checkout/confirmation</Code> — order summary + a link into the patient portal
            for that order.
          </li>
        </ul>
      </Section>

      <Section title="Intake questionnaire">
        <p>
          Reached automatically after checkout for prescription products. Multi-step medical
          intake including a peptide-history step. Submission does not persist anywhere yet — it
          just advances to a completion screen.
        </p>
        <Card href="/intake" title="Intake flow">
          Start the multi-step questionnaire directly.
        </Card>
      </Section>

      <Section title="Patient portal">
        <p>
          Real login isn&apos;t wired up yet, so the login screen has a{" "}
          <span className="font-semibold text-black">dev bypass</span> button that logs you in as
          a mock patient (&ldquo;Alex Johnson&rdquo;) with sample orders already in progress.
        </p>
        <Card href="/portal/login" title="Patient login">
          Click &ldquo;Enter portal as Alex Johnson (stub)&rdquo; — no credentials needed.
        </Card>
        <p>
          Once in, explore the dashboard and order detail pages (
          <Code>/portal/dashboard</Code>, <Code>/portal/orders</Code>). &ldquo;Messages&rdquo; and
          &ldquo;Settings&rdquo; nav items are placeholders and show a &ldquo;Soon&rdquo; badge.
        </p>
      </Section>

      <Section title="Admin / operations portal">
        <p>
          Same dev-bypass pattern, but with a choice of three staff roles so you can see role-gated
          views:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-semibold text-black">Admin</span> (Jordan Rivera) — full access:
            dashboard, all orders, patients, product management.
          </li>
          <li>
            <span className="font-semibold text-black">Provider</span> (Dr. Sarah Mills) — review
            queue, approve/deny orders.
          </li>
          <li>
            <span className="font-semibold text-black">Pharmacy</span> — mark orders
            shipped/delivered.
          </li>
        </ul>
        <Card href="/admin/login" title="Admin login">
          Pick a role to enter — no credentials needed.
        </Card>
        <p>
          Try approving/denying an order, or editing a product under{" "}
          <Code>/admin/products</Code> — changes persist for the life of the server process only
          (they reset on redeploy/restart).
        </p>
      </Section>

      <Section title="Affiliate links">
        <p>
          Visit any page with <Code>?store=&lt;slug&gt;</Code> appended (e.g.{" "}
          <Code>/?store=jakesvitamin</Code>) to see the affiliate attribution banner appear across
          the site. The slug is stored in a cookie so it persists through checkout.
        </p>
      </Section>

      <Section title="What's stubbed (not real yet)">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-semibold text-black">Payments</span> — checkout card fields are
            cosmetic; no Stripe integration, no charge is ever made.
          </li>
          <li>
            <span className="font-semibold text-black">Patient & admin auth</span> — both use the
            &ldquo;dev bypass&rdquo; buttons described above instead of real login.
          </li>
          <li>
            <span className="font-semibold text-black">Database</span> — orders, patients, and
            intake submissions live in in-memory sample data and reset whenever the server
            restarts.
          </li>
          <li>
            <span className="font-semibold text-black">Notifications</span> — no emails/SMS are
            sent on order approval, denial, or shipping.
          </li>
          <li>
            <span className="font-semibold text-black">Bloodwork upload</span> — the &ldquo;upload
            bloodwork&rdquo; portal action is a placeholder link.
          </li>
          <li>
            <span className="font-semibold text-black">Prescriber integration</span> — prescriptions
            are recorded internally by admin staff rather than via a real prescriber partner API.
          </li>
        </ul>
      </Section>

      <p className="mt-4 text-center text-xs text-zinc-400">
        <Link href="/" className="font-semibold text-black hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
