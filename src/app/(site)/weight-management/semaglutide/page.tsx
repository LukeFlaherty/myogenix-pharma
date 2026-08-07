import { Configurator } from "@/components/pdp/Configurator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semaglutide — MyoGenix Pharma",
  description: "Compounded semaglutide configured for your escalation protocol. GLP-1 receptor agonist. Starting at $179/mo.",
};

export default function SemaglutidePage() {
  return <Configurator medicine="semaglutide" />;
}
