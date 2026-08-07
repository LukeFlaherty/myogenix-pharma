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
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CreditCard, UserRound } from "lucide-react";
import type { OrderConfig, PatientInfo, PaymentFormState } from "@/lib/checkout-types";
import { encodeBatch, calcBatchTotal } from "@/lib/order-params";
import { CheckoutStepper } from "./CheckoutStepper";
import { PatientInfoForm } from "./PatientInfoForm";
import { PaymentPanel } from "./PaymentPanel";
import { OrderReviewPanel } from "./OrderReviewPanel";
import { calcOrderTotal } from "@/lib/order-params";
import { MEDICINE_CONFIG } from "@/lib/pdp-config";
import { uiFont } from "@/lib/ui-font";

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
  const patientReady = Boolean(
    patient.firstName &&
      patient.lastName &&
      patient.email &&
      patient.dob &&
      patient.sex &&
      patient.address1 &&
      patient.city &&
      patient.state &&
      patient.zip
  );
  const paymentReady = Boolean(payment.cardholderName);

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
    <div className="relative overflow-hidden bg-black text-white">
      <Image
        src="/assets/grunge-redesign/grunge black section bg blank.png"
        alt=""
        fill
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(220,38,38,0.28),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.32),rgba(0,0,0,0.94))]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Affiliate attribution banner */}
        {affiliateName && (
          <div className="mb-6 flex items-center gap-2.5 border border-red-600/50 bg-red-600/10 px-4 py-3">
            <Check className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-zinc-300">
              Referred by <span className="font-semibold text-white">{affiliateName}</span>. Thanks for supporting our retail partners.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-red-700/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={`${uiFont.className} text-[1.25rem] uppercase tracking-[0.24em] text-red-500`}>
              Secure intake
            </p>
            <h1 className={`${uiFont.className} mt-1 text-[4rem] uppercase leading-none tracking-[0.035em] text-white sm:text-[5.5rem]`}>
              Checkout
            </h1>
            <Link
              href="/weight-management"
              className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue shopping
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
              type="button"
              onClick={() => setStep(2)}
              disabled={!patientReady}
              className={`${uiFont.className} mt-6 flex w-full items-center justify-center gap-2 bg-red-600 py-3 text-[1.35rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500`}
            >
              Continue to payment
              <ArrowRight className="h-4 w-4" />
            </button>
            {!patientReady && (
              <p className="mt-3 text-center text-xs text-zinc-500">
                Complete the required patient and shipping fields to continue.
              </p>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={step === 2 ? "block" : "hidden"}>
            <PaymentPanel data={payment} onChange={handlePaymentChange} onDevSkip={handleDevSkip} />
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`${uiFont.className} inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[1.2rem] uppercase leading-none tracking-[0.045em] text-zinc-300 transition-colors hover:border-white/50 hover:text-white`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!paymentReady}
                className={`${uiFont.className} flex flex-1 items-center justify-center gap-2 bg-red-600 py-3 text-[1.35rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500`}
              >
                Review order
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step 3: Review */}
          <div className={step === 3 ? "block" : "hidden"}>
            <div className="space-y-6">
              <p className={`${uiFont.className} text-[2rem] uppercase leading-none tracking-[0.045em] text-white`}>
                Review your order
              </p>

              {/* Patient summary */}
              <div className="grunge-panel border border-white/15 bg-black/72 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    <UserRound className="h-4 w-4 text-red-400" />
                    Patient info
                  </p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-zinc-500 underline hover:text-white">Edit</button>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-x-6 gap-y-1.5 text-xs">
                  <span className="text-zinc-500">Name</span>
                  <span className="font-medium text-white">{patient.firstName} {patient.lastName}</span>
                  <span className="text-zinc-500">Email</span>
                  <span className="font-medium text-white">{patient.email || "-"}</span>
                  <span className="text-zinc-500">DOB</span>
                  <span className="font-medium text-white">{patient.dob || "-"}</span>
                  <span className="text-zinc-500">Shipping</span>
                  <span className="font-medium text-white">
                    {patient.address1 ? `${patient.address1}, ${patient.city}, ${patient.state} ${patient.zip}` : "-"}
                  </span>
                </div>
              </div>

              {/* Payment summary */}
              <div className="grunge-panel border border-white/15 bg-black/72 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    <CreditCard className="h-4 w-4 text-red-400" />
                    Payment
                  </p>
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-zinc-500 underline hover:text-white">Edit</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center border border-white/15 text-red-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {payment.cardholderName || "Cardholder"}
                    </p>
                    <p className="text-xs text-zinc-500">Authorized, capture pending provider approval</p>
                  </div>
                </div>
              </div>

              {/* Programs being ordered — visible on mobile (sidebar hidden) */}
              <div className="grunge-panel border border-white/15 bg-black/72 p-5 lg:hidden">
                <p className="mb-3 text-sm font-semibold text-white">
                  {isSingle ? "Program" : `Programs (${orders.length})`}
                </p>
                <div className="space-y-3">
                  {orders.map((order, i) => {
                    const config = MEDICINE_CONFIG[order.medicine];
                    const { total } = calcOrderTotal(order);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">
                          {config.name}{" "}
                          <span className="text-xs text-zinc-500 capitalize">({order.purchaseType})</span>
                        </span>
                        <span className="font-semibold text-white">${total.toFixed(0)}</span>
                      </div>
                    );
                  })}
                  {!isSingle && (
                    <div className="flex items-baseline justify-between border-t border-white/10 pt-2 text-sm">
                      <span className="font-semibold text-zinc-400">Total</span>
                      <span className="font-bold text-white">${grandTotal.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What happens next */}
              <div className="border border-red-900/70 bg-red-950/20 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400">What happens next</p>
                <ol className="space-y-2">
                  {[
                    "Your payment is authorized (not yet captured).",
                    isSingle
                      ? "You'll complete a short medical intake questionnaire from your portal."
                      : `You'll complete a separate medical intake for each of your ${orders.length} programs, accessible from your patient portal.`,
                    "A licensed provider reviews each order within 24 hours.",
                    "Once approved, payment is captured and your order ships.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-red-600 text-[9px] font-bold text-white">{i + 1}</span>
                      {text}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`${uiFont.className} inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[1.2rem] uppercase leading-none tracking-[0.045em] text-zinc-300 transition-colors hover:border-white/50 hover:text-white`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${uiFont.className} flex flex-1 items-center justify-center gap-2 bg-red-600 py-3 text-[1.35rem] uppercase leading-none tracking-[0.045em] text-white transition-colors hover:bg-red-500 disabled:opacity-60`}
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Placing order...
                    </>
                  ) : (
                    <>
                      {`Place order $${grandTotal.toFixed(0)}`}
                      <ArrowRight className="h-4 w-4" />
                    </>
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
    </div>
  );
}
