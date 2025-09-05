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
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get available exams (not yet attempted by this user)
    const availableExams = await db.exam.findMany({
      where: {
        isActive: true,
        examAttempts: {
          none: {
            userId: user.id
          }
        }
      },
      include: {
        subject: true,
        _count: {
          select: { examAttempts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get completed exams by this user
    const completedExams = await db.examAttempt.findMany({
      where: {
        userId: user.id,
        status: 'SUBMITTED'
      },
      include: {
        exam: {
          include: {
            subject: true
          }
        },
        certificate: true
      },
      orderBy: { submittedAt: 'desc' }
    })

    // Get certificates
    const certificates = await db.certificate.findMany({
      where: {
        userId: user.id
      },
      include: {
        examAttempt: {
          include: {
            exam: {
              include: {
                subject: true
              }
            }
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    })

    // Calculate statistics
    const totalExams = availableExams.length + completedExams.length
    const averageScore = completedExams.length > 0 
      ? Math.round(completedExams.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / completedExams.length)
      : 0

    const stats = {
      totalExams,
      completedExams: completedExams.length,
      averageScore,
      certificatesEarned: certificates.length
    }

    return NextResponse.json({
      availableExams,
      completedExams,
      certificates,
      stats
    })

  } catch (error) {
    console.error('Student dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}