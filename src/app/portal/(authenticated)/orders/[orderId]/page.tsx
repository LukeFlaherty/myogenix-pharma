import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STUB_ORDERS, getOrderTimeline, portalOrderToConfig } from "@/lib/portal-stub-data";
import { ORDER_STATUS_CONFIG } from "@/lib/portal-types";
import { encodeOrder } from "@/lib/order-params";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Order ${orderId} — Patient Portal | MyoGenix Pharma` };
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const order = STUB_ORDERS.find((o) => o.orderId === orderId);
  if (!order) notFound();

  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const timeline = getOrderTimeline(order);
  const medicineName = order.medicine === "tirzepatide" ? "Tirzepatide" : "Semaglutide";
  const purchaseLabel =
    order.purchaseType === "subscription"
      ? `${order.monthCount}-month subscription`
      : "One-time order";
  const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const updatedDate = new Date(order.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const encodedOrder = encodeOrder(portalOrderToConfig(order));
  const intakeHref = `/intake?order=${encodedOrder}&orderId=${order.orderId}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/portal/orders"
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-black"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-black">{order.orderId}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {medicineName} · {purchaseLabel} · Placed {createdDate}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusCfg.color}`}>
          {statusCfg.label}
        </span>
      </div>

      {/* Pending intake CTA */}
      {order.status === "pending_intake" && !order.intakeCompleted && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="mb-0.5 text-sm font-bold text-black">Action required: complete your intake</p>
          <p className="mb-4 text-xs text-zinc-600">
            Your medical intake questionnaire must be submitted before our provider team can review this order.
          </p>
          <Link
            href={intakeHref}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
          >
            Start intake questionnaire →
          </Link>
        </div>
      )}

      {/* Provider note */}
      {order.providerNote && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-600">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#2563eb" strokeWidth="1.25" />
              <path d="M6 5.5v3M6 4h.01" stroke="#2563eb" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            Note from your provider
          </p>
          <p className="text-sm text-zinc-700">{order.providerNote}</p>
          <p className="mt-1 text-[11px] text-zinc-400">Updated {updatedDate}</p>
        </div>
      )}

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="mb-6 rounded-2xl border border-zinc-100 bg-white p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">Shipment</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">Tracking number</p>
              <p className="mt-0.5 font-mono text-sm text-zinc-500">{order.trackingNumber}</p>
            </div>
            {order.estimatedDelivery && (
              <div className="text-right">
                <p className="text-xs text-zinc-400">Est. delivery</p>
                <p className="text-sm font-semibold text-black">
                  {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order status timeline */}
      <div className="mb-6 rounded-2xl border border-zinc-100 bg-white p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Order status</p>
        <ol className="space-y-3">
          {timeline.map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  step.complete
                    ? "border-black bg-black"
                    : step.current
                    ? "border-black bg-white"
                    : "border-zinc-200 bg-white"
                }`}
              >
                {step.complete ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.current ? (
                  <div className="h-2 w-2 rounded-full bg-black" />
                ) : null}
              </div>
              <span
                className={`text-sm ${
                  step.current ? "font-bold text-black" : step.complete ? "text-zinc-500" : "text-zinc-300"
                }`}
              >
                {step.label}
              </span>
              {step.current && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                  Current
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Dosing plan */}
      <div className="mb-6 rounded-2xl border border-zinc-100 bg-white p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Dosing plan</p>
        <div className="space-y-2">
          {order.selections.map((sel) => (
            <div key={sel.month} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5">
              <span className="text-sm text-zinc-600">Month {sel.month}</span>
              <span className="text-sm font-bold text-black">{sel.mg} mg / week</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="rounded-2xl border border-zinc-100 bg-white p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Medicine</span>
            <span className="font-semibold text-black">{medicineName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Type</span>
            <span className="font-semibold text-black capitalize">{order.purchaseType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Intake</span>
            <span className={`font-semibold ${order.intakeCompleted ? "text-green-700" : "text-amber-600"}`}>
              {order.intakeCompleted ? "Completed" : "Pending"}
            </span>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-2">
            <span className="font-bold text-black">Total charged</span>
            <span className="font-bold text-black">${order.total}</span>
          </div>
        </div>
      </div>

      {/* Support footer */}
      <p className="mt-8 text-center text-xs text-zinc-400">
        Questions about this order?{" "}
        <a href="mailto:support@myogenixpharma.com" className="font-semibold text-black hover:underline">
          Email support
        </a>
      </p>
    </div>
  );
}
