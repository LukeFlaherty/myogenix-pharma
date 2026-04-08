import { Navbar } from "@/components/layout/Navbar";
import { Configurator } from "@/components/pdp/Configurator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Configurator />
        <HowItWorks />
        <ClinicalFaq />
      </main>
      <footer className="border-t border-zinc-100 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © 2025 MyoGenix Pharma. For informational purposes only. Not medical advice.
          </p>
          <div className="flex gap-5 text-xs text-zinc-400">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
