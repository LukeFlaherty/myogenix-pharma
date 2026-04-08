import Link from "next/link";

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
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight text-black">
                MyoGenix<span className="font-light">Pharma</span>
              </span>
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
