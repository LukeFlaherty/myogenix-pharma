/**
 * Site Layout
 * ===========
 * Wraps all public-facing pages with Navbar, Footer, and the AffiliateBanner.
 *
 * The layout is async so it can read the affiliate cookie server-side before
 * rendering. This means affiliate attribution is always available to child
 * pages that also need it (e.g., the home page popup) — each page calls
 * getAffiliateCode() independently (cookies() is cheap).
 *
 * AFFILIATE BANNER
 * Shown only when the visitor arrived via a ?store=<slug> referral link.
 * The banner appears between the Navbar and main content.
 *
 * TO ADD GLOBAL BANNERS (e.g., a site-wide sale notice):
 *   Add them here, above or below the AffiliateBanner, so they appear on
 *   every site page without repeating in each page component.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AffiliateBanner } from "@/components/affiliate/AffiliateBanner";
import { getAffiliateCode, affiliateDisplayName } from "@/lib/affiliate";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const affiliateSlug = await getAffiliateCode();

  return (
    <>
      <Navbar />
      {affiliateSlug && (
        <AffiliateBanner
          slug={affiliateSlug}
          displayName={affiliateDisplayName(affiliateSlug)}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
