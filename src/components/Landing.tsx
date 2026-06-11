"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck, ChevronRight } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Landing({
  name,
  tagline,
}: {
  name: string;
  tagline: string;
}) {
  const { t } = useLang();

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Warm gradient backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, var(--brand-primary) 0%, var(--brand-secondary) 55%, #2a1608 100%)",
        }}
      />
      {/* Soft glowing blobs for depth */}
      <div className="pointer-events-none absolute -left-20 top-24 -z-10 size-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 -z-10 size-72 rounded-full bg-amber-300/20 blur-3xl" />

      {/* Top bar: language switcher */}
      <div className="flex justify-end p-4 safe-top">
        <LanguageSwitcher variant="glass" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <header className="mb-10 text-center text-white">
            <div className="mx-auto mb-5 flex size-24 items-center justify-center rounded-[28px] bg-white/15 text-5xl shadow-2xl ring-1 ring-white/25 backdrop-blur-md">
              🧇
            </div>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
              {name}
            </h1>
            <p className="mt-2 text-lg font-medium text-white/80">{tagline}</p>
          </header>

          {/* Transparent glass cards */}
          <div className="space-y-4">
            <GlassCard
              href="/consumer"
              icon={<ShoppingBag className="size-7" />}
              title={t("consumer")}
              subtitle={t("consumerSub")}
            />
            <GlassCard
              href="/admin"
              icon={<ShieldCheck className="size-7" />}
              title={t("admin")}
              subtitle={t("adminSub")}
            />
          </div>

          <p className="mt-10 text-center text-xs text-white/60">
            {t("installHint")}
          </p>
        </div>
      </div>
    </main>
  );
}

function GlassCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-xl backdrop-blur-xl transition-active active:scale-[0.98] hover:bg-white/15"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/25">
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-white/75">{subtitle}</p>
      </div>
      <ChevronRight className="size-6 opacity-70 transition-transform group-active:translate-x-1" />
    </Link>
  );
}
