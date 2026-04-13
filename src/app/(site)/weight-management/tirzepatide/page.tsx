import { Configurator } from "@/components/pdp/Configurator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirzepatide — MyoGenix Pharma",
  description: "Compounded tirzepatide configured for your escalation protocol. GIP/GLP-1 dual agonist. Starting at $199/mo.",
};

export default function TirzepatidePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-zinc-400">
          <a href="/" className="hover:text-black">Home</a>
          <span>/</span>
          <a href="/weight-management" className="hover:text-black">Weight Management</a>
          <span>/</span>
          <span className="text-black">Tirzepatide</span>
        </div>
      </div>

      <Configurator medicine="tirzepatide" />
      <HowItWorks />
      <ClinicalFaq />
    </>
  );
}
