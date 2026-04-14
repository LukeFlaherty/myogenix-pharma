import type { Metadata } from "next";
import Link from "next/link";
import { STUB_PATIENTS, STUB_ALL_ORDERS } from "@/lib/admin-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";

export const metadata: Metadata = {
  title: "Patients — Admin | MyoGenix Pharma",
};

export default function AdminPatientsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <p className="mt-1 text-sm text-slate-500">
          {STUB_PATIENTS.length} registered patients.
        </p>
      </div>

      <div className="space-y-2">
        {STUB_PATIENTS.map((patient) => {
          const orders = STUB_ALL_ORDERS.filter((o) => o.patientId === patient.patientId);
          const latestOrder = orders.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          const totalSpent = orders
            .filter((o) => !["denied", "cancelled"].includes(o.status))
            .reduce((sum, o) => sum + o.total, 0);
          const memberSince = new Date(patient.createdAt).toLocaleDateString("en-US", {
            month: "short", year: "numeric",
          });
          const dob = new Date(patient.dob);
          const age = Math.floor(
            (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          );

          return (
            <Link
              key={patient.patientId}
              href={`/admin/patients/${patient.patientId}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-slate-200 hover:bg-slate-50"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className="text-xs text-slate-400">{patient.state} · Age {age}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {patient.email} · {orders.length} order{orders.length !== 1 ? "s" : ""} · Member since {memberSince}
                </p>
              </div>

              {/* Stats */}
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-bold text-slate-900">${totalSpent}</p>
                <p className="text-xs text-slate-400">lifetime</p>
              </div>

              {/* Latest order status */}
              {latestOrder && (
                <span
                  className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:inline-block ${ORDER_STATUS_CONFIG[latestOrder.status].color}`}
                >
                  {ORDER_STATUS_CONFIG[latestOrder.status].label}
                </span>
              )}

              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-slate-300">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
