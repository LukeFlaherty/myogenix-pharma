import type { Metadata } from "next";
import Link from "next/link";
import { getPortalSession } from "@/lib/portal-auth";
import { STUB_ORDERS, getPortalActions } from "@/lib/portal-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";

export const metadata: Metadata = {
  title: "Dashboard — Patient Portal | MyoGenix Pharma",
};

function greeting(firstName: string) {
  const h = new Date().getHours();
  const tod = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${tod}, ${firstName}`;
}

export default async function DashboardPage() {
  const session = await getPortalSession();
  const actions = getPortalActions(STUB_ORDERS);
  const recentOrders = STUB_ORDERS.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">{greeting(session!.firstName)}</h1>
        <p className="mt-1 text-sm text-zinc-500">Here&apos;s what needs your attention.</p>
      </div>

      {/* Pending actions */}
      {actions.length > 0 && (
        <section className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
            Action required
          </p>
          <div className="space-y-3">
            {actions.map((action) => (
              <div
                key={`${action.type}-${action.orderId}`}
                className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 2L1 13h13L7.5 2z" stroke="#d97706" strokeWidth="1.25" strokeLinejoin="round" />
                    <path d="M7.5 6v3.5" stroke="#d97706" strokeWidth="1.25" strokeLinecap="round" />
                    <circle cx="7.5" cy="11" r="0.7" fill="#d97706" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black">{action.label}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">{action.description}</p>
                </div>
                <Link
                  href={action.href}
                  className="shrink-0 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Start →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No pending actions */}
      {actions.length === 0 && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5l3 3 6-6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-green-800">You&apos;re all caught up — no actions needed right now.</p>
        </div>
      )}

      {/* Recent orders */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Recent orders</p>
          <Link href="/portal/orders" className="text-xs font-semibold text-black hover:underline">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-8 text-center">
            <p className="text-sm text-zinc-400">No orders yet.</p>
            <Link
              href="/weight-management"
              className="mt-3 inline-block text-sm font-semibold text-black hover:underline"
            >
              Browse programs →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusCfg = ORDER_STATUS_CONFIG[order.status];
              const medicineName =
                order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
              return (
                <Link
                  key={order.orderId}
                  href={`/portal/orders/${order.orderId}`}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 transition-colors hover:border-zinc-200 hover:bg-zinc-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2.5h1.2c.44 0 .83.3.94.72l.33 1.25M4.5 4.47h9.72c.56 0 .96.54.8 1.08l-1.3 4.5a.87.87 0 01-.84.62H6.5m-2-1.17L2 2.5" stroke="#71717a" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="6" cy="13" r="1" fill="#71717a" />
                      <circle cx="12" cy="13" r="1" fill="#71717a" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-black">{order.orderId}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {medicineName} · {order.purchaseType === "subscription" ? `${order.monthCount}-month plan` : "One-time"} · ${order.total}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-zinc-300">
                    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
