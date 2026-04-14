import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/peptides" className="hover:text-black">Peptides</Link>
          <span>/</span>
          <span className="text-black">{config.name}</span>
        </div>
      </div>

      <PeptideConfigurator medicine={medicine as PeptideMedicine} />
    </>
  );
}
