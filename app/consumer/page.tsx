import { getMenu, getRestaurantSettings } from "@/lib/queries";
import { bannersFor } from "@/lib/banners";
import { ConsumerMenu } from "@/components/consumer/ConsumerMenu";

export const metadata = { title: "Menu" };
export const dynamic = "force-dynamic";

export default async function ConsumerPage() {
  const [menu, settings] = await Promise.all([
    getMenu(),
    getRestaurantSettings(),
  ]);

  if (menu.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-5xl">🧇</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Menu not loaded yet
        </h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          The menu is empty. Make sure your Supabase database is set up and
          seeded — see <code>SUPABASE_SETUP.md</code>.
        </p>
      </main>
    );
  }

  const banners = bannersFor(menu.map((c) => ({ id: c.id, name: c.name })));

  return <ConsumerMenu menu={menu} banners={banners} settings={settings} />;
}
