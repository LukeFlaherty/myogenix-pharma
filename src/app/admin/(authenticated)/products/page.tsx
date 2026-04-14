import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/admin-product-store";
import { CATEGORY_CONFIG } from "@/lib/pdp-config";
import type { ProductCategory } from "@/lib/pdp-types";

export const metadata: Metadata = {
  title: "Products — Admin | MyoGenix Pharma",
};

const CATEGORY_ORDER: ProductCategory[] = ["glp1", "peptide"];

export default function AdminProductsPage() {
  const products = getAllProducts();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    cfg: CATEGORY_CONFIG[cat],
    products: products.filter((p) => p.category === cat),
  }));

  const activeCount   = products.filter((p) => p.active).length;
  const inactiveCount = products.filter((p) => !p.active).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} products · {activeCount} active · {inactiveCount} inactive
          </p>
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-10">
        {grouped.map(({ cat, cfg, products: catProducts }) => (
          <section key={cat}>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {cfg.label}
              </p>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                {catProducts.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catProducts.map((product) => {
                const imageSrc = `/${product.imageKey}`;
                const lowestPrice = Math.min(...product.doses.map((d) => d.pricePerMonth));

                return (
                  <Link
                    key={product.medicine}
                    href={`/admin/products/${product.medicine}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
                  >
                    {/* Product image */}
                    <div className="relative h-36 w-full bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {/* Active badge */}
                      <div className="absolute right-2 top-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${
                          product.active
                            ? "border-green-200 bg-green-50/90 text-green-700"
                            : "border-red-200 bg-red-50/90 text-red-600"
                        }`}>
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {product.genericName}
                      </p>
                      <p className="mt-0.5 font-bold text-slate-900">{product.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {product.tagline}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-[10px] text-slate-400">From</p>
                          <p className="text-sm font-bold text-slate-900">
                            ${lowestPrice}<span className="text-xs font-normal text-slate-400">/mo</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <span>{product.doses.length} tiers</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-300 group-hover:text-slate-500 transition-colors">
                            <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
