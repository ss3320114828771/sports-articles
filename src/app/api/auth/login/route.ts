import { NextRequest, NextResponse } from 'next/server'

// Types
interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

interface LoginResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    token: string
  }
  error?: string
}

// Mock user database - replace with actual database
const users = [
  {
    id: '1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    password: 'password123', // In production, this should be hashed
    role: 'SUPER_ADMIN'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'CUSTOMER'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'MANAGER'
  }
]

// Generate a simple token (in production, use JWT)
const generateToken = (userId: string, email: string) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return `token_${userId}_${timestamp}_${random}`
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json()
    const { email, password, rememberMe } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          message: 'Email and password are required',
          error: 'MISSING_FIELDS'
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_EMAIL'
        },
        { status: 400 }
      )
    }

    // Validate password length
    if (!isValidPassword(password)) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          message: 'Password must be at least 6 characters',
          error: 'INVALID_PASSWORD'
        },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    // Check if user exists
    if (!user) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          message: 'Invalid email or password',
          error: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      )
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json<LoginResponse>(
        {
          success: false,
          message: 'Invalid email or password',
          error: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    // Set token expiration based on rememberMe
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours

    // Create response
    const response = NextResponse.json<LoginResponse>(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/'
    })

    // Set user info cookie (non-httpOnly for client access)
    response.cookies.set({
      name: 'user_info',
      value: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/'
    })

    // Log login attempt (for monitoring)
    console.log(`Login successful for user: ${user.email} at ${new Date().toISOString()}`)

    return response

  } catch (error) {
    // Log error for debugging
    console.error('Login error:', error)

    // Return error response
    return NextResponse.json<LoginResponse>(
      {
        success: false,
        message: 'An error occurred during login',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// Optional: Rate limiting could be implemented here
// Optional: Add login attempt tracking
// Optional: Add IP-based blocking for suspicious activities

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}