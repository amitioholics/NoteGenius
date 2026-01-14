"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Heart, Sparkles, Brain, BookOpen, Lightbulb, Info } from "lucide-react"

export default function AboutDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover-lift hover-glow">
          <Info className="h-4 w-4 mr-2" />
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl gradient-text">
            <Sparkles className="h-6 w-6 text-primary animate-pulse-glow" />
            About NoteGenius
          </DialogTitle>
          <DialogDescription className="text-base">
            AI-powered note-taking application designed to enhance your learning experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-lift">
                <Brain className="h-8 w-8 text-primary animate-float" />
                <div>
                  <h4 className="font-medium">AI Summaries</h4>
                  <p className="text-xs text-muted-foreground">Intelligent content summarization</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-lift">
                <Lightbulb className="h-8 w-8 text-yellow-500 animate-float" />
                <div>
                  <h4 className="font-medium">Key Extraction</h4>
                  <p className="text-xs text-muted-foreground">Identify important concepts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-lift">
                <BookOpen className="h-8 w-8 text-green-500 animate-float" />
                <div>
                  <h4 className="font-medium">Interactive Quiz</h4>
                  <p className="text-xs text-muted-foreground">Test your knowledge with MCQs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "React", "TypeScript", "Tailwind CSS", "AI SDK", "OpenAI GPT-4", "Shadcn/ui"].map(
                (tech, index) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className={`hover-lift animate-bounce-in stagger-${(index % 5) + 1} bg-primary/10 text-primary border-primary/20`}
                  >
                    {tech}
                  </Badge>
                ),
              )}
            </div>
          </div>

          {/* Developer Section */}
          <div className="space-y-4 p-6 rounded-xl gradient-bg border border-primary/20">
            <h3 className="text-lg font-semibold gradient-text">Developer</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
                A
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold gradient-text">Amit Singh Rajput</h4>
                <p className="text-muted-foreground">Full Stack Developer & AI Enthusiast</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:amitsinghrajput263@gmail.com"
                    className="text-primary hover:underline transition-all duration-300 hover-lift"
                  >
                    amitsinghrajput263@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="space-y-2 text-center p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>to empower students worldwide</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforming the way students learn through intelligent note-taking and AI-powered insights.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
