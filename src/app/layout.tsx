import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ExamPro - Online Examination & Certificate System',
  description: 'Modern online examination system for colleges, schools, and coaching centers. Create exams, track performance, and issue AI-generated certificates.',
  keywords: 'online examination, quiz, MCQ test, certificate system, education, college, school, coaching center',
  authors: [{ name: 'ExamPro Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}