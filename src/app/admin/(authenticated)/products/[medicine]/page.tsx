import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/admin-product-store";
import { getAdminSession } from "@/lib/admin-auth";
import { CATEGORY_CONFIG } from "@/lib/pdp-config";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import type { Medicine } from "@/lib/pdp-types";

interface Props {
  params: Promise<{ medicine: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medicine } = await params;
  const product = getProduct(medicine as Medicine);
  return {
    title: product
      ? `${product.name} — Products | Admin`
      : "Product — Admin | MyoGenix Pharma",
  };
}

export default async function AdminProductDetailPage({ params }: Props) {
  const { medicine } = await params;
  const [product, session] = await Promise.all([
    Promise.resolve(getProduct(medicine as Medicine)),
    getAdminSession(),
  ]);

  if (!product) notFound();
  if (!session) notFound();

  const catCfg = CATEGORY_CONFIG[product.category];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/products" className="hover:text-slate-800 transition-colors">
          Products
        </Link>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-300">
          <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-slate-800 font-medium">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {catCfg.label}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
              product.active
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}>
              {product.active ? "Active" : "Inactive"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{product.genericName} · {product.medicine}</p>
        </div>

        {/* View storefront link */}
        <Link
          href={`/${product.category === "glp1" ? "weight-management" : "peptides"}/${product.medicine}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          View on storefront
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Edit form */}
      <ProductEditForm product={product} session={session} />
    </div>
  );
}
