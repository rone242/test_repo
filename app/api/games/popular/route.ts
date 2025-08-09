import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Game from '@/models/Game'

/**
 * GET /api/games/popular
 * Fetch popular games by type
 * Query parameters:
 * - type: casino, sports, live-casino, esports (optional)
 * - limit: number of games to return (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get popular games using the static method
    const games = await Game.getPopularGames(type || undefined, limit)

    // Group games by type for better organization
    const gamesByType = games.reduce((acc: any, game: any) => {
      if (!acc[game.type]) {
        acc[game.type] = []
      }
      acc[game.type].push(game)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        games,
        gamesByType,
        totalCount: games.length
      }
    })

  } catch (error) {
    console.error('Popular Games API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch popular games' },
      { status: 500 }
    )
  }
}