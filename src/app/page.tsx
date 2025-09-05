'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HomePage() {

  const features = [
    {
      title: 'Question Bank Management',
      description: 'Create and organize questions by subjects, topics, and difficulty levels',
      icon: '📝',
      roles: ['admin']
    },
    {
      title: 'Exam Creation',
      description: 'Build comprehensive exams with customizable settings and time limits',
      icon: '📋',
      roles: ['admin']
    },
    {
      title: 'Take Exams',
      description: 'Interactive exam interface with real-time timer and progress tracking',
      icon: '✏️',
      roles: ['student']
    },
    {
      title: 'Results & Analytics',
      description: 'Detailed performance analysis with insights and recommendations',
      icon: '📊',
      roles: ['student', 'admin']
    },
    {
      title: 'Certificate Generation',
      description: 'AI-powered digital certificates with verification system',
      icon: '🏆',
      roles: ['student', 'admin']
    },
    {
      title: 'Dashboard Analytics',
      description: 'Comprehensive overview of exams, students, and performance metrics',
      icon: '📈',
      roles: ['admin']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ExamPro</h1>
                <p className="text-sm text-gray-600">Online Examination & Certificate System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Modern Online Examination
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {' '}& Certificate System
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Perfect for colleges, schools, and coaching centers. Create engaging exams, 
              track performance, and issue AI-generated certificates with digital verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register?role=student">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start as Student
                </Button>
              </Link>
              <Link href="/auth/register?role=admin">
                <Button size="lg" variant="outline" className="border-2">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-gray-600">Exams Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">500+</div>
              <div className="text-gray-600">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600">Certificates Issued</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Examination Solution
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for modern online education and assessment
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="student">For Students</TabsTrigger>
              <TabsTrigger value="admin">For Educators</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{feature.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <div className="flex gap-1 mt-2">
                            {feature.roles.map(role => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="student" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.filter(f => f.roles.includes('student')).map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{feature.icon}</div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.filter(f => f.roles.includes('admin')).map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{feature.icon}</div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose ExamPro?
              </h3>
              <p className="text-xl text-gray-600">
                Built specifically for educational institutions in India
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <CardTitle className="text-xl">For Educational Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Designed for colleges, schools, and coaching centers with Indian education system in mind.
                    Supports multiple languages and examination patterns.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <CardTitle className="text-xl">AI-Powered Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Automatic question generation, intelligent performance analysis, 
                    and AI-generated certificates with professional templates.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-0 bg-gradient-to-br from-purple-50 to-violet-50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <CardTitle className="text-xl">Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Advanced anti-cheating measures, secure authentication, 
                    and digital certificate verification for complete trust.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-4xl font-bold mb-6">
              Ready to Transform Your Examinations?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of educational institutions already using ExamPro 
              for their online examination needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold">ExamPro</span>
              </div>
              <p className="text-gray-400">
                Modern online examination and certificate system for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Question Bank</li>
                <li>Exam Creation</li>
                <li>Result Analytics</li>
                <li>AI Certificates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Institutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Colleges</li>
                <li>Schools</li>
                <li>Coaching Centers</li>
                <li>Training Institutes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ExamPro. Built for Indian Educational Institutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}