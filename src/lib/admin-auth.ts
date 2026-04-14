/**
 * Admin portal authentication helpers — server-only (uses next/headers).
 *
 * CURRENT STATE: Dev-bypass via HTTP-only cookie encoding the staff role.
 *   Cookie value: "admin" | "provider" | "pharmacy"
 *   Each maps to a hardcoded StaffMember in admin-stub-data.ts.
 *
 * TO INTEGRATE REAL AUTH (Auth.js / NextAuth v5):
 *   1. Create a separate Auth.js config for staff (different from patient auth):
 *        export const { handlers, auth, signIn, signOut } = NextAuth({
 *          providers: [Credentials({ ... })],  // or SSO (Google Workspace, Okta)
 *          callbacks: {
 *            session({ session, token }) {
 *              session.user.staffId = token.staffId;
 *              session.user.role    = token.role;
 *              return session;
 *            }
 *          }
 *        })
 *   2. Replace getAdminSession() body with:
 *        const session = await auth()
 *        if (!session?.user) return null
 *        const staff = await db.staff.findUnique({ where: { staffId: session.user.staffId } })
 *        if (!staff) return null
 *        return { staffId: staff.id, email: staff.email, role: staff.role, ... }
 *   3. Consider RBAC middleware: src/middleware.ts can gate /admin/* to staff roles only.
 *   4. For production: use a proper identity provider (Okta, Google Workspace, etc.)
 *      rather than credential-based auth for internal staff tools.
 */

import { cookies } from "next/headers";
import type { AdminSession } from "./admin-types";
import { STUB_STAFF } from "./admin-stub-data";

const DEV_ADMIN_BYPASS_COOKIE = "dev_admin_bypass";

// Maps cookie value → staffId in STUB_STAFF
const ROLE_TO_STAFF_ID: Record<string, string> = {
  admin:    "staff_001",
  provider: "staff_002",
  pharmacy: "staff_003",
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();

  // ── Dev bypass ──────────────────────────────────────────────────────────────
  // TODO: remove dev bypass before real auth launch
  const bypass = cookieStore.get(DEV_ADMIN_BYPASS_COOKIE);
  if (bypass?.value && ROLE_TO_STAFF_ID[bypass.value]) {
    const staffId = ROLE_TO_STAFF_ID[bypass.value];
    const staff = STUB_STAFF.find((s) => s.staffId === staffId);
    if (staff) {
      return {
        staffId: staff.staffId,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        isDevStub: true,
      };
    }
  }

  // ── TODO: real session check ──────────────────────────────────────────────
  // const session = await auth()
  // if (!session?.user?.staffId) return null
  // return mapAuthSessionToAdminSession(session)

  return null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_ADMIN_BYPASS_COOKIE);
  // TODO: cookieStore.delete("next-auth.admin-session-token");
}
