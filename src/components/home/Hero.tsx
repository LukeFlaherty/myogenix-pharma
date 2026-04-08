import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-20 pt-24">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-8 lg:max-w-3xl">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="text-xs font-semibold text-zinc-600">
              Provider-reviewed · FDA-registered compounding
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-black sm:text-6xl">
            GLP-1 therapy built
            <br />
            around your protocol.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-zinc-500">
            Compounded semaglutide and tirzepatide, dosed to your escalation
            schedule — reviewed by a licensed provider before it ships.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/weight-management"
              className="rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Explore programs →
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
            >
              How it works
            </Link>
          </div>

          {/* Stat strip */}
          <div className="flex flex-wrap gap-8 border-t border-zinc-100 pt-6">
            {[
              { value: "2", label: "FDA-registered compounds" },
              { value: "24h", label: "Provider review turnaround" },
              { value: "503A", label: "Licensed compounding pharmacy" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
                <p className="text-xs text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
