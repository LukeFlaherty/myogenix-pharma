import { cn } from "@/lib/utils";
import { uiFont } from "@/lib/ui-font";

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
    <div className="flex flex-wrap items-center gap-y-2">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center border text-[11px] font-bold transition-colors",
                  done
                    ? "border-red-600 bg-red-600 text-white"
                    : active
                    ? "border-red-500 bg-black text-white"
                    : "border-white/15 bg-black/50 text-zinc-500"
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
                  uiFont.className,
                  "text-[1.12rem] uppercase leading-none tracking-[0.045em]",
                  active ? "text-white" : done ? "text-zinc-300" : "text-zinc-600"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-3 h-px w-8", done ? "bg-red-600" : "bg-white/15")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
