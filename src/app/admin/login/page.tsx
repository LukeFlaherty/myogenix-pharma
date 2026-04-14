import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { devAdminBypassAction } from "@/lib/admin-actions";

export const metadata: Metadata = {
  title: "Admin — Sign In | MyoGenix Pharma",
};

const DEV_ROLES = [
  { role: "admin",    label: "Jordan Rivera — Admin (full access)",  description: "Operations Director — sees everything" },
  { role: "provider", label: "Dr. Sarah Mills — Provider",           description: "Medical Director — review queue, approve/deny" },
  { role: "pharmacy", label: "Pharmacy Team",                        description: "Compounding — mark shipped / delivered" },
] as const;

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <Image src="/logo.png" alt="MyoGenix Pharma" width={150} height={44} className="mb-2 h-10 w-auto brightness-0 invert" priority />
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-400">Internal operations portal — authorized staff only.</p>
        </div>

        {/* Login form (stub — SSO not wired yet) */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
          <fieldset disabled className="space-y-4 opacity-40">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Work email
              </label>
              <input
                type="email"
                placeholder="you@myogenixpharma.com"
                className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3.5 py-2.5 text-sm text-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-600 bg-slate-700 px-3.5 py-2.5 text-sm text-slate-400 outline-none"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-white py-2.5 text-sm font-bold text-black"
            >
              Sign in
            </button>
          </fieldset>

          <p className="mt-4 text-center text-xs text-slate-500">
            SSO / credentials not yet configured.{" "}
            {/* TODO: Replace with Auth.js SSO (Google Workspace or Okta) */}
            Contact <span className="text-slate-300">admin@myogenixpharma.com</span>.
          </p>
        </div>

        {/* Dev bypass — non-production only */}
        {/* TODO: remove dev bypass before real auth launch */}
        {(
          <div className="mt-4 rounded-2xl border border-amber-600/30 bg-amber-500/10 p-4">
            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-400">
              Dev stub — not visible in production
            </p>
            <p className="mb-4 text-xs text-amber-300/80">
              Enter the admin portal as a specific role to test role-gated UI.
            </p>
            <div className="space-y-2">
              {DEV_ROLES.map(({ role, label, description }) => (
                <form key={role} action={devAdminBypassAction}>
                  <input type="hidden" name="role" value={role} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border border-amber-500/30 bg-slate-800 px-4 py-3 text-left transition-colors hover:bg-slate-700"
                  >
                    <p className="text-xs font-bold text-amber-300">{label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="font-semibold text-slate-400 hover:text-white">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
