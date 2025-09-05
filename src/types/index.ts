import { User, Subject, Question, Exam, ExamAttempt, Certificate, Role, QuestionType, Difficulty, AttemptStatus } from '@prisma/client'

// Base types from Prisma
export type {
  User,
  Subject,
  Question,
  Exam,
  ExamAttempt,
  Certificate,
  Role,
  QuestionType,
  Difficulty,
  AttemptStatus
}

// Extended types with relations
export type QuestionWithSubject = Question & {
  subject: Subject
}

export type ExamWithDetails = Exam & {
  subject: Subject
  createdBy: User
  examQuestions: Array<{
    id: string
    questionId: string
    order: number
    points: number
    question: Question
  }>
  _count: {
    examAttempts: number
  }
}

export type ExamAttemptWithDetails = ExamAttempt & {
  exam: Exam & {
    subject: Subject
  }
  user: User
}

export type CertificateWithDetails = Certificate & {
  user: User
  examAttempt: ExamAttempt & {
    exam: Exam & {
      subject: Subject
    }
  }
}

// Form types
export interface QuestionFormData {
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty: Difficulty
  type: QuestionType
  points: number
  timeLimit?: number
  subjectId: string
}

export interface ExamFormData {
  title: string
  description?: string
  instructions?: string
  duration: number
  passingMarks: number
  startTime?: Date
  endTime?: Date
  randomizeOrder: boolean
  showResults: boolean
  allowReview: boolean
  subjectId: string
  selectedQuestions: {
    questionId: string
    points: number
    order: number
  }[]
}

export interface SubjectFormData {
  name: string
  description?: string
  code: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role?: Role
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
}

// Exam taking types
export interface ExamResponse {
  questionId: string
  selectedAnswer: string
  timeSpent: number
}

export interface ExamSession {
  examId: string
  userId: string
  startTime: Date
  responses: ExamResponse[]
  currentQuestionIndex: number
  timeRemaining: number
}

// Analytics types
export interface ExamAnalytics {
  totalAttempts: number
  averageScore: number
  passRate: number
  questionAnalytics: QuestionAnalytics[]
}

export interface QuestionAnalytics {
  questionId: string
  question: string
  correctAnswers: number
  wrongAnswers: number
  averageTime: number
  difficulty: Difficulty
}

// Dashboard types
export interface AdminDashboardData {
  totalUsers: number
  totalExams: number
  totalQuestions: number
  totalCertificates: number
  recentExams: Exam[]
  recentAttempts: ExamAttempt[]
}

export interface StudentDashboardData {
  availableExams: Exam[]
  completedExams: ExamAttemptWithDetails[]
  certificates: CertificateWithDetails[]
  upcomingExams: Exam[]
}

// AI Integration types
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{
    type: 'text' | 'image_url'
    text?: string
    image_url?: {
      url: string
    }
  }>
}

export interface AIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: AIMessage
    finish_reason: string
  }>
}

// Certificate generation types
export interface CertificateData {
  studentName: string
  examTitle: string
  subject: string
  score: number
  percentage: number
  issuedDate: Date
  certificateId: string
}

export interface CertificateTemplate {
  id: string
  name: string
  description: string
  templateUrl?: string
}

// Filter and search types
export interface QuestionFilters {
  subjectId?: string
  difficulty?: Difficulty
  type?: QuestionType
  search?: string
}

export interface ExamFilters {
  subjectId?: string
  status?: 'active' | 'inactive' | 'scheduled'
  search?: string
}

export interface UserFilters {
  role?: Role
  search?: string
}