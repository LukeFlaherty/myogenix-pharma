import { Hero } from "@/components/home/Hero";
import { ProgramsGrid } from "@/components/home/ProgramsGrid";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramsGrid />
      <TrustStrip />
      <HowItWorks />
      <ClinicalFaq />
    </>
  );
}
