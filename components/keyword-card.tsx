"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"

interface KeywordCardProps {
  keyword: string
  index: number
}

export default function KeywordCard({ keyword, index }: KeywordCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy keyword:", err)
    }
  }

  return (
    <div
      className={`group relative keyword-card p-4 rounded-xl cursor-pointer animate-bounce-in stagger-${(index % 5) + 1} hover-lift`}
      onClick={handleCopy}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{keyword}</span>
          <div className="mt-1">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
              Concept #{index + 1}
            </Badge>
          </div>
        </div>

        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-200" />
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300"></div>
    </div>
  )
}
