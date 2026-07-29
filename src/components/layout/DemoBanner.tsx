"use client";

import { useState } from "react";
import Link from "next/link";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-[60] flex flex-col items-center gap-2 border-b border-amber-300 bg-amber-100 px-4 py-2.5 text-center sm:flex-row sm:justify-center">
      <p className="text-xs font-medium text-amber-900 sm:text-sm">
        <span className="font-bold">Demo build</span> — this site is a clickable preview.
        No real orders are placed, no payments are charged, and no data is stored permanently.
      </p>
      <Link
        href="/demo-instructions"
        className="flex-shrink-0 rounded-lg bg-amber-900 px-3 py-1 text-xs font-bold text-amber-50 transition-colors hover:bg-amber-800"
      >
        View demo instructions →
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 text-amber-700 hover:text-amber-900 sm:block"
      >
        ✕
      </button>
    </div>
  );
}
