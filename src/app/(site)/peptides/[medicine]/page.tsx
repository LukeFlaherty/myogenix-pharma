import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeptideConfigurator } from "@/components/pdp/PeptideConfigurator";
import { MEDICINE_CONFIG, PEPTIDE_MEDICINES } from "@/lib/pdp-config";
import type { PeptideMedicine } from "@/lib/pdp-types";

interface Props {
  params: Promise<{ medicine: string }>;
}

export function generateStaticParams() {
  return PEPTIDE_MEDICINES.map((medicine) => ({ medicine }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medicine } = await params;
  const config = MEDICINE_CONFIG[medicine as PeptideMedicine];
  if (!config || config.category !== "peptide") return {};
  return {
    title: `${config.name} — MyoGenix Pharma`,
    description: config.description,
  };
}

export default async function PeptidePdpPage({ params }: Props) {
  const { medicine } = await params;

  const config = MEDICINE_CONFIG[medicine as PeptideMedicine];
  if (!config || config.category !== "peptide") notFound();

  return <PeptideConfigurator medicine={medicine as PeptideMedicine} />;
}
