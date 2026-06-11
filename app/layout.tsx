import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getRestaurantSettings } from "@/lib/queries";
import { BrandProvider } from "@/components/BrandProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { publicEnv } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getRestaurantSettings().catch(() => null);
  const name = settings?.name ?? publicEnv.restaurantName;
  return {
    title: { default: name, template: `%s · ${name}` },
    description: `${name} — ${settings?.tagline ?? "Order online"}`,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: settings?.name ?? publicEnv.restaurantName,
    },
    formatDetection: { telephone: false },
    icons: {
      icon: "/icon-192.png",
      apple: "/icon-192.png",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getRestaurantSettings().catch(() => null);
  return {
    themeColor: settings?.primary_color ?? publicEnv.primaryColor,
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getRestaurantSettings().catch(() => null);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BrandProvider settings={settings} />
        <ServiceWorkerRegistrar />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
