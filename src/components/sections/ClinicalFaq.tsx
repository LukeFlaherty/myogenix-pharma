"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is tirzepatide and how is it different from semaglutide?",
    a: "Tirzepatide is a dual GIP/GLP-1 receptor agonist — it activates two metabolic pathways simultaneously. Semaglutide only activates the GLP-1 receptor. Clinical trials (SURMOUNT-1) show tirzepatide produced significantly greater average weight loss than semaglutide across comparable doses.",
  },
  {
    q: "How does dosing escalation work?",
    a: "You start at 10 mg/month and increase in 10 mg steps based on tolerance and provider guidance. Most patients step up every 4 weeks. Our configurator lets you plan your escalation upfront, and your provider confirms each step is appropriate before it ships.",
  },
  {
    q: "Do I need a new consultation every month?",
    a: "Subscribers don't. Your initial approval covers your configured escalation program. A new consultation is only required for one-time purchases, or if you request a dose change outside your original program. Consult fees are $79.",
  },
  {
    q: "What if my provider adjusts my dose?",
    a: "If your provider determines a different dose is more appropriate, they'll contact you before fulfilling the order. You're never charged for a dose that wasn't approved. The UI will warn you if you select a dose lower than your previous month — that's the most common reason for provider adjustments.",
  },
  {
    q: "How is this compounded and where does it ship from?",
    a: "Your medication is compounded at an FDA-registered 503A pharmacy in the United States. It ships refrigerated in discreet packaging with a cold pack valid for up to 72 hours in transit.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes — anytime. Cancel before your renewal date and you won't be charged for the next cycle. There's no minimum commitment and no cancellation fee.",
  },
];

export function ClinicalFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-zinc-100 bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Left label */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              FAQ
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-black">
              Common questions
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Everything you need to know about the program, dosing, and ordering.
            </p>
            <a
              href="#configure"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Configure your program →
            </a>
          </div>

          {/* Right accordion */}
          <div className="divide-y divide-zinc-100">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <span className="text-sm font-semibold text-black">
                    {faq.q}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 flex-shrink-0 text-zinc-400 transition-transform duration-200",
                      open === i && "rotate-45"
                    )}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
