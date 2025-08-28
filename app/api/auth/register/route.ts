import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

/**
 * User registration API endpoint
 * Creates new user account with validation and JWT token generation
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, email, password, phone, country = 'BD' } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone,
      country,
      balance: 0,
      isVerified: false
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = user.toJSON()

    return NextResponse.json({
      message: 'User registered successfully',
      user: userResponse,
      token
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || error.reason?.type === 'ReplicaSetNoPrimary') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 503 }
      )
    }

    // Handle duplicate key errors (email already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}