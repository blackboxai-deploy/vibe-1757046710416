'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

interface StudentDashboardData {
  availableExams: any[]
  completedExams: any[]
  certificates: any[]
  stats: {
    totalExams: number
    completedExams: number
    averageScore: number
    certificatesEarned: number
  }
}

export default function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData>({
    availableExams: [],
    completedExams: [],
    certificates: [],
    stats: {
      totalExams: 0,
      completedExams: 0,
      averageScore: 0,
      certificatesEarned: 0
    }
  })
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/auth/login'
      return
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'STUDENT') {
        window.location.href = '/admin'
        return
      }
      setUser(payload)
    } catch (error) {
      window.location.href = '/auth/login'
      return
    }

    // Load student data
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      const response = await fetch('/api/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Failed to load student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user?.role}</Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Available Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{data.stats.totalExams}</div>
              <p className="text-sm text-gray-500 mt-1">Ready to take</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{data.stats.completedExams}</div>
              <p className="text-sm text-gray-500 mt-1">Exams finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{data.stats.averageScore}%</div>
              <p className="text-sm text-gray-500 mt-1">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{data.stats.certificatesEarned}</div>
              <p className="text-sm text-gray-500 mt-1">Earned certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access your learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/student/exams">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-sm">Take Exam</span>
                </Button>
              </Link>
              <Link href="/student/results">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">View Results</span>
                </Button>
              </Link>
              <Link href="/student/certificates">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">🏆</span>
                  <span className="text-sm">Certificates</span>
                </Button>
              </Link>
              <Link href="/student/profile">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">👤</span>
                  <span className="text-sm">Profile</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="exams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exams">Available Exams</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <div className="grid gap-6">
              {data.availableExams.length > 0 ? (
                data.availableExams.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exam.title}</CardTitle>
                          <CardDescription className="mt-2">{exam.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{exam.subject?.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold">{exam.duration} min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Questions</p>
                          <p className="font-semibold">{exam.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Marks</p>
                          <p className="font-semibold">{exam.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Passing</p>
                          <p className="font-semibold">{exam.passingMarks}%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {exam.startTime && (
                            <>Starts: {new Date(exam.startTime).toLocaleDateString()}</>
                          )}
                        </div>
                        <Button asChild>
                          <Link href={`/exam/${exam.id}`}>Start Exam</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <span className="text-6xl mb-4 block">📝</span>
                    <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
                    <p className="text-gray-600 mb-4">
                      There are currently no exams available for you to take.
                    </p>
                    <Button variant="outline">Refresh</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-6">
              {data.completedExams.length > 0 ? (
                data.completedExams.map((attempt) => (
                  <Card key={attempt.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{attempt.exam?.title}</CardTitle>
                          <CardDescription>
                            Completed on {new Date(attempt.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{attempt.percentage}%</div>
                          <Badge variant={attempt.percentage >= attempt.exam?.passingMarks ? "default" : "destructive"}>
                            {attempt.percentage >= attempt.exam?.passingMarks ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Score</p>
                          <p className="font-semibold">{attempt.score}/{attempt.exam?.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time Taken</p>
                          <p className="font-semibold">{Math.floor((attempt.timeTaken || 0) / 60)} min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Subject</p>
                          <p className="font-semibold">{attempt.exam?.subject?.name}</p>
                        </div>
                      </div>
                      <Progress value={attempt.percentage} className="mb-4" />
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {attempt.certificate && (
                          <Button size="sm">
                            Download Certificate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <span className="text-6xl mb-4 block">📊</span>
                    <h3 className="text-lg font-semibold mb-2">No Completed Exams</h3>
                    <p className="text-gray-600 mb-4">
                      You haven&apos;t completed any exams yet. Take your first exam to see results here.
                    </p>
                    <Button asChild>
                      <Link href="/student/exams">Browse Exams</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.certificates.length > 0 ? (
                data.certificates.map((certificate) => (
                  <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                        <CardTitle className="text-lg">{certificate.examAttempt?.exam?.title}</CardTitle>
                        <CardDescription>{certificate.examAttempt?.exam?.subject?.name}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-500">Score: {certificate.examAttempt?.percentage}%</p>
                        <p className="text-sm text-gray-500">
                          Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          ID: {certificate.verificationId?.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          Download Certificate
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          Verify Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-12">
                      <span className="text-6xl mb-4 block">🏆</span>
                      <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                      <p className="text-gray-600 mb-4">
                        Complete exams with passing grades to earn certificates.
                      </p>
                      <Button asChild>
                        <Link href="/student/exams">Take an Exam</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Your overall progress across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round((data.stats.completedExams / Math.max(data.stats.totalExams, 1)) * 100)}%</span>
                      </div>
                      <Progress value={(data.stats.completedExams / Math.max(data.stats.totalExams, 1)) * 100} />
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Exams Completed</span>
                        <span className="text-sm text-gray-600">{data.stats.completedExams}/{data.stats.totalExams}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-sm text-gray-600">{data.stats.averageScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Certificates Earned</span>
                        <span className="text-sm text-gray-600">{data.stats.certificatesEarned}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest exam activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-4 block">📈</span>
                    <p>Activity timeline will appear here as you take more exams</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}