"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NoteEditor from "@/components/note-editor"
import NotesList from "@/components/notes-list"
import type { Note } from "@/types/note"
import { summarizeNote, extractKeywords, generateQuiz } from "@/lib/ai-helpers"
import { Sparkles, Plus, Brain, BookOpen, Lightbulb, Mail, Heart } from "lucide-react"
import AboutDialog from "@/components/about-dialog"
import KeywordCard from "@/components/keyword-card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes([newNote, ...notes])
    setActiveNote(newNote)
    setActiveTab("editor")
  }

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note,
    )
    setNotes(updatedNotes)
    setActiveNote(updatedNote)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    if (activeNote?.id === noteId) {
      setActiveNote(updatedNotes[0] || null)
    }
  }

  const handleSelectNote = (note: Note) => {
    setActiveNote(note)
    setActiveTab("editor")
  }

  if (!mounted) {
    return (
      <main className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="skeleton h-10 w-48 rounded"></div>
            <div className="skeleton h-10 w-24 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="skeleton h-96 rounded-lg"></div>
            <div className="md:col-span-3 skeleton h-96 rounded-lg"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-6">
          {/* Header with animations */}
          <header className="animate-slide-in-top">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="animate-float">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse-glow" />
                </div>
                <h1 className="text-4xl font-bold gradient-text">NoteGenius</h1>
              </div>
              <div className="flex items-center gap-3">
                <AboutDialog />
                <Button
                  onClick={handleCreateNote}
                  className="hover-lift hover-glow group relative overflow-hidden"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">New Note</span>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              Transform your study experience with AI-powered note analysis and interactive learning tools.
            </p>
          </header>

          {/* Welcome section for new users */}
          {notes.length === 0 && (
            <div className="animate-fade-in-up stagger-2">
              <Card className="text-center p-8 hover-lift gradient-bg border-primary/20">
                <CardContent className="space-y-6">
                  <div className="flex justify-center space-x-4 mb-6">
                    <div className="animate-bounce-in stagger-1">
                      <BookOpen className="h-12 w-12 text-primary" />
                    </div>
                    <div className="animate-bounce-in stagger-2">
                      <Brain className="h-12 w-12 text-purple-500" />
                    </div>
                    <div className="animate-bounce-in stagger-3">
                      <Lightbulb className="h-12 w-12 text-yellow-500" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold gradient-text mb-4">Welcome to NoteGenius!</h2>
                  <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                    Create intelligent study notes with AI-powered summaries, keyword extraction, and interactive
                    quizzes. Start your learning journey today!
                  </p>
                  <Button onClick={handleCreateNote} size="lg" className="hover-lift hover-glow animate-pulse-glow">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Note
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main content grid */}
          {notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Notes sidebar */}
              <div className="md:col-span-1 animate-fade-in-left">
                <Card className="sticky top-4 hover-lift border-primary/20 backdrop-blur-sm bg-card/80">
                  <CardHeader className="gradient-bg">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Your Notes
                    </CardTitle>
                    <CardDescription>Manage your study materials</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <NotesList
                      notes={notes}
                      activeNoteId={activeNote?.id}
                      onSelectNote={handleSelectNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Main editor area */}
              <div className="md:col-span-3 animate-fade-in-right">
                {activeNote ? (
                  <Card className="hover-lift border-primary/20 backdrop-blur-sm bg-card/80">
                    <CardHeader className="gradient-bg">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={activeNote.title}
                          onChange={(e) => handleUpdateNote({ ...activeNote, title: e.target.value })}
                          className="text-xl font-semibold bg-background/50 hover-glow transition-all duration-300"
                        />
                        <Label className="text-sm text-muted-foreground whitespace-nowrap">
                          Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
                        </Label>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                        <TabsList className="grid grid-cols-4 mb-6 bg-muted/50 backdrop-blur-sm">
                          <TabsTrigger value="editor" className="hover-glow transition-all duration-300">
                            Editor
                          </TabsTrigger>
                          <TabsTrigger value="summary" className="hover-glow transition-all duration-300">
                            Summary
                          </TabsTrigger>
                          <TabsTrigger value="keywords" className="hover-glow transition-all duration-300">
                            Keywords
                          </TabsTrigger>
                          <TabsTrigger value="quiz" className="hover-glow transition-all duration-300">
                            Quiz
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="editor" className="animate-fade-in-up">
                          <NoteEditor note={activeNote} onUpdateNote={handleUpdateNote} />
                        </TabsContent>

                        <TabsContent value="summary" className="animate-fade-in-up">
                          <SummaryTab note={activeNote} />
                        </TabsContent>

                        <TabsContent value="keywords" className="animate-fade-in-up">
                          <KeywordsTab note={activeNote} />
                        </TabsContent>

                        <TabsContent value="quiz" className="animate-fade-in-up">
                          <QuizTab note={activeNote} />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="gradient-bg">
                      <div className="flex space-x-2 w-full">
                        <TagsInput
                          tags={activeNote.tags}
                          onUpdateTags={(tags) => handleUpdateNote({ ...activeNote, tags })}
                        />
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center p-6 hover-lift border-primary/20 gradient-bg">
                    <div className="text-center animate-bounce-in">
                      <BookOpen className="h-16 w-16 text-primary mx-auto mb-4 animate-float" />
                      <h3 className="text-xl font-medium mb-2">No Note Selected</h3>
                      <p className="text-muted-foreground mb-4">
                        Create a new note or select an existing one to get started.
                      </p>
                      <Button onClick={handleCreateNote} className="hover-lift hover-glow">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Note
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 py-8 border-t border-primary/20 animate-fade-in-up">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>by</span>
                <span className="font-semibold gradient-text">Amit Singh Rajput</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <a
                  href="mailto:amitsinghrajput263@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 hover-lift"
                >
                  <Mail className="h-4 w-4" />
                  amitsinghrajput263@gmail.com
                </a>
              </div>

              <div className="text-xs text-muted-foreground">
                © 2024 NoteGenius. Empowering students with AI-powered learning tools.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}

function SummaryTab({ note }: { note: Note }) {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await summarizeNote(note.content)
      setSummary(result)
    } catch (error) {
      console.error("Failed to generate summary:", error)
      setError("There was an issue with the AI service. Using basic summarization instead.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!summary && !error && (
        <div className="flex flex-col items-center gap-6 my-8 p-8 border border-dashed border-primary/30 rounded-xl gradient-bg animate-scale-in">
          <div className="text-center max-w-md">
            <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-medium mb-3 gradient-text">Generate Summary</h3>
            <p className="text-muted-foreground mb-6">
              Create a comprehensive summary of your notes to help with quick review and understanding.
            </p>
          </div>
          <Button
            onClick={handleGenerateSummary}
            disabled={loading}
            size="lg"
            className="hover-lift hover-glow animate-pulse-glow relative overflow-hidden group"
          >
            {loading && <div className="absolute inset-0 animate-shimmer"></div>}
            <Brain className="h-5 w-5 mr-2" />
            {loading ? "Generating..." : "Generate Summary"}
          </Button>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Note: If the AI service is unavailable, an enhanced local summary will be generated.
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-xl animate-scale-in border border-amber-300">
          <h3 className="font-medium mb-2">AI Service Unavailable</h3>
          <p>{error}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={loading}
              className="hover-lift"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {summary && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium gradient-text flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Summary
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={loading}
              className="hover-lift hover-glow"
            >
              {loading ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
          <div className="p-6 bg-muted/30 rounded-xl whitespace-pre-line leading-relaxed hover-lift border border-primary/10 backdrop-blur-sm">
            {summary}
          </div>
        </div>
      )}
    </div>
  )
}

function KeywordsTab({ note }: { note: Note }) {
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExtractKeywords = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await extractKeywords(note.content)
      setKeywords(result)
    } catch (error) {
      console.error("Failed to extract keywords:", error)
      setError("There was an issue with the AI service. Using basic keyword extraction instead.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {keywords.length === 0 && !error && (
        <div className="flex flex-col items-center gap-6 my-8 p-8 border border-dashed border-primary/30 rounded-xl gradient-bg animate-scale-in">
          <div className="text-center max-w-md">
            <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-medium mb-3 gradient-text">Extract Key Concepts</h3>
            <p className="text-muted-foreground mb-6">
              Identify the most important terms and concepts from your notes for focused studying.
            </p>
          </div>
          <Button
            onClick={handleExtractKeywords}
            disabled={loading}
            size="lg"
            className="hover-lift hover-glow animate-pulse-glow relative overflow-hidden group"
          >
            {loading && <div className="absolute inset-0 animate-shimmer"></div>}
            <Lightbulb className="h-5 w-5 mr-2" />
            {loading ? "Extracting..." : "Extract Keywords"}
          </Button>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Note: If the AI service is unavailable, enhanced local extraction will be used.
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-xl animate-scale-in border border-amber-300">
          <h3 className="font-medium mb-2">AI Service Unavailable</h3>
          <p>{error}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtractKeywords}
              disabled={loading}
              className="hover-lift"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-medium gradient-text flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                Key Concepts
              </h3>
              <Badge className="keyword-counter">{keywords.length} found</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtractKeywords}
              disabled={loading}
              className="hover-lift hover-glow"
            >
              {loading ? "Extracting..." : "Refresh Keywords"}
            </Button>
          </div>

          <div className="p-6 bg-gradient-to-br from-muted/10 to-primary/5 rounded-xl border border-primary/10 backdrop-blur-sm">
            <div className="keyword-grid grid gap-4 mb-4">
              {keywords.map((keyword, index) => (
                <KeywordCard key={index} keyword={keyword} index={index} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Study Tips</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Click any keyword to copy it to your clipboard. Use these concepts to create flashcards, search for
                    additional resources, or focus your study sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QuizTab({ note }: { note: Note }) {
  const [quizQuestions, setQuizQuestions] = useState<
    Array<{
      question: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }>
  >([])
  const [loading, setLoading] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const handleGenerateQuiz = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await generateQuiz(note.content)
      setQuizQuestions(result)
      setSelectedAnswers({})
      setShowResults({})
    } catch (error) {
      console.error("Failed to generate quiz:", error)
      setError("There was an issue with the AI service. Using basic quiz generation instead.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleShowResult = (questionIndex: number) => {
    setShowResults((prev) => ({
      ...prev,
      [questionIndex]: true,
    }))
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setShowResults({})
  }

  const getScore = () => {
    let correct = 0
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return { correct, total: quizQuestions.length }
  }

  return (
    <div className="space-y-6">
      {quizQuestions.length === 0 && !error && (
        <div className="flex flex-col items-center gap-6 my-8 p-8 border border-dashed border-primary/30 rounded-xl gradient-bg animate-scale-in">
          <div className="text-center max-w-md">
            <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-medium mb-3 gradient-text">Generate Quiz</h3>
            <p className="text-muted-foreground mb-6">
              Create interactive multiple-choice questions based on your notes to test your understanding and retention.
            </p>
          </div>
          <Button
            onClick={handleGenerateQuiz}
            disabled={loading}
            size="lg"
            className="hover-lift hover-glow animate-pulse-glow relative overflow-hidden group"
          >
            {loading && <div className="absolute inset-0 animate-shimmer"></div>}
            <BookOpen className="h-5 w-5 mr-2" />
            {loading ? "Generating..." : "Generate Quiz"}
          </Button>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Note: If the AI service is unavailable, enhanced local quiz generation will be used.
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-xl animate-scale-in border border-amber-300">
          <h3 className="font-medium mb-2">AI Service Unavailable</h3>
          <p>{error}</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleGenerateQuiz} disabled={loading} className="hover-lift">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {quizQuestions.length > 0 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium gradient-text flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Quiz Questions
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetQuiz} className="hover-lift hover-glow">
                Reset Answers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateQuiz}
                disabled={loading}
                className="hover-lift hover-glow"
              >
                {loading ? "Generating..." : "New Quiz"}
              </Button>
            </div>
          </div>

          {/* Score Display */}
          {Object.keys(selectedAnswers).length === quizQuestions.length && (
            <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl animate-bounce-in border border-green-300">
              <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">🎉 Quiz Complete!</h4>
              <p className="text-green-700 dark:text-green-300">
                Your Score: {getScore().correct} out of {getScore().total} (
                {Math.round((getScore().correct / getScore().total) * 100)}%)
              </p>
            </div>
          )}

          <div className="space-y-6">
            {quizQuestions.map((item, questionIndex) => (
              <Card
                key={questionIndex}
                className={`overflow-hidden hover-lift border-primary/20 backdrop-blur-sm animate-scale-in stagger-${(questionIndex % 5) + 1}`}
              >
                <CardHeader className="gradient-bg">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {questionIndex + 1}
                    </span>
                    Question {questionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <p className="font-medium text-lg">{item.question}</p>

                  <div className="space-y-3">
                    {item.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[questionIndex] === optionIndex
                      const isCorrect = optionIndex === item.correctAnswer
                      const showResult = showResults[questionIndex]

                      let buttonClass =
                        "w-full text-left justify-start h-auto p-4 transition-all duration-300 hover-lift "

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass +=
                            "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-200 animate-pulse-glow"
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        } else {
                          buttonClass += "bg-muted opacity-60"
                        }
                      } else if (isSelected) {
                        buttonClass += "bg-primary/20 border-primary hover-glow animate-pulse-glow"
                      } else {
                        buttonClass += "bg-background hover:bg-muted hover-glow"
                      }

                      return (
                        <Button
                          key={optionIndex}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                          disabled={showResult}
                        >
                          <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span className="whitespace-normal text-wrap text-left">{option}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 gradient-bg">
                  {selectedAnswers[questionIndex] !== undefined && !showResults[questionIndex] && (
                    <Button
                      onClick={() => handleShowResult(questionIndex)}
                      className="w-full hover-lift hover-glow animate-pulse-glow"
                    >
                      Show Answer
                    </Button>
                  )}

                  {showResults[questionIndex] && (
                    <div className="w-full space-y-3 animate-fade-in-up">
                      <div
                        className={`p-4 rounded-xl transition-all duration-300 ${
                          selectedAnswers[questionIndex] === item.correctAnswer
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-300"
                        }`}
                      >
                        <p className="font-medium">
                          {selectedAnswers[questionIndex] === item.correctAnswer ? "✅ Correct!" : "❌ Incorrect"}
                        </p>
                        <p className="text-sm mt-1">
                          Correct answer: {String.fromCharCode(65 + item.correctAnswer)}.{" "}
                          {item.options[item.correctAnswer]}
                        </p>
                      </div>

                      {item.explanation && (
                        <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-xl border border-blue-300">
                          <p className="text-sm">
                            <strong>💡 Explanation:</strong> {item.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TagsInput({ tags, onUpdateTags }: { tags: string[]; onUpdateTags: (tags: string[]) => void }) {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onUpdateTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-secondary/20 hover-lift animate-scale-in stagger-${(index % 5) + 1} transition-all duration-300 hover:bg-secondary/70`}
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="w-40 hover-glow transition-all duration-300"
        />
        <Button variant="outline" size="sm" onClick={handleAddTag} className="hover-lift hover-glow">
          Add
        </Button>
      </div>
    </div>
  )
}
