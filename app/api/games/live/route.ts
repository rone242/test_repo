import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Game from '@/models/Game'

/**
 * GET /api/games/live
 * Fetch live games and sports events
 * Query parameters:
 * - type: casino, sports, live-casino, esports (optional)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Get live games using the static method
    const liveGames = await Game.getLiveGames(type || undefined)

    // Separate sports events and casino games
    const sportsEvents = liveGames.filter((game: any) => game.type === 'sports')
    const casinoGames = liveGames.filter((game: any) => 
      game.type === 'casino' || game.type === 'live-casino'
    )
    const esportsEvents = liveGames.filter((game: any) => game.type === 'esports')

    // Get live statistics
    const stats = {
      totalLiveGames: liveGames.length,
      liveSports: sportsEvents.length,
      liveCasino: casinoGames.length,
      liveEsports: esportsEvents.length,
      totalPlayers: liveGames.reduce((sum: number, game: any) => 
        sum + (game.playerCount || 0), 0
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        liveGames,
        sportsEvents,
        casinoGames,
        esportsEvents,
        stats
      }
    })

  } catch (error) {
    console.error('Live Games API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live games' },
      { status: 500 }
    )
  }
}