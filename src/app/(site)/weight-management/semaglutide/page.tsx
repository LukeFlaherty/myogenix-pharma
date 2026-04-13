import { Configurator } from "@/components/pdp/Configurator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semaglutide — MyoGenix Pharma",
  description: "Compounded semaglutide configured for your escalation protocol. GLP-1 receptor agonist. Starting at $179/mo.",
};

export default function SemaglutidePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-zinc-400">
          <a href="/" className="hover:text-black">Home</a>
          <span>/</span>
          <a href="/weight-management" className="hover:text-black">Weight Management</a>
          <span>/</span>
          <span className="text-black">Semaglutide</span>
        </div>
      </div>

      <Configurator medicine="semaglutide" />
      <HowItWorks />
      <ClinicalFaq />
    </>
  );
}
