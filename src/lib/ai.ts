import { AIMessage, AIResponse, CertificateData } from '@/types'

const AI_ENDPOINT = process.env.AI_API_ENDPOINT || 'https://oi-server.onrender.com/chat/completions'
const CUSTOMER_ID = process.env.AI_CUSTOMER_ID || 'khanavatetejas0@gmail.com'
const AUTHORIZATION = process.env.AI_AUTHORIZATION || 'Bearer xxx'

// Default models
const DEFAULT_LLM_MODEL = process.env.DEFAULT_LLM_MODEL || 'openrouter/anthropic/claude-sonnet-4'
const DEFAULT_IMAGE_MODEL = process.env.DEFAULT_IMAGE_MODEL || 'replicate/black-forest-labs/flux-1.1-pro'

interface AIRequestOptions {
  model?: string
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  timeout?: number
}

export async function callAI(options: AIRequestOptions): Promise<string> {
  const {
    model = DEFAULT_LLM_MODEL,
    messages,
    temperature = 0.7,
    maxTokens = 2000,
    timeout = 300000 // 5 minutes default
  } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'customerId': CUSTOMER_ID,
        'Content-Type': 'application/json',
        'Authorization': AUTHORIZATION,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}`)
    }

    const data: AIResponse = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid AI API response format')
    }

    return data.choices[0].message.content as string
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      throw new Error(`AI request failed: ${error.message}`)
    }
    throw new Error('Unknown AI request error')
  }
}

export async function generateQuestions(
  subject: string,
  topic: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  count: number = 5,
  type: 'MCQ' | 'TRUE_FALSE' = 'MCQ'
): Promise<any[]> {
  const systemPrompt = `You are an expert educator creating ${type} questions for ${subject}. Generate exactly ${count} high-quality questions on the topic: ${topic}.

For each question, provide:
1. A clear, well-formatted question
2. ${type === 'MCQ' ? '4 options (A, B, C, D)' : 'True/False options'}
3. The correct answer
4. A brief explanation of why the answer is correct
5. Difficulty level: ${difficulty}

Format your response as valid JSON array with objects containing:
{
  "question": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "A",
  "explanation": "Explanation here",
  "difficulty": "${difficulty}",
  "type": "${type}",
  "points": 1
}`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { 
      role: 'user', 
      content: `Generate ${count} ${difficulty.toLowerCase()} difficulty ${type} questions about ${topic} in ${subject}.` 
    }
  ]

  try {
    const response = await callAI({
      messages,
      temperature: 0.8,
      maxTokens: 3000
    })

    const questions = JSON.parse(response)
    return Array.isArray(questions) ? questions : []
  } catch (error) {
    console.error('Question generation failed:', error)
    return []
  }
}

export async function generateCertificateImage(certificateData: CertificateData): Promise<string> {
  const prompt = `Create an elegant, professional digital certificate with the following details:

Student Name: ${certificateData.studentName}
Exam: ${certificateData.examTitle}
Subject: ${certificateData.subject}
Score: ${certificateData.score}/${certificateData.percentage}%
Issue Date: ${certificateData.issuedDate.toLocaleDateString()}
Certificate ID: ${certificateData.certificateId}

Design Requirements:
- Professional and elegant design with gold and blue color scheme
- Clean typography with readable fonts
- Decorative border elements
- Official certificate layout
- Academic achievement theme
- High quality and print-ready
- Include space for institutional seal/logo
- Modern but traditional certificate aesthetic`

  const messages: AIMessage[] = [
    { 
      role: 'user', 
      content: prompt 
    }
  ]

  try {
    const response = await callAI({
      model: DEFAULT_IMAGE_MODEL,
      messages,
      timeout: 900000 // 15 minutes for image generation
    })

    // The response should contain the image URL
    return response.trim()
  } catch (error) {
    console.error('Certificate generation failed:', error)
    throw new Error('Failed to generate certificate image')
  }
}

export async function analyzeExamPerformance(
  examTitle: string,
  responses: any[],
  questions: any[]
): Promise<string> {
  const systemPrompt = `You are an educational assessment expert. Analyze the exam performance and provide detailed insights.

Provide analysis in the following format:
1. Overall Performance Summary
2. Strengths and Areas for Improvement
3. Question-wise Performance Analysis
4. Recommendations for Further Study
5. Comparative Performance Insights

Be constructive and educational in your feedback.`

  const performanceData = {
    examTitle,
    totalQuestions: questions.length,
    responses: responses.map((r, i) => ({
      question: questions[i]?.question || 'Question not found',
      studentAnswer: r.selectedAnswer,
      correctAnswer: questions[i]?.correctAnswer || 'N/A',
      isCorrect: r.selectedAnswer === questions[i]?.correctAnswer,
      timeSpent: r.timeSpent
    }))
  }

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { 
      role: 'user', 
      content: `Analyze this exam performance:\n\n${JSON.stringify(performanceData, null, 2)}` 
    }
  ]

  try {
    const response = await callAI({
      messages,
      temperature: 0.7,
      maxTokens: 2000
    })

    return response
  } catch (error) {
    console.error('Performance analysis failed:', error)
    return 'Performance analysis is currently unavailable.'
  }
}