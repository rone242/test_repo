import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connect to MongoDB database
 * Uses connection caching to prevent multiple connections
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e: any) {
    cached.promise = null
    console.error('❌ MongoDB connection failed:', e.message)
    
    // Provide helpful error messages
    if (e.message.includes('ENOTFOUND') || e.message.includes('ECONNREFUSED')) {
      throw new Error('MongoDB Atlas connection failed. Please check: 1) Your IP is whitelisted in MongoDB Atlas, 2) Your internet connection, 3) MongoDB Atlas cluster is running')
    }
    
    throw e
  }

  return cached.conn
}

export default connectDB