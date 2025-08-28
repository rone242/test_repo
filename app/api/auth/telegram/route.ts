import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

/**
 * Telegram authentication endpoint
 * Verifies Telegram login widget data and creates/updates user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = body

    // Verify Telegram data authenticity
    const botToken = process.env.TELEGRAM_BOT_TOKEN!
    const secretKey = crypto.createHash('sha256').update(botToken).digest()
    
    const dataCheckString = Object.keys(body)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${body[key]}`)
      .join('\n')
    
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
    
    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 400 })
    }

    // Check if auth_date is not too old (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime - auth_date > 300) {
      return NextResponse.json({ error: 'Authentication data is too old' }, { status: 400 })
    }

    await connectDB()

    // Find or create user
    let user = await User.findOne({ telegramId: id.toString() })
    
    if (!user) {
      // Check if user exists with same username/email
      const existingUser = await User.findOne({ 
        $or: [
          { username: username },
          { email: `${username}@telegram.user` }
        ]
      })

      if (existingUser) {
        // Link Telegram to existing account
        existingUser.telegramId = id.toString()
        existingUser.profilePicture = photo_url
        await existingUser.save()
        user = existingUser
      } else {
        // Create new user
        user = new User({
          name: `${first_name} ${last_name || ''}`.trim(),
          username: username || `telegram_${id}`,
          email: `${username || id}@telegram.user`,
          telegramId: id.toString(),
          profilePicture: photo_url,
          isVerified: true, // Telegram users are considered verified
          authProvider: 'telegram'
        })
        await user.save()
      }
    } else {
      // Update existing user info
      user.name = `${first_name} ${last_name || ''}`.trim()
      user.profilePicture = photo_url
      user.lastLogin = new Date()
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        telegramId: user.telegramId
      }
    })

  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}