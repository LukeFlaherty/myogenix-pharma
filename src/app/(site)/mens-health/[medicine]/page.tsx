import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeptideConfigurator } from "@/components/pdp/PeptideConfigurator";
import { MEDICINE_CONFIG, MENS_HEALTH_MEDICINES } from "@/lib/pdp-config";
import type { MensHealthMedicine } from "@/lib/pdp-types";

interface Props {
  params: Promise<{ medicine: string }>;
}

export function generateStaticParams() {
  return MENS_HEALTH_MEDICINES.map((medicine) => ({ medicine }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medicine } = await params;
  const config = MEDICINE_CONFIG[medicine as MensHealthMedicine];
  if (!config || config.category !== "mens-health") return {};
  return {
    title: `${config.name} — MyoGenix Pharma`,
    description: config.description,
  };
}

export default async function MensHealthPdpPage({ params }: Props) {
  const { medicine } = await params;

  const config = MEDICINE_CONFIG[medicine as MensHealthMedicine];
  if (!config || config.category !== "mens-health") notFound();

  return <PeptideConfigurator medicine={medicine as MensHealthMedicine} />;
}
