import { ProductCards } from "@/components/weight-management/ProductCards";
import { HowToChoose } from "@/components/weight-management/HowToChoose";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weight Management — MyoGenix Pharma",
  description: "Compounded semaglutide and tirzepatide programs, provider-reviewed and configured for your escalation protocol.",
};

export default function WeightManagementPage() {
  return (
    <>
      {/* Page hero */}
      <section className="border-b border-zinc-100 bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <a href="/" className="hover:text-black">Home</a>
            <span>/</span>
            <span className="text-black">Weight Management</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Weight Management
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500">
            Two proven GLP-1 compounds. Both provider-reviewed, both configured
            around your escalation schedule — not a flat dropdown.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Starting at $179/mo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Save 10% with subscription
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
          <ProductCards />
        </div>
      </section>

      <HowToChoose />
      <ClinicalFaq />
    </>
  );
}
