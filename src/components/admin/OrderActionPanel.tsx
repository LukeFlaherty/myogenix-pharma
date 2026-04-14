"use client";

import { useState, useTransition } from "react";
import {
  approveOrderAction,
  denyOrderAction,
  requestBloodworkAction,
  addProviderNoteAction,
  markShippedAction,
  markDeliveredAction,
} from "@/lib/admin-actions";
import type { AdminRole, AdminOrder } from "@/lib/admin-types";

interface Props {
  order: AdminOrder;
  role: AdminRole;
}

type ActionKey =
  | "approve"
  | "deny"
  | "bloodwork"
  | "note"
  | "ship"
  | "deliver"
  | null;

function SubmitButton({ label, pending, variant = "primary" }: {
  label: string;
  pending: boolean;
  variant?: "primary" | "danger" | "secondary";
}) {
  const base = "rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50";
  const styles = {
    primary:   `${base} bg-black text-white hover:bg-zinc-800`,
    danger:    `${base} bg-red-600 text-white hover:bg-red-700`,
    secondary: `${base} border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:text-black`,
  };
  return (
    <button type="submit" disabled={pending} className={styles[variant]}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function OrderActionPanel({ order, role }: Props) {
  const [selected, setSelected] = useState<ActionKey>(null);
  const [isPending, startTransition] = useTransition();

  const { status } = order;
  const isProvider = role === "provider" || role === "admin";
  const isPharmacy = role === "pharmacy" || role === "admin";

  const canApprove        = isProvider && status === "pending_review";
  const canDeny           = isProvider && (status === "pending_review" || status === "pending_intake");
  const canRequestBloodwork = isProvider && (status === "pending_review" || status === "pending_intake");
  const canAddNote        = isProvider;
  const canMarkShipped    = isPharmacy && status === "approved";
  const canMarkDelivered  = isPharmacy && status === "shipped";

  const hasAnyAction = canApprove || canDeny || canRequestBloodwork || canAddNote || canMarkShipped || canMarkDelivered;

  if (!hasAnyAction) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-400">No actions available for this order in its current state.</p>
      </div>
    );
  }

  function handleAction(action: ServerAction, formData: FormData) {
    startTransition(async () => {
      await action(formData);
      setSelected(null);
    });
  }

  type ServerAction = (formData: FormData) => Promise<void>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        Actions
      </p>

      {/* Action selector buttons */}
      {selected === null && (
        <div className="flex flex-wrap gap-2">
          {canApprove && (
            <button
              onClick={() => setSelected("approve")}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              Approve order
            </button>
          )}
          {canDeny && (
            <button
              onClick={() => setSelected("deny")}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              Deny order
            </button>
          )}
          {canRequestBloodwork && (
            <button
              onClick={() => setSelected("bloodwork")}
              className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100"
            >
              Request bloodwork
            </button>
          )}
          {canAddNote && (
            <button
              onClick={() => setSelected("note")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:text-black"
            >
              Add provider note
            </button>
          )}
          {canMarkShipped && (
            <button
              onClick={() => setSelected("ship")}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            >
              Mark as shipped
            </button>
          )}
          {canMarkDelivered && (
            <button
              onClick={() => setSelected("deliver")}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              Mark as delivered
            </button>
          )}
        </div>
      )}

      {/* ── Approve form ──────────────────────────────────────────────────────── */}
      {selected === "approve" && (
        <form
          action={(fd) => handleAction(approveOrderAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Approval note <span className="font-normal text-slate-400">(optional — visible to patient)</span>
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="e.g. Approved. Starting at 2.5 mg — escalate as tolerated."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Confirm approval" pending={isPending} />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Deny form ─────────────────────────────────────────────────────────── */}
      {selected === "deny" && (
        <form
          action={(fd) => handleAction(denyOrderAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Reason for denial <span className="font-normal text-slate-400">(visible to patient)</span>
            </label>
            <textarea
              name="note"
              rows={3}
              required
              placeholder="e.g. Contraindicated due to personal/family history of MTC. Please consult your primary care provider."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Confirm denial" pending={isPending} variant="danger" />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Bloodwork form ────────────────────────────────────────────────────── */}
      {selected === "bloodwork" && (
        <form
          action={(fd) => handleAction(requestBloodworkAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Bloodwork request note <span className="font-normal text-slate-400">(visible to patient)</span>
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="e.g. Please upload recent labs (HbA1c, CMP) from the past 6 months before we can proceed."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Send bloodwork request" pending={isPending} variant="secondary" />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Add note form ─────────────────────────────────────────────────────── */}
      {selected === "note" && (
        <form
          action={(fd) => handleAction(addProviderNoteAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Provider note <span className="font-normal text-slate-400">(visible to patient)</span>
            </label>
            <textarea
              name="note"
              rows={3}
              required
              placeholder="e.g. Reviewing your labs now. Expect a decision by tomorrow morning."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Save note" pending={isPending} />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Mark shipped form ─────────────────────────────────────────────────── */}
      {selected === "ship" && (
        <form
          action={(fd) => handleAction(markShippedAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tracking number
              </label>
              <input
                name="trackingNumber"
                type="text"
                required
                placeholder="e.g. 1ZA9999W0123456784"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Est. delivery date <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                name="estimatedDelivery"
                type="date"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <SubmitButton label="Mark as shipped" pending={isPending} />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Mark delivered form ───────────────────────────────────────────────── */}
      {selected === "deliver" && (
        <form
          action={(fd) => handleAction(markDeliveredAction, fd)}
          className="space-y-3"
        >
          <input type="hidden" name="orderId" value={order.orderId} />
          <p className="text-sm text-slate-600">
            Confirm that order <span className="font-bold text-black">{order.orderId}</span> has been delivered.
          </p>
          <div className="flex gap-2">
            <SubmitButton label="Confirm delivery" pending={isPending} />
            <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-black">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
