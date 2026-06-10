"use client";

import { useEffect } from "react";

/** Registers the PWA service worker once on the client. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Register after load to avoid competing with first paint.
    const register = () => {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .catch((err) => console.warn("SW registration failed:", err));
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
