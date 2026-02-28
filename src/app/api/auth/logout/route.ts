import { NextRequest, NextResponse } from 'next/server'

// Types
interface LogoutResponse {
  success: boolean
  message: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const authToken = request.cookies.get('auth_token')?.value
    
    // Create response
    const response = NextResponse.json<LogoutResponse>(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    )

    // Clear auth_token cookie
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    // Clear user_info cookie
    response.cookies.set({
      name: 'user_info',
      value: '',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    // Clear any other session cookies
    response.cookies.set({
      name: 'session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    // Log logout activity (for monitoring)
    if (authToken) {
      console.log(`User logged out at ${new Date().toISOString()}`)
      // In production, you might want to:
      // - Invalidate the token in database
      // - Add token to blacklist
      // - Log user activity
    }

    return response

  } catch (error) {
    // Log error for debugging
    console.error('Logout error:', error)

    // Return error response
    return NextResponse.json<LogoutResponse>(
      {
        success: false,
        message: 'An error occurred during logout',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// Also handle GET requests (some implementations use GET for logout)
export async function GET(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.redirect(new URL('/auth/login', request.url))

    // Clear all cookies
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    response.cookies.set({
      name: 'user_info',
      value: '',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    response.cookies.set({
      name: 'session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=logout_failed', request.url))
  }
}

// Optional: Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  )
}