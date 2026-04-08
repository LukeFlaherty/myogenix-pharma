import Link from "next/link";

const ROWS = [
  { label: "Mechanism", tirzepatide: "GIP + GLP-1 dual agonist", semaglutide: "GLP-1 agonist only" },
  { label: "Dose range", tirzepatide: "10–50 mg/month", semaglutide: "0.25–2.4 mg/month" },
  { label: "Starting price", tirzepatide: "$199/mo", semaglutide: "$179/mo" },
  { label: "Injection frequency", tirzepatide: "Once weekly", semaglutide: "Once weekly" },
  { label: "Clinical data", tirzepatide: "SURMOUNT-1 trial", semaglutide: "STEP-1 trial" },
  { label: "Best first choice if", tirzepatide: "Max efficacy is the priority or you've plateaued on semaglutide", semaglutide: "Starting GLP-1 therapy for the first time" },
];

export function HowToChoose() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Comparison
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            How to choose
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Both medications are clinically effective. Your provider will confirm
            the right choice based on your intake form.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {/* Table header */}
          <div className="grid grid-cols-3 border-b border-zinc-100 bg-zinc-50 px-6 py-3">
            <div />
            <p className="text-xs font-bold uppercase tracking-widest text-black">Tirzepatide</p>
            <p className="text-xs font-bold uppercase tracking-widest text-black">Semaglutide</p>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 items-start gap-4 px-6 py-4 ${
                i < ROWS.length - 1 ? "border-b border-zinc-50" : ""
              }`}
            >
              <p className="text-xs font-semibold text-zinc-400">{row.label}</p>
              <p className="text-sm text-zinc-700">{row.tirzepatide}</p>
              <p className="text-sm text-zinc-700">{row.semaglutide}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-zinc-400">
          Not sure which is right for you? Complete the intake form and your provider will guide you.{" "}
          <Link href="/weight-management/tirzepatide" className="font-semibold text-black underline underline-offset-2">
            Start with Tirzepatide
          </Link>{" "}
          or{" "}
          <Link href="/weight-management/semaglutide" className="font-semibold text-black underline underline-offset-2">
            Start with Semaglutide.
          </Link>
        </p>
      </div>
    </section>
  );
}
