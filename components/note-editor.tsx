"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Note } from "@/types/note"
import { Textarea } from "@/components/ui/textarea"

interface NoteEditorProps {
  note: Note
  onUpdateNote: (note: Note) => void
}

export default function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [content, setContent] = useState(note.content)
  const [isFocused, setIsFocused] = useState(false)

  // Update local state when the active note changes
  useEffect(() => {
    setContent(note.content)
  }, [note.id, note.content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (content !== note.content) {
      onUpdateNote({
        ...note,
        content,
      })
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  return (
    <div className="w-full animate-fade-in-up">
      <Textarea
        value={content}
        onChange={handleContentChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Start typing your notes here... ✨

💡 Tip: Use Notefi AI features to summarize, extract keywords, and create quizzes from your notes!"
        className={`min-h-[400px] font-mono p-4 resize-y transition-all duration-300 custom-scrollbar ${
          isFocused
            ? "border-primary/50 shadow-lg hover-glow animate-pulse-glow"
            : "border-primary/20 hover:border-primary/30"
        } bg-background/50 backdrop-blur-sm`}
      />
      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground animate-fade-in-up stagger-1">
        <span>
          {content.length} characters • {content.split(/\s+/).filter((word) => word.length > 0).length} words
        </span>
      </div>
    </div>
  )
}
