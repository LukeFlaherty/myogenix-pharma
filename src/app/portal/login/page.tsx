import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
          <Link href="/">
            <Image src="/logo.png" alt="MyoGenix Pharma" width={150} height={44} className="h-10 w-auto" priority />
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
