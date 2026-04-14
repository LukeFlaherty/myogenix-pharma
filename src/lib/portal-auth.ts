/**
 * Portal authentication helpers — server-only (uses next/headers).
 *
 * CURRENT STATE: Dev-bypass via HTTP-only cookie.
 *
 * TO INTEGRATE REAL AUTH (Auth.js / NextAuth v5):
 *   1. npm install next-auth@beta
 *   2. Create src/auth.ts:
 *        import NextAuth from "next-auth"
 *        import Resend from "next-auth/providers/resend"   // magic-link email
 *        export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [Resend(...)] })
 *   3. Add NEXTAUTH_SECRET + AUTH_RESEND_KEY to .env.local
 *   4. Add src/app/api/auth/[...nextauth]/route.ts:
 *        import { handlers } from "@/auth"
 *        export const { GET, POST } = handlers
 *   5. Replace the body of getPortalSession() below with:
 *        import { auth } from "@/auth"
 *        const session = await auth()
 *        if (!session?.user) return null
 *        return { userId: session.user.id!, email: session.user.email!, ... }
 *   6. Remove the dev_portal_bypass cookie logic entirely.
 */

import { cookies } from "next/headers";
import type { PortalSession } from "./portal-types";
import { DEV_MOCK_SESSION } from "./portal-stub-data";

const DEV_BYPASS_COOKIE = "dev_portal_bypass";

export async function getPortalSession(): Promise<PortalSession | null> {
  const cookieStore = await cookies();

  // ── Dev bypass ──────────────────────────────────────────────────────────────
  // Not available in production. Remove this entire block when real auth lands.
  if (process.env.NODE_ENV !== "production") {
    const bypass = cookieStore.get(DEV_BYPASS_COOKIE);
    if (bypass?.value === "1") {
      return DEV_MOCK_SESSION;
    }
  }

  // ── TODO: real session check ─────────────────────────────────────────────────
  // const sessionToken = cookieStore.get("next-auth.session-token");
  // if (!sessionToken) return null;
  // return await validateAndDecodeToken(sessionToken.value);

  return null;
}

export async function clearPortalSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_BYPASS_COOKIE);
  // TODO: cookieStore.delete("next-auth.session-token");
}
