import Link from "next/link";
import Image from "next/image";

const NEW_PEPTIDES = [
  {
    name: "Wolverine",
    genericName: "Recovery Peptide Blend",
    href: "/peptides/wolverine",
    image: "/products/wolverine.webp",
    benefit: "Accelerated healing, joint & tendon repair, anti-inflammatory",
    startingPrice: 169,
  },
  {
    name: "Tesamorelin",
    genericName: "GHRH Analogue",
    href: "/peptides/tesamorelin",
    image: "/products/tesamorelin.webp",
    benefit: "Visceral fat reduction, GH optimization, lean mass support",
    startingPrice: 179,
  },
  {
    name: "Glow",
    genericName: "Longevity & Renewal Blend",
    href: "/peptides/glow",
    image: "/products/glow.webp",
    benefit: "Cellular regeneration, skin health, antioxidant defense, longevity",
    startingPrice: 179,
  },
];

export function NewPeptides() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-100 px-4 py-14">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              New arrivals
            </span>
            <h2 className="mt-1.5 text-3xl font-bold text-black sm:text-4xl">
              3 new peptides
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-500">
              The latest additions to our compounded peptide line. Provider-reviewed and shipped cold-chain from our FDA-registered facility.
            </p>
          </div>
          <Link
            href="/peptides"
            className="flex-shrink-0 text-sm font-semibold text-black underline-offset-4 hover:underline"
          >
            View all peptides →
          </Link>
        </div>

        {/* Cards — horizontal rows on mobile, vertical columns on sm+ */}
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
          {NEW_PEPTIDES.map((peptide) => (
            <Link
              key={peptide.name}
              href={peptide.href}
              className="group flex flex-row overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-lg sm:flex-col"
            >
              {/* Image: fixed square on mobile (left), full-width square on sm+ (top) */}
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden bg-zinc-50 sm:h-auto sm:w-full sm:aspect-square">
                <Image
                  src={peptide.image}
                  alt={peptide.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 112px, (max-width: 1200px) 30vw, 360px"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {peptide.genericName}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-black sm:text-xl">
                    {peptide.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:mt-2">
                    {peptide.benefit}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                  <div>
                    <p className="text-[10px] text-zinc-400">Starting at</p>
                    <p className="text-base font-bold text-black sm:text-lg">
                      ${peptide.startingPrice}
                      <span className="ml-0.5 text-[10px] font-normal text-zinc-400">/vial</span>
                    </p>
                  </div>
                  <span className="rounded-xl bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors group-hover:bg-zinc-700 sm:text-xs">
                    Order →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
