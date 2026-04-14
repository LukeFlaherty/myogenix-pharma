"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminSignOutAction } from "@/lib/admin-actions";
import type { AdminSession } from "@/lib/admin-types";
import { ADMIN_ROLE_CONFIG } from "@/lib/admin-types";

interface Props {
  session: AdminSession;
  pendingReviewCount: number;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
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
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2.5h1.2c.44 0 .83.3.94.72l.33 1.25M4.5 4.47h9.72c.56 0 .96.54.8 1.08l-1.3 4.5a.87.87 0 01-.84.62H6.5m-2-1.17L2 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="13" r="1" fill="currentColor" />
        <circle cx="12" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
    hasBadge: true,
  },
  {
    href: "/admin/patients",
    label: "Patients",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
];

function NavItem({
  item,
  active,
  badgeCount,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  badgeCount?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-slate-700 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <span className={active ? "text-white" : "text-slate-500"}>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.hasBadge && badgeCount != null && badgeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}

export function AdminShell({ session, pendingReviewCount, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = `${session.firstName[0]}${session.lastName[0]}`.toUpperCase();
  const roleCfg = ADMIN_ROLE_CONFIG[session.role];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Desktop sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 md:flex">
        {/* Brand */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">
                MyoGenix<span className="font-light">Pharma</span>
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              badgeCount={item.hasBadge ? pendingReviewCount : undefined}
            />
          ))}
        </nav>

        {/* Staff info + sign out */}
        <div className="border-t border-slate-800 p-3">
          {session.isDevStub && (
            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2">
              <span className="text-[10px] font-bold text-amber-400">DEV STUB SESSION</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {session.firstName} {session.lastName}
              </p>
              <span className={`inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${roleCfg.color}`}>
                {roleCfg.label}
              </span>
            </div>
          </div>
          <form action={adminSignOutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M5 12H2.5A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2H5M9.5 10l3-3-3-3M12.5 7h-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 md:hidden">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
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

        {mobileOpen && (
          <div className="border-b border-slate-700 bg-slate-900 px-3 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  active={pathname === item.href || pathname.startsWith(item.href + "/")}
                  badgeCount={item.hasBadge ? pendingReviewCount : undefined}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-3 border-t border-slate-800 pt-3">
              <form action={adminSignOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
