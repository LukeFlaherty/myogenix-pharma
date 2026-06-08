export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-14 pt-20">
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
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="text-xs font-semibold text-zinc-600">
              Provider-reviewed · FDA-registered compounding
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl">
            Clinical programs for every health goal.
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
            Compounded weight management, men&apos;s health, sexual health, and performance peptides — reviewed by a licensed provider before every shipment.
          </p>
        </div>
      </div>
    </section>
  );
}
