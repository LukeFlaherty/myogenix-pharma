import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminOrderById,
  getPatientById,
  getIntakeByOrder,
  getPrescriptionByOrder,
  getAuditLogByOrder,
} from "@/lib/admin-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";
import { AUDIT_ACTION_LABELS, ADMIN_ROLE_CONFIG } from "@/lib/admin-types";
import { IntakeViewer } from "@/components/admin/IntakeViewer";
import { OrderActionPanel } from "@/components/admin/OrderActionPanel";
import { getAdminSession } from "@/lib/admin-auth";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Order ${orderId} — Admin | MyoGenix Pharma` };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderId } = await params;

  const order   = getAdminOrderById(orderId);
  if (!order) notFound();

  const session  = await getAdminSession();
  const patient  = getPatientById(order.patientId);
  const intake   = getIntakeByOrder(orderId);
  const rx       = getPrescriptionByOrder(orderId);
  const auditLog = getAuditLogByOrder(orderId);

  const statusCfg    = ORDER_STATUS_CONFIG[order.status];
  const medicineName = order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
  const createdDate  = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const dob = patient?.dob ? new Date(patient.dob) : null;
  const age = dob
    ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-900"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{order.orderId}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {medicineName} · {order.purchaseType === "subscription" ? `${order.monthCount}-month subscription` : "One-time"} · Placed {createdDate}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusCfg.color}`}>
          {statusCfg.label}
        </span>
      </div>

      {/* Patient card */}
      <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Patient</p>
        {patient ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">{patient.firstName} {patient.lastName}</p>
              <p className="text-xs text-slate-500">{patient.email}</p>
              <p className="text-xs text-slate-400">
                DOB {patient.dob}{age != null ? ` (age ${age})` : ""} · {patient.state}
              </p>
            </div>
            <Link
              href={`/admin/patients/${patient.patientId}`}
              className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-400 hover:text-black"
            >
              Full record →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Patient record not found.</p>
        )}
      </section>

      {/* Action panel */}
      {session && (
        <section className="mb-6">
          <OrderActionPanel order={order} role={session.role} />
        </section>
      )}

      {/* Provider note */}
      {order.providerNote && (
        <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-600">Provider note</p>
          <p className="text-sm text-slate-700">{order.providerNote}</p>
        </section>
      )}

      {/* Intake submission */}
      <section className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Medical intake
        </p>
        {intake ? (
          <IntakeViewer data={intake.data} submittedAt={intake.submittedAt} />
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-700">
              {order.intakeCompleted
                ? "Intake marked complete but submission not found."
                : "Patient has not yet completed their intake questionnaire."}
            </p>
          </div>
        )}
      </section>

      {/* Dosing plan + order summary */}
      <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Order summary
        </p>
        <div className="mb-4 space-y-2">
          {order.selections.map((sel) => (
            <div key={sel.month} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="text-sm text-slate-500">Month {sel.month}</span>
              <span className="text-sm font-bold text-slate-900">{sel.mg} mg / week</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Medicine</span>
            <span className="font-semibold text-slate-900">{medicineName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Purchase type</span>
            <span className="font-semibold text-slate-900 capitalize">{order.purchaseType}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-slate-900">${order.total}</span>
          </div>
        </div>
      </section>

      {/* Prescription */}
      {rx && (
        <section className="mb-6 rounded-2xl border border-green-100 bg-white p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Prescription
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Rx ID</span>
              <span className="font-mono text-xs font-semibold text-slate-700">{rx.rxId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issued by</span>
              <span className="font-semibold text-slate-900">{rx.issuedByName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issued</span>
              <span className="font-semibold text-slate-900">
                {new Date(rx.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expires</span>
              <span className="font-semibold text-slate-900">
                {new Date(rx.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={`font-bold capitalize ${rx.status === "active" ? "text-green-700" : rx.status === "expired" ? "text-slate-400" : "text-red-600"}`}>
                {rx.status}
              </span>
            </div>
            {rx.notes && (
              <div className="border-t border-slate-100 pt-2">
                <p className="text-xs text-slate-400 mb-1">Clinical notes</p>
                <p className="text-xs text-slate-700">{rx.notes}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Audit log */}
      <section>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Audit log
        </p>
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
          {auditLog.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">No activity recorded.</p>
          ) : (
            auditLog.map((entry, i) => {
              const ts = new Date(entry.timestamp);
              const dateStr = ts.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const timeStr = ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              const isSystem = entry.performedBy === "system" || entry.performedBy === "patient";

              return (
                <div key={entry.logId} className={`flex gap-4 px-5 py-4 ${i < auditLog.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isSystem ? "bg-slate-100" : "bg-slate-900"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${isSystem ? "bg-slate-400" : "bg-white"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {AUDIT_ACTION_LABELS[entry.action]}
                      </p>
                      <p className="text-xs text-slate-400">{dateStr} · {timeStr}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      by {entry.performedByName}
                    </p>
                    {entry.note && (
                      <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
