import Link from "next/link";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";

const PRODUCTS = [
  {
    medicine: "tirzepatide" as const,
    href: "/weight-management/tirzepatide",
    badge: "Dual-action",
    differentiators: [
      "Activates GIP + GLP-1 receptors",
      "Strongest average weight loss in trials",
      "Once-weekly injection",
      "10–50 mg monthly range",
    ],
    bestFor: "Patients seeking maximum efficacy or those who didn't respond well to GLP-1 monotherapy.",
  },
  {
    medicine: "semaglutide" as const,
    href: "/weight-management/semaglutide",
    badge: "Proven GLP-1",
    differentiators: [
      "Selective GLP-1 receptor agonist",
      "Extensive real-world safety data",
      "Once-weekly injection",
      "0.25–2.4 mg monthly range",
    ],
    bestFor: "First-line GLP-1 therapy with the most established clinical track record for weight and metabolic health.",
  },
];

export function ProductCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {PRODUCTS.map((prod) => {
        const config = MEDICINE_CONFIG[prod.medicine];
        const startingPrice = Math.min(...config.doses.map((d) => d.pricePerMonth));

        return (
          <div
            key={prod.medicine}
            className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 transition-shadow hover:shadow-md"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {prod.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-black">{config.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{config.genericName}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122m-7.5 0A2.25 2.25 0 007.5 13.5m7.5-2.257a2.25 2.25 0 01-.659 1.591L10.5 17M10.5 17l3.75 3.75M10.5 17l-3.75 3.75" />
                </svg>
              </div>
            </div>

            {/* Price */}
            <div className="my-6 border-t border-zinc-100 pt-6">
              <p className="text-xs text-zinc-400">Starting at</p>
              <p className="text-3xl font-bold text-black">
                ${startingPrice}
                <span className="ml-1 text-base font-normal text-zinc-400">/mo</span>
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">with subscription — 10% off</p>
            </div>

            {/* Differentiators */}
            <ul className="mb-6 space-y-2">
              {prod.differentiators.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-black" fill="none" viewBox="0 0 16 16">
                    <path d="M2.5 8l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-zinc-600">{point}</span>
                </li>
              ))}
            </ul>

            {/* Best for */}
            <div className="mb-6 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Best for</p>
              <p className="text-xs leading-relaxed text-zinc-600">{prod.bestFor}</p>
            </div>

            {/* CTA */}
            <Link
              href={prod.href}
              className="mt-auto block w-full rounded-xl bg-black py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Configure {config.name} →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
