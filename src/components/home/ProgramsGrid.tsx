import Link from "next/link";

const PROGRAMS = [
  {
    category: "Weight Management",
    href: "/weight-management",
    description:
      "Semaglutide and tirzepatide programs configured for your escalation protocol. Starting at $179/mo.",
    products: ["Tirzepatide", "Semaglutide"],
    available: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    category: "Hormone Health",
    href: "#",
    description:
      "Testosterone, progesterone, and DHEA programs tailored to your labs and lifestyle goals.",
    products: ["Testosterone", "Progesterone"],
    available: false,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122m-7.5 0A2.25 2.25 0 007.5 13.5m7.5-2.257a2.25 2.25 0 01-.659 1.591L10.5 17M10.5 17l3.75 3.75M10.5 17l-3.75 3.75" />
      </svg>
    ),
  },
  {
    category: "Metabolic Health",
    href: "#",
    description:
      "Metformin, berberine, and peptide-based programs to support insulin sensitivity and metabolic function.",
    products: ["Metformin", "BPC-157"],
    available: false,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

export function ProgramsGrid() {
  return (
    <section id="programs" className="border-t border-zinc-100 bg-zinc-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Programs
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-black">
            Clinical programs
          </h2>
          <p className="mt-2 text-base text-zinc-500">
            Each program is designed around a specific clinical goal — with dosing
            that fits your protocol, not a one-size dropdown.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROGRAMS.map((prog) => (
            <div
              key={prog.category}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-150 ${
                prog.available
                  ? "border-zinc-200 hover:border-black hover:shadow-sm"
                  : "border-zinc-100 opacity-60"
              }`}
            >
              {!prog.available && (
                <span className="absolute right-4 top-4 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Coming soon
                </span>
              )}

              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-black">
                  {prog.icon}
                </div>
                <p className="text-base font-bold text-black">{prog.category}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {prog.description}
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {prog.products.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                {prog.available && (
                  <Link
                    href={prog.href}
                    className="ml-3 flex-shrink-0 rounded-xl bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-800"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
