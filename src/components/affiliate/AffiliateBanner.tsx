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

import { useCallback, useSyncExternalStore } from "react";

interface AffiliateBannerProps {
  /** Raw affiliate slug from the cookie, e.g. "jakesvitamin". */
  slug: string;
  /** Human-readable name to show in the banner. Currently just formatted slug. */
  displayName: string;
}

/** sessionStorage key prefix — suffixed with slug so multi-affiliate tabs work. */
const SESSION_KEY_PREFIX = "myogenix_affiliate_banner_dismissed_";
const STORE_EVENT = "myogenix-affiliate-banner-storage";

function getDismissedSnapshot(slug: string) {
  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(`${SESSION_KEY_PREFIX}${slug}`) === "1";
  } catch {
    return false;
  }
}

export function AffiliateBanner({ slug, displayName }: AffiliateBannerProps) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener(STORE_EVENT, onStoreChange);
    window.addEventListener("storage", onStoreChange);

    return () => {
      window.removeEventListener(STORE_EVENT, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, []);

  const dismissed = useSyncExternalStore(subscribe, () => getDismissedSnapshot(slug), () => false);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(`${SESSION_KEY_PREFIX}${slug}`, "1");
    } catch {
      // sessionStorage unavailable — dismiss is still applied for this tab.
    }
    window.dispatchEvent(new Event(STORE_EVENT));
  }, [slug]);

  if (dismissed) return null;

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
