/**
 * Popup System — Type Definitions
 * ================================
 * The popup system is intentionally page-scoped: each page that wants a popup
 * imports the appropriate popup component and places it in its JSX, passing a
 * PopupConfig that controls timing, suppression, and copy.
 *
 * ─── HOW TO ADD A POPUP TO A NEW PAGE ────────────────────────────────────────
 *
 * 1. Import the popup component in your page:
 *      import { LeadCapturePopup } from "@/components/popup/LeadCapturePopup";
 *
 * 2. Define a config at the top of the file (outside the component so it's stable):
 *      const POPUP_CONFIG: PopupConfig = {
 *        storageKey:   "myogenix_popup_peptides_v1",   // unique per popup variant
 *        delayMs:      6000,                            // 6 s delay
 *        suppressDays: 14,                              // re-show after 14 days
 *        heading:      "Peptide insiders get 10% off",
 *        body:         "Enter your details to unlock your exclusive code.",
 *        source:       "peptides_popup",
 *      };
 *
 * 3. Place it as the first child in your page's return:
 *      export default async function PeptidesPage() {
 *        const affiliateSlug = await getAffiliateCode();   // optional, for attribution
 *        return (
 *          <>
 *            <LeadCapturePopup config={POPUP_CONFIG} affiliateSlug={affiliateSlug} />
 *            <HeroSection />
 *            ...
 *          </>
 *        );
 *      }
 *
 * ─── FORCING A RESET ─────────────────────────────────────────────────────────
 * To make the popup reappear for all users (e.g., after a major copy change):
 *   - Increment the storageKey version: "myogenix_popup_home_v1" → "..._v2"
 *   - The old key stays in localStorage but is never read again.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface PopupConfig {
  /**
   * Unique localStorage key for tracking per-user suppression.
   * Convention: "myogenix_popup_{page}_{version}"
   * Change the version suffix to reset suppression for all users.
   */
  storageKey: string;

  /**
   * Milliseconds after page mount before the popup appears.
   * @default 4000
   */
  delayMs?: number;

  /**
   * How many days to suppress the popup after the user dismisses OR submits.
   * 0 means never suppress (show every page load — use with caution).
   * @default 7
   */
  suppressDays?: number;

  /**
   * Main heading displayed in the popup before the user submits.
   * @default "Unlock 10% off your first order"
   */
  heading?: string;

  /**
   * Supporting body copy shown under the heading.
   * @default "Enter your email and phone to receive an exclusive discount code."
   */
  body?: string;

  /**
   * Source tag recorded with the lead for attribution and analytics.
   * Should be unique per popup placement.
   * @default "popup"
   */
  source?: string;
}

/** Internal state machine for the popup lifecycle. */
export type PopupPhase =
  | "idle"       // waiting for delay timer, not visible yet
  | "open"       // visible, showing the form
  | "submitted"  // form was submitted, showing success + code
  | "closed";    // dismissed, unmounted
