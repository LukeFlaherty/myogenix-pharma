"use server";

/**
 * Portal server actions.
 * Importable in both server and client components.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("dev_portal_bypass");
  // TODO: cookieStore.delete("next-auth.session-token");
  redirect("/portal/login");
}

export async function devBypassLoginAction() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Dev bypass is not available in production.");
  }
  const cookieStore = await cookies();
  cookieStore.set("dev_portal_bypass", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  redirect("/portal/dashboard");
}
