import type { Metadata } from "next";
import Link from "next/link";
import {
  STUB_ALL_ORDERS,
  STUB_AUDIT_LOG,
  getPatientById,
} from "@/lib/admin-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";
import { AUDIT_ACTION_LABELS } from "@/lib/admin-types";

export const metadata: Metadata = {
  title: "Dashboard — Admin | MyoGenix Pharma",
};

const STATUS_BUCKETS = [
  { status: "pending_intake",  label: "Intake pending",  color: "bg-amber-50  border-amber-200 text-amber-700"  },
  { status: "pending_review",  label: "Awaiting review", color: "bg-blue-50   border-blue-200  text-blue-700",  urgent: true },
  { status: "approved",        label: "Approved",        color: "bg-green-50  border-green-200 text-green-700"  },
  { status: "shipped",         label: "In transit",      color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
] as const;

export default function AdminDashboardPage() {
  const recentAudit = [...STUB_AUDIT_LOG]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const pendingReview = STUB_ALL_ORDERS.filter((o) => o.status === "pending_review");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Operations overview.</p>
      </div>

      {/* Queue stats */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_BUCKETS.map((bucket) => {
          const count = STUB_ALL_ORDERS.filter((o) => o.status === bucket.status).length;
          return (
            <Link
              key={bucket.status}
              href={`/admin/orders?status=${bucket.status}`}
              className={`rounded-2xl border p-5 transition-opacity hover:opacity-80 ${bucket.color}`}
            >
              <p className="text-3xl font-bold">{count}</p>
              <p className="mt-1 text-xs font-semibold">{bucket.label}</p>
              {"urgent" in bucket && bucket.urgent && count > 0 && (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-70">
                  Needs attention
                </p>
              )}
            </Link>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Review queue */}
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pending review queue
            </p>
            <Link href="/admin/orders?status=pending_review" className="text-xs font-semibold text-slate-500 hover:text-black">
              View all →
            </Link>
          </div>

          {pendingReview.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
              <p className="text-sm font-semibold text-slate-500">Queue is clear</p>
              <p className="mt-1 text-xs text-slate-400">No orders awaiting provider review.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingReview.map((order) => {
                const patient = getPatientById(order.patientId);
                const medicineName = order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
                const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                });
                return (
                  <Link
                    key={order.orderId}
                    href={`/admin/orders/${order.orderId}`}
                    className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {patient ? `${patient.firstName[0]}${patient.lastName[0]}` : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown patient"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {medicineName} · {order.orderId} · {createdDate}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                      Review →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Recent activity
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white">
            {recentAudit.map((entry, i) => {
              const actionLabel = AUDIT_ACTION_LABELS[entry.action];
              const ts = new Date(entry.timestamp);
              const timeStr = ts.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " + ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              const isSystem = entry.performedBy === "patient" || entry.performedBy === "system";
              return (
                <div key={entry.logId} className={`flex items-start gap-3 px-4 py-3 ${i < recentAudit.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isSystem ? "bg-slate-100" : "bg-slate-800"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${isSystem ? "bg-slate-400" : "bg-white"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{actionLabel}</p>
                    <p className="text-[11px] text-slate-400">
                      <Link href={`/admin/orders/${entry.orderId}`} className="font-medium text-slate-500 hover:text-black">
                        {entry.orderId}
                      </Link>
                      {" · "}{entry.performedByName}
                    </p>
                    <p className="text-[10px] text-slate-300">{timeStr}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
