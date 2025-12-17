"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Download, Info, Apple } from "lucide-react"

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect stand-alone (installed) mode
    const standaloneMatch =
      // iOS
      (window.navigator as any).standalone ||
      // Modern PWA Display Mode
      window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(Boolean(standaloneMatch))

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase()
    const iOS = /iphone|ipad|ipod/.test(ua)
    setIsIOS(iOS)

    const handler = (e: any) => {
      // Prevent the mini-infobar
      e.preventDefault()
      setDeferredPrompt(e)
      // Open a helpful prompt
      setOpen(true)
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === "accepted") {
      setDeferredPrompt(null)
      setOpen(false)
    }
  }

  if (isStandalone) return null

  return (
    <>
      {/* Floating install button when supported */}
      {!isIOS && deferredPrompt && (
        <div className="fixed bottom-5 right-5 z-50">
          <Button onClick={() => setOpen(true)} className="hover-lift hover-glow">
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </div>
      )}

      {/* Dialog for both Android (deferredPrompt) and iOS (manual) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Install Notefi
              <Badge variant="secondary" className="ml-2">
                PWA
              </Badge>
            </DialogTitle>
            <DialogDescription>Use Notefi like a native app with offline support.</DialogDescription>
          </DialogHeader>

          {!isIOS ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Click "Install" to add Notefi to your home screen. Works best on Chrome/Edge.
              </p>
              <Button onClick={handleInstall} className="w-full hover-lift hover-glow">
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <Apple className="h-5 w-5" />
                iOS Install Instructions
              </div>
              <ol className="list-decimal list-inside text-sm space-y-2 text-muted-foreground">
                <li>Tap the Share icon in Safari.</li>
                <li>Choose "Add to Home Screen".</li>
                <li>Tap "Add" to install Notefi.</li>
              </ol>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
