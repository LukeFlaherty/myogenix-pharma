import type { Metadata } from "next";
import Link from "next/link";
import { STUB_ORDERS } from "@/lib/portal-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";

export const metadata: Metadata = {
  title: "Orders — Patient Portal | MyoGenix Pharma",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">Your full order history.</p>
      </div>

      {STUB_ORDERS.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-12 text-center">
          <p className="text-sm text-zinc-400">No orders yet.</p>
          <Link
            href="/weight-management"
            className="mt-4 inline-block rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
          >
            Browse programs →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {STUB_ORDERS.map((order) => {
            const statusCfg = ORDER_STATUS_CONFIG[order.status];
            const medicineName =
              order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Link
                key={order.orderId}
                href={`/portal/orders/${order.orderId}`}
                className="block rounded-2xl border border-zinc-100 bg-white p-5 transition-colors hover:border-zinc-200 hover:bg-zinc-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-black">{order.orderId}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">
                      {medicineName} —{" "}
                      {order.purchaseType === "subscription"
                        ? `${order.monthCount}-month subscription`
                        : "One-time order"}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">Placed {dateStr}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-black">${order.total}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-300">
                      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Dosing summary */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {order.selections.map((sel) => (
                    <span
                      key={sel.month}
                      className="rounded-lg bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500"
                    >
                      Mo {sel.month}: {sel.mg} mg
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
