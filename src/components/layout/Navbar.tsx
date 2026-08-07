"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/CartIcon";
import { uiFont } from "@/lib/ui-font";

const NAV_LINKS = [
  { label: "Weight Management", href: "/weight-management" },
  { label: "Peptides", href: "/peptides" },
  { label: "Sexual Health", href: "/sexual-health" },
];

const MOBILE_NAV_LINKS = [
  ...NAV_LINKS,
  { label: "Mens Health", href: "/mens-health" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={`${uiFont.className} sticky top-0 z-50 border-b border-red-700/80 bg-black/92 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md`}>
      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: 'url("/assets/grunge-redesign/thin section bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/grunge-redesign/red and white logo.svg"
            alt="MyoGenix Pharma"
            width={170}
            height={50}
            className="h-10 w-auto md:h-9"
            priority
          />
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
                  "text-[1.25rem] font-normal uppercase leading-none tracking-[0.045em] transition-colors hover:text-white",
                  active ? "text-white" : "text-zinc-400"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <CartIcon
            className="rounded-none hover:bg-red-600/15"
            iconClassName="text-white"
            badgeClassName="bg-red-600"
          />
          <Link href="/portal/login" className="text-[1.25rem] font-normal uppercase leading-none tracking-[0.045em] text-zinc-400 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/weight-management"
            className="bg-red-600 px-2.5 py-1.5 text-[1.38rem] font-normal uppercase leading-none tracking-[0.045em] text-white shadow-[0_0_20px_rgba(220,38,38,0.28)] transition-colors hover:bg-red-500"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger + cart */}
        <div className="flex items-center gap-2 md:hidden">
          <CartIcon
            className="rounded-none hover:bg-red-600/15"
            iconClassName="text-white"
            badgeClassName="bg-red-600"
          />
          <button
            className="flex items-center justify-center"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="flex h-8 w-8 flex-col items-center justify-center gap-1.5">
              <span className={cn("block h-0.5 w-6 bg-white transition-all", menuOpen && "translate-y-2 rotate-45")} />
              <span className={cn("block h-0.5 w-6 bg-white transition-all", menuOpen && "opacity-0")} />
              <span className={cn("block h-0.5 w-6 bg-white transition-all", menuOpen && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="relative border-t border-red-700/70 bg-black/95 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-2 pt-3">
            {MOBILE_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border border-white/10 bg-white/[0.03] px-4 py-3 text-2xl font-normal uppercase tracking-[0.045em] text-zinc-200 hover:border-red-600 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              onClick={() => setMenuOpen(false)}
              className="border border-white/10 bg-white/[0.03] px-4 py-3 text-2xl font-normal uppercase tracking-[0.045em] text-zinc-200 hover:border-red-600 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/weight-management"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-red-600 px-2.5 py-1.5 text-center text-[1.65rem] font-normal uppercase tracking-[0.045em] text-white"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
