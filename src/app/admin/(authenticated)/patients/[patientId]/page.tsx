import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPatientById,
  getOrdersByPatient,
  getIntakesByPatient,
  getPrescriptionsByPatient,
} from "@/lib/admin-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";
import { IntakeViewer } from "@/components/admin/IntakeViewer";

interface Props {
  params: Promise<{ patientId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { patientId } = await params;
  const patient = getPatientById(patientId);
  const name = patient ? `${patient.firstName} ${patient.lastName}` : patientId;
  return { title: `${name} — Patient Record | MyoGenix Pharma Admin` };
}

export default async function AdminPatientDetailPage({ params }: Props) {
  const { patientId } = await params;

  const patient       = getPatientById(patientId);
  if (!patient) notFound();

  const orders        = getOrdersByPatient(patientId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const intakes       = getIntakesByPatient(patientId).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  const prescriptions = getPrescriptionsByPatient(patientId).sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );

  const dob  = new Date(patient.dob);
  const age  = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  const totalSpent = orders
    .filter((o) => !["denied", "cancelled"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  const memberSince = new Date(patient.createdAt).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/admin/patients"
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-900"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All patients
      </Link>

      {/* Patient header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {patient.email} · {patient.state} · Age {age} · Member since {memberSince}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { label: "Orders",    value: String(orders.length) },
          { label: "Intakes",   value: String(intakes.length) },
          { label: "Lifetime",  value: `$${totalSpent}` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <section className="mb-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Order history
        </p>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-400">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const statusCfg = ORDER_STATUS_CONFIG[order.status];
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
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{order.orderId}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {medicineName} · ${order.total} · {createdDate}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-slate-300">
                    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Prescriptions */}
      {prescriptions.length > 0 && (
        <section className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            Prescription history
          </p>
          <div className="space-y-2">
            {prescriptions.map((rx) => {
              const medicineName = rx.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
              const issuedDate = new Date(rx.issuedAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              const expiresDate = new Date(rx.expiresAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              return (
                <div key={rx.rxId} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{medicineName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {rx.doseSchedule.map((s) => `${s.mg} mg`).join(" → ")} · by {rx.issuedByName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Issued {issuedDate} · Expires {expiresDate}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${
                        rx.status === "active"   ? "border-green-200 bg-green-50 text-green-700"  :
                        rx.status === "expired"  ? "border-slate-200 bg-slate-50 text-slate-400"  :
                                                   "border-red-200   bg-red-50   text-red-600"
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  {rx.notes && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      {rx.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Intake submissions */}
      <section>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Intake submissions ({intakes.length})
        </p>
        {intakes.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-400">No intake submissions on file.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {intakes.map((intake) => (
              <div key={intake.submissionId} className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Intake for{" "}
                      <Link href={`/admin/orders/${intake.orderId}`} className="text-blue-600 hover:underline">
                        {intake.orderId}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Submitted {new Date(intake.submittedAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <IntakeViewer data={intake.data} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
