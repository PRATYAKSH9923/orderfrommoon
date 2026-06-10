import Link from "next/link";
import { getOrderByNumber, getRestaurantSettings } from "@/lib/queries";
import { OrderTracker } from "@/components/consumer/OrderTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return { title: `Order #${orderNumber.replace(/^#/, "")}` };
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  // URLs carry the number without "#" (e.g. /order/101) → restore it.
  const display = orderNumber.startsWith("#")
    ? orderNumber
    : `#${orderNumber}`;

  const [order, settings] = await Promise.all([
    getOrderByNumber(display),
    getRestaurantSettings(),
  ]);

  if (!order) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Order {display} not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          ऑर्डर नहीं मिला · ਆਰਡਰ ਨਹੀਂ ਮਿਲਿਆ
        </p>
        <Link
          href="/consumer"
          className="mt-6 rounded-xl bg-brand px-5 py-3 font-semibold text-brand-contrast"
        >
          Back to Menu
        </Link>
      </main>
    );
  }

  return (
    <OrderTracker initialOrder={order} currency={settings?.currency ?? "₹"} />
  );
}
