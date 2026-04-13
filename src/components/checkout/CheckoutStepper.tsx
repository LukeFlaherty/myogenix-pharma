import { cn } from "@/lib/utils";

interface Props {
  current: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: "Your info" },
  { n: 2, label: "Payment" },
  { n: 3, label: "Review" },
];

export function CheckoutStepper({ current }: Props) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                  done
                    ? "bg-black text-white"
                    : active
                    ? "border-2 border-black bg-white text-black"
                    : "border-2 border-zinc-200 bg-white text-zinc-300"
                )}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.n
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  active ? "text-black" : done ? "text-zinc-500" : "text-zinc-300"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-3 h-px w-8", done ? "bg-black" : "bg-zinc-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
