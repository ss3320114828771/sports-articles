import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  phone?: string
}

export interface Session {
  user: User
  token: string
}

// Constants
const SESSION_COOKIE_NAME = 'auth_session'
const USER_COOKIE_NAME = 'auth_user'

// Generate simple token
function generateToken(user: User): string {
  const data = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

// Verify simple token
function verifyToken(token: string): any {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

// Create session
export function createSession(user: User): Session {
  const token = generateToken(user)
  return { user, token }
}

// Set session cookies (FIXED)
export async function setSessionCookies(session: Session): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })

  cookieStore.set(USER_COOKIE_NAME, JSON.stringify(session.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/'
  })
}

// Get session (FIXED)
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value

  if (!token || !userCookie) return null

  try {
    const user = JSON.parse(userCookie)
    const decoded = verifyToken(token)
    if (!decoded) return null
    return { user, token }
  } catch {
    return null
  }
}

// Get session from request (FIXED - works with NextRequest)
export function getSessionFromRequest(request: NextRequest): Session | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const userCookie = request.cookies.get(USER_COOKIE_NAME)?.value

  if (!token || !userCookie) return null

  try {
    const user = JSON.parse(userCookie)
    const decoded = verifyToken(token)
    if (!decoded) return null
    return { user, token }
  } catch {
    return null
  }
}

// Clear session (FIXED)
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(USER_COOKIE_NAME)
}

// Check authentication (FIXED)
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

// Get current user (FIXED)
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

// Require auth (FIXED - now async)
export async function requireAuth(redirectTo: string = '/auth/login'): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user!
}

// Simple login (FIXED)
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Mock users
  const users = [
    { id: '1', name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
    { id: '2', name: 'User', email: 'user@example.com', password: 'user123', role: 'customer' as const },
    { id: '3', name: 'Hafiz Sajid Syed', email: 'sajid.syed@gmail.com', password: 'password123', role: 'admin' as const }
  ]

  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  const { password: _, ...userWithoutPassword } = user
  const session = createSession(userWithoutPassword)
  await setSessionCookies(session)

  return { success: true, user: userWithoutPassword }
}

// Simple register
export async function register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email format' }
  }

  // Mock registration
  console.log('User registered:', { name, email })
  return { success: true }
}

// Simple logout (FIXED)
export async function logout(): Promise<void> {
  await clearSession()
}

// Simple email validation
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}