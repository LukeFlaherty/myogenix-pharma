import type { Metadata } from "next";
import Link from "next/link";
import { devBypassLoginAction } from "@/lib/portal-actions";

export const metadata: Metadata = {
  title: "Patient Portal — Sign In | MyoGenix Pharma",
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.122" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-black">
              MyoGenix<span className="font-light">Pharma</span>
            </span>
          </Link>
          <h1 className="mt-6 text-xl font-bold text-black">Sign in to your portal</h1>
          <p className="mt-1 text-sm text-zinc-500">Track orders, complete intake, and message your care team.</p>
        </div>

        {/* Login form (stub — auth not wired yet) */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <fieldset disabled className="space-y-4 opacity-50">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-400 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-400 outline-none"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-black py-2.5 text-sm font-bold text-white"
            >
              Sign in
            </button>
          </fieldset>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Auth is not yet configured.{" "}
            <a href="mailto:support@myogenixpharma.com" className="font-semibold text-black underline">
              Contact support
            </a>{" "}
            if you need access.
          </p>
        </div>

        {/* Dev bypass — non-production only */}
        {/* TODO: remove dev bypass before real auth launch */}
        {(
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-600">
              Dev stub — not visible in production
            </p>
            <p className="mb-3 text-xs text-amber-700">
              Bypass auth and enter the portal with a mock patient session.
            </p>
            <form action={devBypassLoginAction}>
              <button
                type="submit"
                className="w-full rounded-xl border border-amber-300 bg-white py-2 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
              >
                Enter portal as Alex Johnson (stub) →
              </button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-zinc-400">
          <Link href="/" className="font-semibold text-black hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
