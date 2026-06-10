import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminOrders, getRestaurantSettings } from "@/lib/queries";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { publicEnv } from "@/lib/env";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const [orders, settings] = await Promise.all([
    getAdminOrders(),
    getRestaurantSettings(),
  ]);

  return (
    <AdminDashboard
      initialOrders={orders}
      currency={settings?.currency ?? "₹"}
      restaurantName={settings?.name ?? publicEnv.restaurantName}
    />
  );
}
