import { getRestaurantSettings } from "@/lib/queries";
import { MyOrders } from "@/components/consumer/MyOrders";

export const metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const settings = await getRestaurantSettings().catch(() => null);
  return <MyOrders currency={settings?.currency ?? "₹"} />;
}
