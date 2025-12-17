import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notefi",
    short_name: "Notefi",
    description: "AI-powered study assistant for summaries, keywords, and MCQ quizzes.",
    id: "/?source=pwa",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0f",
    theme_color: "#7c3aed",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    screenshots: [
      {
        src: "/notefi-home.png",
        sizes: "720x1280",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: "Home Screen",
      },
      {
        src: "/placeholder-bm12x.png",
        sizes: "720x1280",
        type: "image/svg+xml",
        form_factor: "narrow",
        label: "Summary & Keywords",
      },
    ],
    shortcuts: [
      { name: "New Note", short_name: "New", url: "/?new=1", description: "Create a new note quickly." },
      { name: "Open Quiz", short_name: "Quiz", url: "/#quiz", description: "Jump to quiz tab." },
    ],
    prefer_related_applications: false,
  }
}
