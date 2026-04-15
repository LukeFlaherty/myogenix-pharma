"use client";

/**
 * CheckoutShell
 * =============
 * Handles one checkout session: patient info → payment → review → submit.
 * Accepts ONE or MANY OrderConfigs — the same flow covers both a single PDP
 * purchase and a full multi-medicine cart checkout.
 *
 * AFTER PAYMENT the patient is sent to /checkout/confirmation, which then
 * directs them to their portal dashboard. The portal shows a separate
 * "Complete intake" action for each order that still needs a questionnaire.
 * This replaces the old per-order direct-to-intake routing and allows the
 * patient to complete each intake form independently at their own pace.
 *
 * ─── DATABASE STUB ────────────────────────────────────────────────────────────
 * On submit, replace the stub block with a real server action:
 *
 *   const { batchId, orderIds } = await createOrderBatch({
 *     orders,                                 // OrderConfig[]
 *     patient,                                // PatientInfo
 *     stripePaymentMethodId: payment._stripePaymentMethodId,
 *     affiliateSlug,                          // from HTTP-only cookie (pass as prop)
 *   });
 *
 * The server action should:
 *   1. Upsert the patient row (by email)
 *   2. Create a Stripe PaymentIntent for the grand total
 *   3. Insert one `order_batches` row → batchId
 *   4. Insert one `orders` row per OrderConfig with status "pending_intake"
 *   5. Return { batchId, orderIds }
 *
 * Then redirect to:
 *   /checkout/confirmation?batch=<encodeBatch(orders)>&orderIds=<ids>
 *
 * STUB: generates fake order IDs and skips all server-side work.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OrderConfig, PatientInfo, PaymentFormState } from "@/lib/checkout-types";
import { encodeBatch, calcBatchTotal } from "@/lib/order-params";
import { CheckoutStepper } from "./CheckoutStepper";
import { PatientInfoForm } from "./PatientInfoForm";
import { PaymentPanel } from "./PaymentPanel";
import { OrderReviewPanel } from "./OrderReviewPanel";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";

const EMPTY_PATIENT: PatientInfo = {
  firstName: "", lastName: "", email: "", phone: "",
  dob: "", sex: "", state: "", address1: "", address2: "",
  city: "", zip: "",
};

const EMPTY_PAYMENT: PaymentFormState = {
  cardholderName: "",
  _stripePaymentMethodId: null,
};

interface Props {
  /** One or more medicines being purchased in this session. */
  orders: OrderConfig[];
  /** Display name of the referring affiliate store. Null if no attribution. */
  affiliateName: string | null;
}

export function CheckoutShell({ orders, affiliateName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [patient, setPatient] = useState<PatientInfo>(EMPTY_PATIENT);
  const [payment, setPayment] = useState<PaymentFormState>(EMPTY_PAYMENT);
  const [submitting, setSubmitting] = useState(false);

  const handlePatientChange = useCallback(
    (field: keyof PatientInfo, value: string) =>
      setPatient((p) => ({ ...p, [field]: value })),
    []
  );

  const handlePaymentChange = useCallback(
    (field: keyof PaymentFormState, value: string) =>
      setPayment((p) => ({ ...p, [field]: value })),
    []
  );

  const grandTotal = calcBatchTotal(orders);
  const isSingle = orders.length === 1;

  // ── Routing helpers ──────────────────────────────────────────────────────────

  /**
   * Builds the confirmation URL with encoded order configs + order IDs.
   * The confirmation page decodes the batch for display and links to the portal.
   */
  function buildConfirmationUrl(orderIds: string[]): string {
    const batch = encodeBatch(orders);
    return `/checkout/confirmation?batch=${batch}&orderIds=${orderIds.join(",")}`;
  }

  // ── Dev skip (bypasses payment panel in development) ────────────────────────

  function handleDevSkip() {
    const fakeOrderIds = orders.map(
      () => `ORD-DEV-${Date.now().toString(36).toUpperCase()}`
    );
    router.push(buildConfirmationUrl(fakeOrderIds));
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitting(true);

    // ── STUB ──────────────────────────────────────────────────────────────────
    // Replace with: const { orderIds } = await createOrderBatch({ orders, patient, payment });
    // See file-level comment for full server action spec.
    await new Promise((r) => setTimeout(r, 1200));
    const fakeOrderIds = orders.map(
      () => `ORD-${Date.now().toString(36).toUpperCase()}`
    );
    // ─────────────────────────────────────────────────────────────────────────

    router.push(buildConfirmationUrl(fakeOrderIds));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Affiliate attribution banner */}
      {affiliateName && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-emerald-600">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" opacity=".2"/>
            <path d="M2 8.5l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm text-emerald-800">
            Referred by <span className="font-semibold">{affiliateName}</span> — thank you for supporting our retail partners.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Checkout</h1>
          <Link
            href="/weight-management"
            className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-black"
          >
            ← Continue shopping
          </Link>
        </div>
        <CheckoutStepper current={step} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: form steps */}
        <div>
          {/* Step 1: Patient info */}
          <div className={step === 1 ? "block" : "hidden"}>
            <PatientInfoForm data={patient} onChange={handlePatientChange} />
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-2xl bg-black py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
            >
              Continue to payment →
            </button>
          </div>

          {/* Step 2: Payment */}
          <div className={step === 2 ? "block" : "hidden"}>
            <PaymentPanel data={payment} onChange={handlePaymentChange} onDevSkip={handleDevSkip} />
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-2xl border border-zinc-200 px-6 py-4 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-2xl bg-black py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                Review order →
              </button>
            </div>
          </div>

          {/* Step 3: Review */}
          <div className={step === 3 ? "block" : "hidden"}>
            <div className="space-y-6">
              <p className="text-base font-bold text-black">Review your order</p>

              {/* Patient summary */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Patient info</p>
                  <button onClick={() => setStep(1)} className="text-xs text-zinc-400 underline hover:text-black">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  <span className="text-zinc-400">Name</span>
                  <span className="font-medium text-black">{patient.firstName} {patient.lastName}</span>
                  <span className="text-zinc-400">Email</span>
                  <span className="font-medium text-black">{patient.email || "—"}</span>
                  <span className="text-zinc-400">DOB</span>
                  <span className="font-medium text-black">{patient.dob || "—"}</span>
                  <span className="text-zinc-400">Shipping</span>
                  <span className="font-medium text-black">
                    {patient.address1 ? `${patient.address1}, ${patient.city}, ${patient.state} ${patient.zip}` : "—"}
                  </span>
                </div>
              </div>

              {/* Payment summary */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Payment</p>
                  <button onClick={() => setStep(2)} className="text-xs text-zinc-400 underline hover:text-black">Edit</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-base">💳</div>
                  <div>
                    <p className="text-xs font-semibold text-black">
                      {payment.cardholderName || "Cardholder"}
                    </p>
                    <p className="text-xs text-zinc-400">•••• •••• •••• ••••</p>
                  </div>
                </div>
              </div>

              {/* Programs being ordered — visible on mobile (sidebar hidden) */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:hidden">
                <p className="mb-3 text-sm font-semibold text-black">
                  {isSingle ? "Program" : `Programs (${orders.length})`}
                </p>
                <div className="space-y-3">
                  {orders.map((order, i) => {
                    const config = MEDICINE_CONFIG[order.medicine];
                    const { total } = calcOrderTotal(order);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-700">
                          {config.name}{" "}
                          <span className="text-xs text-zinc-400 capitalize">({order.purchaseType})</span>
                        </span>
                        <span className="font-semibold text-black">${total.toFixed(0)}</span>
                      </div>
                    );
                  })}
                  {!isSingle && (
                    <div className="flex items-baseline justify-between border-t border-zinc-100 pt-2 text-sm">
                      <span className="font-semibold text-zinc-600">Total</span>
                      <span className="font-bold text-black">${grandTotal.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What happens next */}
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">What happens next</p>
                <ol className="space-y-2">
                  {[
                    "Your payment is authorized (not yet captured).",
                    isSingle
                      ? "You'll complete a short medical intake questionnaire from your portal."
                      : `You'll complete a separate medical intake for each of your ${orders.length} programs, accessible from your patient portal.`,
                    "A licensed provider reviews each order within 24 hours.",
                    "Once approved, payment is captured and your order ships.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-zinc-600">{i + 1}</span>
                      {text}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-2xl border border-zinc-200 px-6 py-4 text-sm font-semibold text-black transition-colors hover:border-zinc-400"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Placing order…
                    </>
                  ) : (
                    `Place order — $${grandTotal.toFixed(0)} →`
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-zinc-400">
                By placing this order you agree to our{" "}
                <a href="#" className="underline">Terms of Service</a>{" "}
                and authorize the charge described above.
              </p>
            </div>
          </div>
        </div>

        {/* Right: sticky summary */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <OrderReviewPanel orders={orders} affiliateName={affiliateName} />
          </div>
        </div>
      </div>
    </div>
  );
}
