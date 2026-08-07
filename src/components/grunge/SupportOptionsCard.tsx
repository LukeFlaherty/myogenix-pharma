import Image from "next/image";
import Link from "next/link";
import { uiFont } from "@/lib/ui-font";

const ASSET_BASE = "/assets/grunge-redesign";

const OPTIONS = [
  { label: "Fast answers", detail: "Guided support", icon: "headphones.svg" },
  { label: "Ask questions", detail: "We're here to help", icon: "doctor.svg" },
  { label: "Your care team", detail: "Real people", icon: "hospital-staff.webp" },
];

export function SupportOptionsCard({
  className = "",
  ctaHref = "/contact",
  ctaLabel = "Ask a question",
}: {
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className={`${uiFont.className} w-full border border-white/20 bg-black/65 p-4 shadow-[0_24px_55px_rgba(0,0,0,0.55)] backdrop-blur-sm lg:max-w-[19.6rem] ${className}`}>
      <div className="border-b border-red-700/55 pb-3">
        <p className="text-[1.45rem] font-normal uppercase leading-none tracking-[0.18em] text-red-500">MyoGenix Pharma</p>
      </div>
      <div className="divide-y divide-red-950/80">
        {OPTIONS.map((option) => (
          <div key={option.label} className="grid grid-cols-[3rem_1fr] items-center gap-3 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/[0.03]">
              <Image src={`${ASSET_BASE}/${option.icon}`} alt="" width={25} height={25} className="h-6 w-6 object-contain opacity-85" />
            </span>
            <div>
              <p className="text-[1.28rem] font-normal uppercase leading-none tracking-[0.04em] text-white">{option.label}</p>
              <p className="mt-1 text-[1rem] font-normal uppercase leading-none tracking-[0.035em] text-zinc-300">{option.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href={ctaHref}
        className="mt-2 inline-flex min-h-9 w-full items-center justify-center border-2 border-white/40 px-3 py-1.5 text-[1.25rem] font-normal uppercase tracking-[0.055em] text-white transition hover:border-white/75"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
