"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/portal-actions";
import type { PortalSession } from "@/lib/portal-types";

interface Props {
  session: PortalSession;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    href: "/portal/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="1" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
        <rect x="1" y="9" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="9" width="6" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    href: "/portal/orders",
    label: "Orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2.5h1.2c.44 0 .83.3.94.72l.33 1.25M4.5 4.47h9.72c.56 0 .96.54.8 1.08l-1.3 4.5a.87.87 0 01-.84.62H6.5m-2-1.17L2 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="13" r="1" fill="currentColor" />
        <circle cx="12" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Messages",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 2H2a1 1 0 00-1 1v7a1 1 0 001 1h3l2 3 2-3h5a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    ),
    soon: true,
  },
  {
    href: "#",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.42 1.42M11.65 11.65l1.42 1.42M2.93 13.07l1.42-1.42M11.65 4.35l1.42-1.42" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
    soon: true,
  },
];

function NavItem({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-zinc-100 text-black"
          : item.soon
          ? "cursor-not-allowed text-zinc-300"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-black"
      )}
    >
      <span className={active ? "text-black" : "text-zinc-400"}>{item.icon}</span>
      <span>{item.label}</span>
      {item.soon && (
        <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
          Soon
        </span>
      )}
    </Link>
  );
}

export function PortalShell({ session, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = `${session.firstName[0]}${session.lastName[0]}`.toUpperCase();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-5">
          <Link href="/">
            <Image src="/logo.png" alt="MyoGenix Pharma" width={130} height={40} className="h-8 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              active={!item.soon && (pathname === item.href || pathname.startsWith(item.href + "/"))}
            />
          ))}
        </nav>

        {/* Patient + sign out */}
        <div className="border-t border-zinc-100 p-3">
          {session.isDevStub && (
            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2">
              <span className="text-[10px] font-bold text-amber-600">DEV STUB SESSION</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-black">
                {session.firstName} {session.lastName}
              </p>
              <p className="truncate text-[11px] text-zinc-400">{session.email}</p>
            </div>
          </div>
          <form action={signOutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-black"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M5 12H2.5A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2H5M9.5 10l3-3-3-3M12.5 7h-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <Link href="/">
            <Image src="/logo.png" alt="MyoGenix Pharma" width={110} height={32} className="h-7 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </header>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="border-b border-zinc-200 bg-white px-3 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  active={!item.soon && (pathname === item.href || pathname.startsWith(item.href + "/"))}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-black"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 12H2.5A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2H5M9.5 10l3-3-3-3M12.5 7h-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
