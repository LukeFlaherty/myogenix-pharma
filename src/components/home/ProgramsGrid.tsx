import Link from "next/link";
import Image from "next/image";

interface ProductCard {
  name: string;
  tagline: string;
  href: string;
  image: string;
  startingPrice: number;
  unit: string;
}

interface CategoryBox {
  label: string;
  shopAllHref: string;
  products: ProductCard[];
}

const CATEGORIES: CategoryBox[] = [
  {
    label: "Mens Health",
    shopAllHref: "/mens-health",
    products: [
      { name: "Testosterone", tagline: "Provider-managed TRT", href: "/mens-health/testosterone", image: "/products/testosterone.webp", startingPrice: 149, unit: "/vial" },
    ],
  },
  {
    label: "Weight Loss",
    shopAllHref: "/weight-management",
    products: [
      { name: "Tirzepatide", tagline: "Dual-action GLP-1 therapy", href: "/weight-management/tirzepatide", image: "/products/tirzepatide.webp", startingPrice: 199, unit: "/mo" },
      { name: "Semaglutide", tagline: "Proven GLP-1 therapy", href: "/weight-management/semaglutide", image: "/products/semaglutide.webp", startingPrice: 179, unit: "/mo" },
      { name: "Retatrutide", tagline: "Triple-action therapy", href: "/weight-management/retatrutide", image: "/products/retatrutide.webp", startingPrice: 229, unit: "/mo" },
    ],
  },
  {
    label: "Sexual Health",
    shopAllHref: "/sexual-health",
    products: [
      { name: "Sildenafil", tagline: "On-demand ED therapy", href: "/sexual-health/sildenafil", image: "/products/sildenafil.webp", startingPrice: 89, unit: "/dose" },
      { name: "Tadalafil", tagline: "Long-acting ED therapy", href: "/sexual-health/tadalafil", image: "/products/tadalafil.webp", startingPrice: 99, unit: "/dose" },
    ],
  },
  {
    label: "Peptides",
    shopAllHref: "/peptides",
    products: [
      { name: "Wolverine", tagline: "Elite tissue recovery", href: "/peptides/wolverine", image: "/products/wolverine.webp", startingPrice: 169, unit: "/vial" },
      { name: "Tesamorelin", tagline: "GH optimization", href: "/peptides/tesamorelin", image: "/products/tesamorelin.webp", startingPrice: 179, unit: "/vial" },
      { name: "Klow", tagline: "Metabolic support", href: "/peptides/klow", image: "/products/klow.webp", startingPrice: 149, unit: "/vial" },
      { name: "Glow", tagline: "Longevity & renewal", href: "/peptides/glow", image: "/products/glow.webp", startingPrice: 179, unit: "/vial" },
      { name: "BPC-157", tagline: "Tissue & gut repair", href: "/peptides/bpc157", image: "/products/bpc157.webp", startingPrice: 129, unit: "/vial" },
      { name: "CJC-1295", tagline: "Sustained GH release", href: "/peptides/cjc1295", image: "/products/cjc1295.webp", startingPrice: 149, unit: "/vial" },
      { name: "Sermorelin", tagline: "Natural GH stimulation", href: "/peptides/sermorelin", image: "/products/sermorelin.webp", startingPrice: 149, unit: "/vial" },
      { name: "MOTS-c", tagline: "Metabolic performance", href: "/peptides/motsc", image: "/products/motsc.webp", startingPrice: 159, unit: "/vial" },
      { name: "Epithalon", tagline: "Cellular longevity", href: "/peptides/epithalon", image: "/products/epithalon.webp", startingPrice: 159, unit: "/vial" },
      { name: "NAD+", tagline: "Cellular energy", href: "/peptides/nad", image: "/products/nad.webp", startingPrice: 179, unit: "/vial" },
      { name: "Glutathione", tagline: "Master antioxidant", href: "/peptides/glutathione", image: "/products/glutathione.webp", startingPrice: 119, unit: "/vial" },
    ],
  },
];

function ProductCardItem({ product }: { product: ProductCard }) {
  return (
    <Link
      href={product.href}
      className="group flex w-44 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="176px"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-sm font-bold leading-tight text-black">{product.name}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-bold text-black">
            ${product.startingPrice}
            <span className="ml-0.5 text-[10px] font-normal text-zinc-400">{product.unit}</span>
          </p>
          <span className="rounded-lg bg-black px-2.5 py-1 text-[10px] font-bold text-white transition-colors group-hover:bg-zinc-700">
            Shop →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProgramsGrid() {
  return (
    <section id="programs" className="border-t border-zinc-100 bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <div
              key={category.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              {/* Category header */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">{category.label}</h3>
                <Link
                  href={category.shopAllHref}
                  className="text-xs font-semibold text-zinc-400 transition-colors hover:text-black"
                >
                  Shop all →
                </Link>
              </div>

              {/* Scroll container with right-fade hint */}
              <div className="relative">
                <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
                  {category.products.map((product, idx) => (
                    <ProductCardItem key={`${product.name}-${idx}`} product={product} />
                  ))}
                </div>
                {/* Gradient fade signals more content to the right */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
