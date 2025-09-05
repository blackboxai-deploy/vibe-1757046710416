import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get and verify token
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader || '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get dashboard statistics
    const [totalUsers, totalExams, totalQuestions, totalCertificates] = await Promise.all([
      db.user.count(),
      db.exam.count(),
      db.question.count(),
      db.certificate.count()
    ])

    return NextResponse.json({
      totalUsers,
      totalExams,
      totalQuestions,
      totalCertificates
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}