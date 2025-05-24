"use client"

import type { Note } from "@/types/note"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, FileText, Tag, Clock } from "lucide-react"

interface NotesListProps {
  notes: Note[]
  activeNoteId: string | undefined
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export default function NotesList({ notes, activeNoteId, onSelectNote, onDeleteNote }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 px-4 border-2 border-dashed border-primary/20 rounded-xl gradient-bg animate-bounce-in">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50 animate-float" />
        <h3 className="text-lg font-medium mb-2 gradient-text">No notes yet</h3>
        <p className="text-muted-foreground text-sm mb-4">Create your first note to get started</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px] pr-3 custom-scrollbar">
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-300 hover-lift animate-scale-in stagger-${(index % 5) + 1} ${
              note.id === activeNoteId
                ? "bg-primary/10 border border-primary/30 shadow-lg animate-pulse-glow"
                : "hover:bg-muted/50 border border-transparent hover:border-primary/20 hover-glow"
            } backdrop-blur-sm`}
            onClick={() => onSelectNote(note)}
          >
            <div className="flex justify-between items-start">
              <div className="overflow-hidden flex-1">
                <div className="font-medium truncate text-lg mb-1">{note.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-all duration-300 hover:scale-110 hover-lift"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteNote(note.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.slice(0, 3).map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </div>
                ))}
                {note.tags.length > 3 && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    +{note.tags.length - 3} more
                  </div>
                )}
              </div>
            )}

            {note.content && (
              <div className="text-xs text-muted-foreground mt-3 line-clamp-2 bg-muted/30 p-2 rounded-lg">
                {note.content.substring(0, 100)}
                {note.content.length > 100 && "..."}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
