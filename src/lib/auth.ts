import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AuthUser, Role } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    ADMIN: 3,
    TEACHER: 2,
    STUDENT: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}