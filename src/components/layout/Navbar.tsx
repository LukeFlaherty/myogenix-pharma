"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-black">
            MyoGenix<span className="font-light">Pharma</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-black">
            Sign in
          </a>
          <a
            href="#configure"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Get started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="flex h-8 w-8 flex-col items-center justify-center gap-1.5">
            <span className={cn("block h-0.5 w-5 bg-black transition-all", menuOpen && "translate-y-2 rotate-45")} />
            <span className={cn("block h-0.5 w-5 bg-black transition-all", menuOpen && "opacity-0")} />
            <span className={cn("block h-0.5 w-5 bg-black transition-all", menuOpen && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-black"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#configure"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-black px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
