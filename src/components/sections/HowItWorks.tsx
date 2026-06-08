import Image from "next/image";

const STEPS = [
  {
    number: "01",
    title: "Questionnaire",
    description: "Answer a few questions and share your medical details.",
    image: "/how-it-works/questionnaire.png",
  },
  {
    number: "02",
    title: "Reviewed & approved by provider",
    description: "Discuss your goals and receive expert recommendations.",
    image: "/how-it-works/review-provider.png",
  },
  {
    number: "03",
    title: "Receive medication",
    description: "Medication and supplies shipped straight to your door.",
    image: "/how-it-works/receive-medication.png",
  },
  {
    number: "04",
    title: "Monthly monitoring",
    description: "Stay on track with regular free check-ins to ensure progress.",
    image: "/how-it-works/calendar.png",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-zinc-100 bg-zinc-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Process
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-black">
            How it works
          </h2>
          <p className="mt-3 text-base text-zinc-500">
            From your first order to your ongoing program — here&apos;s what to
            expect at every step.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                />
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                  {step.number}
                </p>
                <p className="text-sm font-bold leading-snug text-black">{step.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
