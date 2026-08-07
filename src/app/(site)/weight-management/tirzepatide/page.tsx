import { Configurator } from "@/components/pdp/Configurator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tirzepatide — MyoGenix Pharma",
  description: "Compounded tirzepatide configured for your escalation protocol. GIP/GLP-1 dual agonist. Starting at $199/mo.",
};

export default function TirzepatidePage() {
  return <Configurator medicine="tirzepatide" />;
}
