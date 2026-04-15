/**
 * Home Page
 * =========
 * The lead-capture popup is mounted here so it only appears on the home page.
 * To add a popup to another page, see the guide in
 * src/components/popup/types.ts.
 *
 * POPUP CONFIG
 * ─────────────────────────────────────────────────────────────────────────────
 * storageKey versioning: increment "_v1" → "_v2" to force the popup to
 * reappear for all users (e.g., after updating copy or the discount offer).
 * The old key stays in localStorage but is never read again.
 */

import { Hero } from "@/components/home/Hero";
import { ProgramsGrid } from "@/components/home/ProgramsGrid";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClinicalFaq } from "@/components/sections/ClinicalFaq";
import { LeadCapturePopup } from "@/components/popup/LeadCapturePopup";
import { getAffiliateCode } from "@/lib/affiliate";
import type { PopupConfig } from "@/components/popup/types";

/** Popup configuration for the home page. */
const HOME_POPUP_CONFIG: PopupConfig = {
  storageKey: "myogenix_popup_home_v1",
  delayMs: 4000,       // appear 4 seconds after page load
  suppressDays: 7,     // don't show again for 7 days after dismiss or submit
  heading: "Unlock 10% off your first order",
  body: "Join thousands of patients optimizing their health. Enter your details to receive an exclusive discount code.",
  source: "homepage_popup",
};

export default async function Home() {
  // Resolved server-side so the popup can pass affiliate attribution to the
  // lead capture stub (and eventually the real backend).
  const affiliateSlug = await getAffiliateCode();

  return (
    <>
      {/* Popup — only on this page. Handles its own timing and suppression. */}
      <LeadCapturePopup config={HOME_POPUP_CONFIG} affiliateSlug={affiliateSlug} />

      <Hero />
      <ProgramsGrid />
      <TrustStrip />
      <HowItWorks />
      <ClinicalFaq />
    </>
  );
}
