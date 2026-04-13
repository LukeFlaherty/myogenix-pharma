import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Intake — MyoGenix Pharma",
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Minimal chrome — no site nav, no footer */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-tight text-black">MyoGenix Pharma</span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Medical intake
          </span>
        </Link>

        {/* Exit affordance */}
        <Link
          href="/"
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          Save &amp; exit
        </Link>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
