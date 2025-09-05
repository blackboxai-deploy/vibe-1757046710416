import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.certificate.deleteMany()
  await prisma.examAttempt.deleteMany()
  await prisma.examQuestion.deleteMany()
  await prisma.question.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const studentPassword = await bcrypt.hash('student123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const student = await prisma.user.create({
    data: {
      name: 'Student Demo',
      email: 'student@demo.com',
      password: studentPassword,
      role: 'STUDENT'
    }
  })

  // Create subjects
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Basic Mathematics concepts including algebra and geometry'
    }
  })

  const scienceSubject = await prisma.subject.create({
    data: {
      name: 'Science',
      code: 'SCI101', 
      description: 'General Science covering physics, chemistry, and biology'
    }
  })

  const englishSubject = await prisma.subject.create({
    data: {
      name: 'English',
      code: 'ENG101',
      description: 'English language and literature'
    }
  })

  // Create sample questions for Mathematics
  const mathQuestions = await Promise.all([
    prisma.question.create({
      data: {
        question: 'What is 2 + 2?',
        options: JSON.stringify(['2', '3', '4', '5']),
        correctAnswer: '4',
        explanation: '2 + 2 equals 4',
        difficulty: 'EASY',
        type: 'MCQ',
        points: 1,
        subjectId: mathSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'What is the value of π (pi) approximately?',
        options: JSON.stringify(['3.14', '2.71', '1.61', '4.14']),
        correctAnswer: '3.14',
        explanation: 'Pi (π) is approximately 3.14159',
        difficulty: 'MEDIUM',
        type: 'MCQ',
        points: 2,
        subjectId: mathSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'If x + 5 = 12, what is the value of x?',
        options: JSON.stringify(['5', '6', '7', '8']),
        correctAnswer: '7',
        explanation: 'x + 5 = 12, so x = 12 - 5 = 7',
        difficulty: 'MEDIUM',
        type: 'MCQ',
        points: 2,
        subjectId: mathSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'What is the square root of 144?',
        options: JSON.stringify(['10', '11', '12', '13']),
        correctAnswer: '12',
        explanation: '12 × 12 = 144, so √144 = 12',
        difficulty: 'EASY',
        type: 'MCQ',
        points: 1,
        subjectId: mathSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'Is the statement "All triangles have three sides" true or false?',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: 'True',
        explanation: 'By definition, all triangles have exactly three sides',
        difficulty: 'EASY',
        type: 'TRUE_FALSE',
        points: 1,
        subjectId: mathSubject.id
      }
    })
  ])

  // Create sample questions for Science
  const scienceQuestions = await Promise.all([
    prisma.question.create({
      data: {
        question: 'What is the chemical symbol for water?',
        options: JSON.stringify(['H2O', 'CO2', 'O2', 'N2']),
        correctAnswer: 'H2O',
        explanation: 'Water is composed of 2 hydrogen atoms and 1 oxygen atom',
        difficulty: 'EASY',
        type: 'MCQ',
        points: 1,
        subjectId: scienceSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'How many bones are there in the adult human body?',
        options: JSON.stringify(['206', '205', '207', '208']),
        correctAnswer: '206',
        explanation: 'An adult human skeleton has 206 bones',
        difficulty: 'MEDIUM',
        type: 'MCQ',
        points: 2,
        subjectId: scienceSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'What is the speed of light in vacuum?',
        options: JSON.stringify(['3×10^8 m/s', '2×10^8 m/s', '4×10^8 m/s', '1×10^8 m/s']),
        correctAnswer: '3×10^8 m/s',
        explanation: 'The speed of light in vacuum is approximately 299,792,458 m/s or 3×10^8 m/s',
        difficulty: 'HARD',
        type: 'MCQ',
        points: 3,
        subjectId: scienceSubject.id
      }
    })
  ])

  // Create sample questions for English
  const englishQuestions = await Promise.all([
    prisma.question.create({
      data: {
        question: 'Which of the following is a noun?',
        options: JSON.stringify(['Running', 'Beautiful', 'Book', 'Quickly']),
        correctAnswer: 'Book',
        explanation: 'A noun is a word that names a person, place, thing, or idea. Book is a thing.',
        difficulty: 'EASY',
        type: 'MCQ',
        points: 1,
        subjectId: englishSubject.id
      }
    }),
    prisma.question.create({
      data: {
        question: 'What is the past tense of "go"?',
        options: JSON.stringify(['Goed', 'Gone', 'Went', 'Going']),
        correctAnswer: 'Went',
        explanation: 'The past tense of the irregular verb "go" is "went"',
        difficulty: 'EASY',
        type: 'MCQ',
        points: 1,
        subjectId: englishSubject.id
      }
    })
  ])

  // Create sample exams
  const mathExam = await prisma.exam.create({
    data: {
      title: 'Basic Mathematics Quiz',
      description: 'Test your knowledge of basic mathematical concepts',
      instructions: 'Answer all questions to the best of your ability. Each question has only one correct answer.',
      duration: 30, // 30 minutes
      totalQuestions: 5,
      totalMarks: 8,
      passingMarks: 60,
      isActive: true,
      randomizeOrder: true,
      showResults: true,
      allowReview: true,
      subjectId: mathSubject.id,
      createdById: admin.id
    }
  })

  const scienceExam = await prisma.exam.create({
    data: {
      title: 'General Science Test',
      description: 'Comprehensive test covering basic science topics',
      instructions: 'Read each question carefully and select the best answer.',
      duration: 45, // 45 minutes
      totalQuestions: 3,
      totalMarks: 6,
      passingMarks: 70,
      isActive: true,
      randomizeOrder: false,
      showResults: true,
      allowReview: true,
      subjectId: scienceSubject.id,
      createdById: admin.id
    }
  })

  const englishExam = await prisma.exam.create({
    data: {
      title: 'English Language Basics',
      description: 'Test your understanding of English grammar and vocabulary',
      instructions: 'Choose the correct answer for each question.',
      duration: 20, // 20 minutes
      totalQuestions: 2,
      totalMarks: 2,
      passingMarks: 50,
      isActive: true,
      randomizeOrder: true,
      showResults: true,
      allowReview: true,
      subjectId: englishSubject.id,
      createdById: admin.id
    }
  })

  // Link questions to exams
  await Promise.all([
    ...mathQuestions.map((question, index) => 
      prisma.examQuestion.create({
        data: {
          examId: mathExam.id,
          questionId: question.id,
          order: index + 1,
          points: question.points
        }
      })
    ),
    ...scienceQuestions.map((question, index) => 
      prisma.examQuestion.create({
        data: {
          examId: scienceExam.id,
          questionId: question.id,
          order: index + 1,
          points: question.points
        }
      })
    ),
    ...englishQuestions.map((question, index) => 
      prisma.examQuestion.create({
        data: {
          examId: englishExam.id,
          questionId: question.id,
          order: index + 1,
          points: question.points
        }
      })
    )
  ])

  console.log('✅ Database seeded successfully!')
  console.log('🔑 Demo accounts:')
  console.log('   Admin: admin@demo.com / admin123')
  console.log('   Student: student@demo.com / student123')
  console.log('📚 Created subjects: Mathematics, Science, English')
  console.log('❓ Created sample questions and exams')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })