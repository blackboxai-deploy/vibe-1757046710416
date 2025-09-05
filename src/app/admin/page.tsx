'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalExams: number
  totalQuestions: number
  totalCertificates: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalCertificates: 0
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

    // Decode token to get user info (simple implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ADMIN' && payload.role !== 'TEACHER') {
        window.location.href = '/student'
        return
      }
      setUser(payload)
    } catch (error) {
      window.location.href = '/auth/login'
      return
    }

    // Load dashboard data
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">ExamPro Admin</h1>
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
              <CardTitle className="text-base font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-sm text-gray-500 mt-1">Students & Teachers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalExams}</div>
              <p className="text-sm text-gray-500 mt-1">Active & Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Questions Bank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</div>
              <p className="text-sm text-gray-500 mt-1">MCQ & True/False</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-600">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalCertificates}</div>
              <p className="text-sm text-gray-500 mt-1">Issued This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/subjects">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">📚</span>
                  <span className="text-sm">Manage Subjects</span>
                </Button>
              </Link>
              <Link href="/admin/questions">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">❓</span>
                  <span className="text-sm">Question Bank</span>
                </Button>
              </Link>
              <Link href="/admin/exams">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">📋</span>
                  <span className="text-sm">Create Exam</span>
                </Button>
              </Link>
              <Link href="/admin/results">
                <Button className="w-full h-auto py-4 flex flex-col items-center space-y-2" variant="outline">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">View Results</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Services</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Certificate Generation</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Backup Status</span>
                      <Badge variant="outline">Last: 2 hours ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Complete these steps to set up your system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      </div>
                      <span className="text-sm">Create subjects and categories</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      </div>
                      <span className="text-sm">Add questions to question bank</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-sm">Create your first exam</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      </div>
                      <span className="text-sm text-gray-500">Invite students to platform</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">JD</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Doe completed Mathematics Quiz</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <Badge variant="outline">Score: 85%</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-semibold">AS</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Alice Smith created new Physics exam</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">System</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Certificate generated for Chemistry Test</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                    <Badge variant="outline">Auto</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Performance</CardTitle>
                  <CardDescription>Student performance trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-4xl mb-4 block">📊</span>
                    <p>Analytics charts will be available once you have exam data</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Subject Popularity</CardTitle>
                  <CardDescription>Most attempted subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-4xl mb-4 block">📈</span>
                    <p>Subject analytics will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-generate certificates</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email notifications</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI question generation</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Configure Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account & Security</CardTitle>
                  <CardDescription>Manage your admin account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Admin Email</Label>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Role</Label>
                      <p className="text-sm text-gray-600">{user?.role}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
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