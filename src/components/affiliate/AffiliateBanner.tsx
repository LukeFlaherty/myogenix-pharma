"use client";

/**
 * AffiliateBanner
 * ================
 * Displayed at the top of every site page when a visitor arrived via an
 * affiliate referral link (i.e. ?store=<slug>). The slug is captured by
 * middleware into an HTTP-only cookie (see src/middleware.ts), read
 * server-side in the site layout, and passed here as a prop.
 *
 * BEHAVIOUR
 * - Renders a slim top banner acknowledging the referral.
 * - Has a dismiss (×) button that hides it for the current browser session
 *   via sessionStorage. The HTTP-only cookie is unaffected — affiliate
 *   attribution continues to work for checkout even after dismissal.
 * - Re-appears on a new browser session (new tab session, private window, etc.)
 *   while the cookie is still valid (30 days).
 * - If the user has already dismissed in this session, the banner is hidden
 *   after hydration with no visible flash (uses a mounted guard).
 *
 * UPGRADE NOTES
 * - Once an `affiliates` table exists, replace `displayName` with the real
 *   affiliate name from the DB (looked up in the server layout before passing).
 * - To show a custom affiliate discount or message, extend the props interface
 *   and pass additional data from the server layout.
 *
 * USAGE (in src/app/(site)/layout.tsx)
 * ─────────────────────────────────────
 *   const slug = await getAffiliateCode();
 *   if (slug) {
 *     <AffiliateBanner slug={slug} displayName={affiliateDisplayName(slug)} />
 *   }
 */

import { useEffect, useState } from "react";

interface AffiliateBannerProps {
  /** Raw affiliate slug from the cookie, e.g. "jakesvitamin". */
  slug: string;
  /** Human-readable name to show in the banner. Currently just formatted slug. */
  displayName: string;
}

/** sessionStorage key prefix — suffixed with slug so multi-affiliate tabs work. */
const SESSION_KEY_PREFIX = "myogenix_affiliate_banner_dismissed_";

export function AffiliateBanner({ slug, displayName }: AffiliateBannerProps) {
  // Start as not-dismissed so the server-rendered HTML (which shows the banner)
  // matches the initial client render — preventing a React hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(`${SESSION_KEY_PREFIX}${slug}`)) {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable (e.g., private browsing in some browsers)
    }
  }, [slug]);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(`${SESSION_KEY_PREFIX}${slug}`, "1");
    } catch {
      // sessionStorage unavailable — dismiss is still applied for this render
    }
  }

  // While not mounted (SSR / initial paint), render the banner so there's no
  // layout shift. After mount, hide if already dismissed in this session.
  if (mounted && dismissed) return null;

  return (
    <div
      role="banner"
      aria-label={`Referred by ${displayName}`}
      className="relative flex items-center justify-center bg-black px-10 py-2.5 text-center text-xs font-medium text-white"
    >
      <span>
        You&apos;re shopping via{" "}
        <span className="font-bold">{displayName}</span>
        &apos;s referral link — your attribution has been saved.
      </span>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss affiliate banner"
        className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5l7 7M8.5 1.5l-7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
