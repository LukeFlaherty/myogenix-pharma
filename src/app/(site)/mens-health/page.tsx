import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MEDICINE_CONFIG, MENS_HEALTH_MEDICINES } from "@/lib/pdp-config";

export const metadata: Metadata = {
  title: "Mens Health — MyoGenix Pharma",
  description:
    "Provider-managed testosterone replacement therapy, compounded to order and shipped discreetly.",
};

export default function MensHealthPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black">Mens Health</span>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-zinc-100 bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <span className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Hormone Optimization
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Mens Health
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500">
            Provider-managed testosterone replacement therapy for patients with clinically low levels. Compounded to order, reviewed before it ships.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Starting at $149/vial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              24h provider review
            </span>
          </div>
        </div>
      </section>

      {/* Product cards */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MENS_HEALTH_MEDICINES.map((medicine) => {
              const config = MEDICINE_CONFIG[medicine];
              const startingPrice = Math.min(...config.doses.map((d) => d.pricePerMonth));
              return (
                <Link
                  key={medicine}
                  href={`/mens-health/${medicine}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-md sm:flex-row"
                >
                  <div className="overflow-hidden bg-zinc-100 sm:w-48 sm:flex-shrink-0">
                    <Image
                      src={`/products/${medicine}.webp`}
                      alt={config.name}
                      width={400}
                      height={400}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {config.genericName}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold text-black">
                      {config.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500 flex-1">
                      {config.benefit}
                    </p>

                    <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-4">
                      <div>
                        <p className="text-[10px] text-zinc-400">Starting at</p>
                        <p className="text-xl font-bold text-black">
                          ${startingPrice}
                          <span className="ml-0.5 text-sm font-normal text-zinc-400">/vial</span>
                        </p>
                      </div>
                      <span className="rounded-xl bg-black px-3 py-1.5 text-xs font-bold text-white">
                        Order →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-zinc-100 bg-white px-4 py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "🏥", label: "Provider-reviewed", sub: "Licensed MDs approve every order" },
            { icon: "🧪", label: "Compounded in USA", sub: "FDA-registered facility" },
            { icon: "❄️", label: "Cold-chain shipping", sub: "Refrigerated, discreet packaging" },
            { icon: "🔬", label: "Pharmaceutical grade", sub: "COA available on request" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-black">{item.label}</p>
                <p className="text-[11px] text-zinc-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
