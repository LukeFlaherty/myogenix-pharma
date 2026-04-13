import { IntakeShell } from "@/components/intake/IntakeShell";
import { decodeOrder, defaultOrder } from "@/lib/order-params";

interface Props {
  searchParams: Promise<{ order?: string; orderId?: string }>;
}

export default async function IntakePage({ searchParams }: Props) {
  const params = await searchParams;
  const order = params.order ? (decodeOrder(params.order) ?? defaultOrder()) : defaultOrder();
  const orderId = params.orderId ?? "ORD-DEMO";

  return <IntakeShell order={order} orderId={orderId} />;
}
