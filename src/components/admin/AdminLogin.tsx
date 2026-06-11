"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AdminLogin() {
  const { t } = useLang();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(t("invalidLogin"));
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("invalidLogin"));
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col">
      <div className="flex justify-end p-4 safe-top">
        <LanguageSwitcher variant="solid" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-brand-secondary text-white shadow-lg">
              <Lock className="size-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {t("adminLogin")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                autoComplete="username"
                placeholder={t("username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                autoComplete="current-password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              variant="secondary"
              loading={loading}
            >
              {t("login")}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
