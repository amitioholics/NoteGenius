import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Configure OpenAI with the API key from environment variables
const openaiModel = (model: string) => {
  return openai(model, { apiKey: process.env.OPENAI_API_KEY })
}

// Check if we're in a development environment or if the API key is invalid
const isApiAvailable = () => {
  return (
    process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-") && process.env.OPENAI_API_KEY.length > 20
  )
}

/**
 * Generates a concise summary of the note content
 */
export async function summarizeNote(content: string): Promise<string> {
  if (!content.trim()) {
    return "Please add some content to your note before generating a summary."
  }

  // If API is not available, use fallback
  if (!isApiAvailable()) {
    return generateFallbackSummary(content)
  }

  try {
    const { text } = await generateText({
      model: openaiModel("gpt-4o"),
      prompt: `Summarize the following study notes in a comprehensive way that captures all the main points, key concepts, and important details:
  
      ${content}`,
      system:
        "You are an educational assistant that creates detailed, well-structured summaries of study notes. Include all key concepts, their relationships, and important details. Make the summary thorough enough to be useful for review purposes.",
    })

    return text
  } catch (error) {
    console.error("Error generating summary:", error)
    // If API fails, use fallback
    return generateFallbackSummary(content)
  }
}

/**
 * Extracts important keywords and concepts from the note content
 */
export async function extractKeywords(content: string): Promise<string[]> {
  if (!content.trim()) {
    return []
  }

  // If API is not available, use fallback
  if (!isApiAvailable()) {
    return generateFallbackKeywords(content)
  }

  try {
    const { text } = await generateText({
      model: openaiModel("gpt-4o"),
      prompt: `Extract the most important keywords and concepts from these study notes. Return ONLY a JSON array of strings with no explanation:
      
      ${content}`,
      system:
        "You are an educational assistant that identifies key terms and concepts from study notes. Return only a valid JSON array of strings.",
    })

    // Parse the response as JSON
    try {
      const keywords = JSON.parse(text)
      if (Array.isArray(keywords)) {
        return keywords.slice(0, 15) // Limit to 15 keywords
      }
      return generateFallbackKeywords(content)
    } catch (e) {
      console.error("Failed to parse keywords response:", e)
      return generateFallbackKeywords(content)
    }
  } catch (error) {
    console.error("Error extracting keywords:", error)
    return generateFallbackKeywords(content)
  }
}

/**
 * Generates MCQ quiz questions based on the note content
 */
export async function generateQuiz(content: string): Promise<
  Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }>
> {
  if (!content.trim()) {
    return []
  }

  // If API is not available, use fallback
  if (!isApiAvailable()) {
    return generateFallbackQuiz(content)
  }

  try {
    const { text } = await generateText({
      model: openaiModel("gpt-4o"),
      prompt: `Generate 5 multiple-choice quiz questions based on these study notes. Each question should have 4 options (A, B, C, D) with only one correct answer. Return ONLY a JSON array of objects with this structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why this is correct"
      }
      
      Study notes:
      ${content}`,
      system:
        "You are an educational assistant that creates effective multiple-choice quiz questions to test understanding of study material. Make sure the questions test comprehension, not just memorization. Include plausible distractors for incorrect options. Return only a valid JSON array.",
    })

    // Parse the response as JSON
    try {
      const quiz = JSON.parse(text)
      if (Array.isArray(quiz)) {
        return quiz.slice(0, 5) // Ensure we have at most 5 questions
      }
      return generateFallbackQuiz(content)
    } catch (e) {
      console.error("Failed to parse quiz response:", e)
      return generateFallbackQuiz(content)
    }
  } catch (error) {
    console.error("Error generating quiz:", error)
    return generateFallbackQuiz(content)
  }
}

// Fallback functions that work without API

/**
 * Generates a more comprehensive summary without using the API
 */
function generateFallbackSummary(content: string): string {
  // If content is very short, return as is
  if (content.length < 200) {
    return content
  }

  // Split content into paragraphs and sentences
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
  const allSentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  // If few sentences, return all of them
  if (allSentences.length <= 5) {
    return allSentences.join(". ") + "."
  }

  // Extract important sentences
  const importantSentences = []

  // Always include first sentence of content
  if (allSentences.length > 0) {
    importantSentences.push(allSentences[0])
  }

  // Include first sentences of paragraphs (often contain topic sentences)
  paragraphs.forEach((paragraph) => {
    const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    if (sentences.length > 0 && !importantSentences.includes(sentences[0])) {
      importantSentences.push(sentences[0])
    }
  })

  // Extract potential keywords for importance scoring
  const potentialKeywords = generateFallbackKeywords(content)

  // Score sentences based on keyword presence
  const sentenceScores = new Map<string, number>()

  allSentences.forEach((sentence) => {
    if (!importantSentences.includes(sentence)) {
      let score = 0

      // Longer sentences often contain more information
      score += Math.min(sentence.length / 20, 3)

      // Sentences with keywords are important
      potentialKeywords.forEach((keyword) => {
        if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
          score += 2
        }
      })

      sentenceScores.set(sentence, score)
    }
  })

  // Sort sentences by score and add top ones
  const sortedSentences = [...sentenceScores.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0])

  // Add top scoring sentences (up to a reasonable limit)
  importantSentences.push(...sortedSentences.slice(0, 7))

  // Include last sentence for conclusion if not already included
  if (allSentences.length > 0 && !importantSentences.includes(allSentences[allSentences.length - 1])) {
    importantSentences.push(allSentences[allSentences.length - 1])
  }

  // Sort sentences to maintain original order
  const orderedSentences = importantSentences.sort((a, b) => {
    return allSentences.indexOf(a) - allSentences.indexOf(b)
  })

  // Join sentences and return
  return orderedSentences.join(". ") + "."
}

/**
 * Extracts basic keywords without using the API
 */
function generateFallbackKeywords(content: string): string[] {
  // Simple algorithm to find potential keywords
  const words = content
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)
  const wordFrequency: Record<string, number> = {}

  // Count word frequency
  words.forEach((word) => {
    if (!commonWords.includes(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    }
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  // Return top 10 words as keywords
  return sortedWords.slice(0, 10)
}

/**
 * Generates MCQ quiz questions without using the API
 */
function generateFallbackQuiz(content: string): Array<{
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}> {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const keywords = generateFallbackKeywords(content)
  const quiz: Array<{ question: string; options: string[]; correctAnswer: number; explanation?: string }> = []

  // Generate MCQ questions based on content
  for (let i = 0; i < Math.min(5, Math.floor(sentences.length / 2)); i++) {
    const sentenceIndex = Math.floor((i * sentences.length) / Math.min(5, Math.floor(sentences.length / 2)))
    const sentence = sentences[sentenceIndex]?.trim()

    if (!sentence || sentence.length < 20) continue

    // Find a keyword to create a question about
    let keywordToAsk = ""
    const contextSentence = sentence

    for (const keyword of keywords) {
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
        keywordToAsk = keyword
        break
      }
    }

    if (keywordToAsk) {
      // Create a "What is" question
      const question = `According to the notes, what is mentioned about "${keywordToAsk}"?`

      // Create options
      const correctOption = sentence
      const options = [correctOption]

      // Generate plausible distractors
      const otherSentences = sentences.filter((s) => s !== sentence && s.length > 15)

      // Add modified versions of other sentences as distractors
      for (let j = 0; j < 3 && j < otherSentences.length; j++) {
        let distractor = otherSentences[j]

        // Modify the distractor slightly to make it plausible but incorrect
        if (keywords.length > 1) {
          const otherKeyword = keywords.find((k) => k !== keywordToAsk)
          if (otherKeyword) {
            distractor = distractor.replace(new RegExp(otherKeyword, "gi"), keywordToAsk)
          }
        }

        options.push(distractor)
      }

      // Fill remaining options if needed
      while (options.length < 4) {
        options.push(`This information is not mentioned in the notes`)
      }

      // Shuffle options and find correct answer index
      const correctAnswer = 0 // We'll shuffle but keep track
      const shuffledOptions = [...options]

      // Simple shuffle
      for (let k = shuffledOptions.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1))
        ;[shuffledOptions[k], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[k]]
      }

      const finalCorrectIndex = shuffledOptions.indexOf(correctOption)

      quiz.push({
        question,
        options: shuffledOptions,
        correctAnswer: finalCorrectIndex,
        explanation: `This information is directly stated in the notes.`,
      })
    }
  }

  // Generate definition-based questions
  if (keywords.length >= 2 && quiz.length < 3) {
    const keyword = keywords[0]
    const question = `Which of the following best describes "${keyword}" based on the notes?`

    // Find sentence containing the keyword
    const relevantSentence = sentences.find((s) => s.toLowerCase().includes(keyword.toLowerCase()))

    if (relevantSentence) {
      const options = [
        relevantSentence,
        `${keyword} is not discussed in these notes`,
        `${keyword} is briefly mentioned without detail`,
        `${keyword} is the main topic of the entire document`,
      ]

      // Shuffle options
      const shuffledOptions = [...options]
      for (let k = shuffledOptions.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1))
        ;[shuffledOptions[k], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[k]]
      }

      quiz.push({
        question,
        options: shuffledOptions,
        correctAnswer: shuffledOptions.indexOf(relevantSentence),
        explanation: `This is the information provided about ${keyword} in the notes.`,
      })
    }
  }

  // If we couldn't generate enough questions, add some generic ones
  while (quiz.length < 3) {
    quiz.push({
      question: "What is one of the main topics covered in these notes?",
      options: [
        keywords[0] || "Main topic",
        "This topic is not covered",
        "All topics are equally important",
        "The notes don't have a clear focus",
      ],
      correctAnswer: 0,
      explanation: "This appears to be one of the key topics based on frequency of mention.",
    })
  }

  return quiz
}

// List of common words to ignore when generating keywords
const commonWords = [
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "and",
  "any",
  "are",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "can",
  "did",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "into",
  "its",
  "itself",
  "just",
  "more",
  "most",
  "myself",
  "nor",
  "not",
  "now",
  "off",
  "once",
  "only",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "too",
  "under",
  "until",
  "very",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]
