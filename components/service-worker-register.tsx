"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
          console.log("SW registered with scope:", reg.scope)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            // Optionally notify users an update is available.
          })
        } catch (e) {
          console.error("SW registration failed:", e)
        }
      }

      const isLocalhost =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      if (window.isSecureContext || isLocalhost) {
        // Defer until load so /sw.js route is fully available
        window.addEventListener("load", register, { once: true })
      }
    }
  }, [])

  return null
}
