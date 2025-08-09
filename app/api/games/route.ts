import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Game from '@/models/Game'

/**
 * GET /api/games
 * Fetch games with filtering and pagination
 * Query parameters:
 * - type: casino, sports, live-casino, esports
 * - category: specific game category
 * - provider: game provider
 * - featured: true/false
 * - live: true/false
 * - limit: number of games to return
 * - page: page number for pagination
 * - search: search term for game names
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const provider = searchParams.get('provider')
    const featured = searchParams.get('featured')
    const live = searchParams.get('live')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build query
    const query: any = { isActive: true }
    
    if (type) query.type = type
    if (category) query.category = category
    if (provider) query.provider = provider
    if (featured === 'true') query.isFeatured = true
    if (live === 'true') query.isLive = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Execute query with pagination
    const [games, totalCount] = await Promise.all([
      Game.find(query)
        .sort({ popularity: -1, playerCount: -1, createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('-__v'),
      Game.countDocuments(query)
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        games,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    })

  } catch (error) {
    console.error('Games API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/games
 * Create a new game (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'category', 'provider', 'minBet', 'maxBet']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create new game
    const game = new Game(body)
    await game.save()

    return NextResponse.json({
      success: true,
      data: game,
      message: 'Game created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create Game Error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create game' },
      { status: 500 }
    )
  }
}