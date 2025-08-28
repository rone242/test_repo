import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

/**
 * User login API endpoint
 * Authenticates user credentials and returns JWT token
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = user.toJSON()

    return NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    }, { status: 200 })

  } catch (error: any) {
    console.error('Login error:', error)
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || error.reason?.type === 'ReplicaSetNoPrimary') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}