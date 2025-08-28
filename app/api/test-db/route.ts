import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

/**
 * Test MongoDB database connection
 * GET /api/test-db - Returns connection status
 */
export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await connectDB()
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connection successful!',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('MongoDB connection error:', error)
    
    return NextResponse.json({
      success: false,
      message: '❌ MongoDB connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}