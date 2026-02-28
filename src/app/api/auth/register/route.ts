import { NextRequest, NextResponse } from 'next/server'

// Types
interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  acceptTerms: boolean
}

interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      name: string
      email: string
      phone: string
      role: string
    }
    token: string
  }
  errors?: Record<string, string>
  error?: string
}

// Mock user database - replace with actual database
const users: any[] = [
  {
    id: '1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    password: 'password123', // In production, this should be hashed
    phone: '+91 98765 43210',
    role: 'SUPER_ADMIN'
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
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(password)
}

// Validate phone number (Indian format)
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$|^\+91[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

// Check if user exists
const userExists = (email: string): boolean => {
  return users.some(u => u.email.toLowerCase() === email.toLowerCase())
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RegisterRequest = await request.json()
    const { name, email, password, confirmPassword, phone, acceptTerms } = body

    const errors: Record<string, string> = {}

    // Validate name
    if (!name || !name.trim()) {
      errors.name = 'Name is required'
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (name.length > 50) {
      errors.name = 'Name must be less than 50 characters'
    }

    // Validate email
    if (!email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format'
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required'
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Validate phone
    if (!phone) {
      errors.phone = 'Phone number is required'
    } else if (!isValidPhone(phone)) {
      errors.phone = 'Invalid phone number (10 digits required)'
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions'
    }

    // Check if user already exists
    if (email && userExists(email)) {
      errors.email = 'Email already registered'
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json<RegisterResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    // Clean phone number (remove spaces, +91 if present)
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '')

    // Create new user (in production, hash password)
    const newUser = {
      id: (users.length + 1).toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // In production: await bcrypt.hash(password, 10)
      phone: cleanPhone,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to mock database
    users.push(newUser)

    // Generate token
    const token = generateToken(newUser.id, newUser.email)

    // Create response
    const response = NextResponse.json<RegisterResponse>(
      {
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
          },
          token
        }
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    // Set user info cookie (non-httpOnly for client access)
    response.cookies.set({
      name: 'user_info',
      value: JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    // Log registration
    console.log(`New user registered: ${newUser.email} at ${new Date().toISOString()}`)

    return response

  } catch (error) {
    // Log error for debugging
    console.error('Registration error:', error)

    // Return error response
    return NextResponse.json<RegisterResponse>(
      {
        success: false,
        message: 'An error occurred during registration',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}