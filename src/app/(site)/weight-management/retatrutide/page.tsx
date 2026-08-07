import { Configurator } from "@/components/pdp/Configurator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retatrutide — MyoGenix Pharma",
  description: "Compounded retatrutide configured for your escalation protocol. GIP/GLP-1/glucagon triple agonist. Starting at $229/mo.",
};

export default function RetatrutidePage() {
  return <Configurator medicine="retatrutide" />;
}
