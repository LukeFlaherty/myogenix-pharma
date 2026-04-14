"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/CartIcon";

const NAV_LINKS = [
  { label: "Weight Management", href: "/weight-management" },
  { label: "Peptides", href: "/peptides" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="MyoGenix Pharma" width={140} height={40} className="h-9 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black",
                  active ? "text-black" : "text-zinc-500"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <CartIcon />
          <Link href="/portal/login" className="text-sm font-medium text-zinc-500 hover:text-black">
            Sign in
          </Link>
          <Link
            href="/weight-management"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger + cart */}
        <div className="flex items-center gap-2 md:hidden">
          <CartIcon />
          <button
            className="flex items-center justify-center"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-zinc-600 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-zinc-600 hover:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/weight-management"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-black px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
