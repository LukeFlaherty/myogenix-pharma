import Link from "next/link";
import Image from "next/image";

const LINKS = {
  Programs: [
    { label: "Weight Management", href: "/weight-management" },
    { label: "Tirzepatide", href: "/weight-management/tirzepatide" },
    { label: "Semaglutide", href: "/weight-management/semaglutide" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Affiliate Program", href: "/affiliates" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/">
              <Image src="/logo.png" alt="MyoGenix Pharma" width={130} height={40} className="h-8 w-auto" />
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Clinical-grade GLP-1 therapy, configured for your protocol.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {group}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-black"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} MyoGenix Pharma. For informational purposes only. Not medical advice.
          </p>
          <p className="text-xs text-zinc-400">
            Compounded medications are not FDA-approved.
          </p>
        </div>
      </div>
    </footer>
  );
}
