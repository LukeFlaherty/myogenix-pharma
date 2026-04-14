import type { Metadata } from "next";
import Link from "next/link";
import { STUB_ALL_ORDERS, getPatientById } from "@/lib/admin-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";
import type { OrderStatus } from "@/lib/portal-types";

export const metadata: Metadata = {
  title: "Orders — Admin | MyoGenix Pharma",
};

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all",             label: "All" },
  { value: "pending_intake",  label: "Intake pending" },
  { value: "pending_review",  label: "Pending review" },
  { value: "approved",        label: "Approved" },
  { value: "shipped",         label: "Shipped" },
  { value: "delivered",       label: "Delivered" },
  { value: "denied",          label: "Denied" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = status ?? "all";

  const filtered =
    activeStatus === "all"
      ? STUB_ALL_ORDERS
      : STUB_ALL_ORDERS.filter((o) => o.status === activeStatus);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          {STUB_ALL_ORDERS.length} total orders across all patients.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {STATUS_TABS.map(({ value, label }) => {
          const count =
            value === "all"
              ? STUB_ALL_ORDERS.length
              : STUB_ALL_ORDERS.filter((o) => o.status === value).length;
          const isActive = activeStatus === value;
          return (
            <Link
              key={value}
              href={value === "all" ? "/admin/orders" : `/admin/orders?status=${value}`}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-black"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Order list */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
          <p className="text-sm text-slate-400">No orders in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((order) => {
            const patient = getPatientById(order.patientId);
            const statusCfg = ORDER_STATUS_CONFIG[order.status as OrderStatus];
            const medicineName = order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
            const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            });

            return (
              <Link
                key={order.orderId}
                href={`/admin/orders/${order.orderId}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-colors hover:border-slate-200 hover:bg-slate-50"
              >
                {/* Patient avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {patient ? `${patient.firstName[0]}${patient.lastName[0]}` : "?"}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                    </span>
                    <span className="text-xs text-slate-400">{order.orderId}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {medicineName} · {order.purchaseType === "subscription" ? `${order.monthCount}-month sub` : "One-time"} · ${order.total} · {createdDate}
                  </p>
                </div>

                {/* Intake flag */}
                {!order.intakeCompleted && (
                  <span className="shrink-0 rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                    No intake
                  </span>
                )}

                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-slate-300">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
