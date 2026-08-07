import Link from "next/link";
import Image from "next/image";
import { uiFont } from "@/lib/ui-font";

const LINKS = {
  Programs: [
    { label: "Weight Management", href: "/weight-management" },
    { label: "Peptides", href: "/peptides" },
    { label: "Sexual Health", href: "/sexual-health" },
    { label: "Mens Health", href: "/mens-health" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Affiliate Program", href: "/affiliates" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className={`${uiFont.className} relative overflow-hidden border-t border-red-700/80 bg-black px-4 py-12 text-white sm:py-14`}>
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage: 'url("/assets/grunge-redesign/grunge black section bg blank.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(220,38,38,0.18),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.3),rgba(0,0,0,0.92))]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/">
              <Image
                src="/assets/grunge-redesign/red and white logo.svg"
                alt="MyoGenix Pharma"
                width={180}
                height={54}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-[1.38rem] font-normal uppercase leading-tight tracking-[0.035em] text-zinc-300">
              Concierge telehealth care, guided by humans.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="mb-4 text-[1.2rem] font-normal uppercase tracking-[0.28em] text-red-500">
                {group}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[1.35rem] font-normal uppercase leading-none tracking-[0.04em] text-zinc-300 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t-2 border-white/20 pt-6 sm:flex-row">
          <p className="font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
            © {new Date().getFullYear()} MyoGenix Pharma. For informational purposes only. Not medical advice.
          </p>
          <p className="font-[family-name:var(--font-poppins)] text-sm font-medium leading-relaxed text-zinc-400">
            Compounded medications are not FDA-approved.
          </p>
        </div>
      </div>
    </footer>
  );
}
