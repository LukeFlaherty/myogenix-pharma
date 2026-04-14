import { NextRequest, NextResponse } from "next/server";

/**
 * Affiliate tracking middleware.
 *
 * Captures ?store=<slug> from any public site URL and stores it in an
 * HTTP-only cookie (30-day window). The cookie is read server-side at
 * checkout to attribute the conversion to the referring affiliate store.
 *
 * Security:
 *   - Input sanitized to [a-z0-9_-], max 64 chars
 *   - HTTP-only: no JS access, immune to XSS cookie theft
 *   - SameSite=Lax: CSRF-safe, works with normal link clicks
 *   - Secure flag enabled in production
 *
 * TO UPGRADE (real DB):
 *   1. Validate slug against an `affiliates` table before setting cookie
 *   2. Log impression (pageview) to an `affiliate_events` table
 *   3. On order creation, read the cookie and write a `conversions` row
 */

export const config = {
  // Run on all public site pages; skip admin, portal, intake, Next.js internals, static files
  matcher: ["/((?!admin|portal|intake|_next|api|.*\\..*).*)"],
};

const AFFILIATE_COOKIE = "affiliate_store";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest): NextResponse {
  const { searchParams } = request.nextUrl;
  const raw = searchParams.get("store");

  // No store param — pass through but preserve any existing cookie
  if (!raw) return NextResponse.next();

  // Sanitize: lowercase alphanumeric, hyphens, underscores only; max 64 chars
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 64);

  if (!slug) return NextResponse.next();

  const response = NextResponse.next();
  response.cookies.set(AFFILIATE_COOKIE, slug, {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
