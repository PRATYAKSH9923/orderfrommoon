import Link from "next/link";
import { ShoppingBag, ShieldCheck, ChevronRight } from "lucide-react";
import { getRestaurantSettings } from "@/lib/queries";
import { publicEnv } from "@/lib/env";

export default async function Home() {
  const settings = await getRestaurantSettings().catch(() => null);
  const name = settings?.name ?? publicEnv.restaurantName;
  const tagline = settings?.tagline ?? "Just Waffle It";

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl bg-brand text-brand-contrast text-4xl shadow-lg">
            🧇
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {name}
          </h1>
          <p className="mt-1 text-brand-secondary font-medium">{tagline}</p>
        </header>

        <div className="space-y-4">
          <Link
            href="/consumer"
            className="group flex items-center gap-4 rounded-3xl bg-brand p-6 text-brand-contrast shadow-md active:scale-[0.99] transition-active"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <ShoppingBag className="size-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Consumer</h2>
              <p className="text-sm text-white/90">ग्राहक · ਗਾਹਕ — Order food</p>
            </div>
            <ChevronRight className="size-6 opacity-80 group-active:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin"
            className="group flex items-center gap-4 rounded-3xl bg-brand-secondary p-6 text-white shadow-md active:scale-[0.99] transition-active"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20">
              <ShieldCheck className="size-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Admin</h2>
              <p className="text-sm text-white/90">
                एडमिन · ਐਡਮਿਨ — Manage orders
              </p>
            </div>
            <ChevronRight className="size-6 opacity-80 group-active:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Mobile-first ordering · Install to your home screen
        </p>
      </div>
    </main>
  );
}
