'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause,
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Wifi,
  WifiOff,
  Activity,
  Star,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Heart,
  Share2,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import Button from '@/components/ui/Button'

// Types for live match data
interface LiveMatch {
  id: string
  team1: {
    name: string
    logo: string
    score: number
    color: string
  }
  team2: {
    name: string
    logo: string
    score: number
    color: string
  }
  league: string
  sport: string
  status: 'live' | 'halftime' | 'finished'
  startTime: string
  currentTime: string
  period: string
  streamUrl: string
  viewers: number
  odds: {
    team1Win: { back: number; lay: number; change: 'up' | 'down' | 'stable' }
    draw?: { back: number; lay: number; change: 'up' | 'down' | 'stable' }
    team2Win: { back: number; lay: number; change: 'up' | 'down' | 'stable' }
  }
  markets: BettingMarket[]
  stats: MatchStats
  events: MatchEvent[]
  featured: boolean
  trending: boolean
}

interface BettingMarket {
  id: string
  name: string
  type: 'match_odds' | 'over_under' | 'handicap' | 'both_teams_score'
  options: {
    name: string
    odds: number
    change: 'up' | 'down' | 'stable'
    volume: number
  }[]
}

interface MatchStats {
  possession: { team1: number; team2: number }
  shots: { team1: number; team2: number }
  corners: { team1: number; team2: number }
  fouls: { team1: number; team2: number }
  yellowCards: { team1: number; team2: number }
  redCards: { team1: number; team2: number }
}

interface MatchEvent {
  id: string
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'corner'
  team: 'team1' | 'team2'
  player: string
  time: string
  description: string
}

/**
 * Live Matches page component with streaming, real-time scores, and betting odds
 * Features multi-view streaming, live statistics, and comprehensive betting markets
 */
export default function LiveMatchesPage() {
  // State management
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedView, setSelectedView] = useState<'main' | 'multi'>('main')
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Sports categories
  const sportsCategories = [
    { id: 'all', name: 'All Sports', icon: '⚽', count: 0 },
    { id: 'cricket', name: 'Cricket', icon: '🏏', count: 0 },
    { id: 'soccer', name: 'Soccer', icon: '⚽', count: 0 },
    { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0 },
    { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0 },
    { id: 'esports', name: 'E-Sports', icon: '🎮', count: 0 }
  ]

  /**
   * Initialize WebSocket connection for real-time updates
   */
  const initializeWebSocket = () => {
    try {
      // Mock WebSocket connection - replace with actual endpoint
      setTimeout(() => {
        setIsConnected(true)
        setLoading(false)
        loadMockData()
      }, 1000)
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setLoading(false)
      loadMockData()
    }
  }

  /**
   * Load mock live match data
   */
  const loadMockData = () => {
    const mockMatches: LiveMatch[] = [
      {
        id: '1',
        team1: {
          name: 'Bangladesh Tigers',
          logo: '🇧🇩',
          score: 2,
          color: 'from-green-500 to-red-500'
        },
        team2: {
          name: 'India Warriors',
          logo: '🇮🇳',
          score: 1,
          color: 'from-orange-500 to-blue-500'
        },
        league: 'Asia Cup 2024 Final',
        sport: 'cricket',
        status: 'live',
        startTime: '2024-01-15T14:30:00Z',
        currentTime: '78:45',
        period: '2nd Innings',
        streamUrl: 'https://example.com/stream1',
        viewers: 125000,
        odds: {
          team1Win: { back: 1.85, lay: 1.87, change: 'up' },
          team2Win: { back: 2.15, lay: 2.17, change: 'down' }
        },
        markets: [
          {
            id: 'match_odds',
            name: 'Match Winner',
            type: 'match_odds',
            options: [
              { name: 'Bangladesh', odds: 1.85, change: 'up', volume: 45000 },
              { name: 'India', odds: 2.15, change: 'down', volume: 38000 }
            ]
          },
          {
            id: 'total_runs',
            name: 'Total Runs Over/Under 280.5',
            type: 'over_under',
            options: [
              { name: 'Over 280.5', odds: 1.90, change: 'stable', volume: 25000 },
              { name: 'Under 280.5', odds: 1.90, change: 'stable', volume: 22000 }
            ]
          }
        ],
        stats: {
          possession: { team1: 55, team2: 45 },
          shots: { team1: 12, team2: 8 },
          corners: { team1: 6, team2: 4 },
          fouls: { team1: 8, team2: 12 },
          yellowCards: { team1: 2, team2: 3 },
          redCards: { team1: 0, team2: 1 }
        },
        events: [
          {
            id: '1',
            type: 'goal',
            team: 'team1',
            player: 'Shakib Al Hasan',
            time: '45:30',
            description: 'Boundary - 4 runs'
          },
          {
            id: '2',
            type: 'goal',
            team: 'team2',
            player: 'Virat Kohli',
            time: '67:15',
            description: 'Six - Maximum'
          }
        ],
        featured: true,
        trending: true
      },
      {
        id: '2',
        team1: {
          name: 'Manchester United',
          logo: '🔴',
          score: 2,
          color: 'from-red-600 to-yellow-500'
        },
        team2: {
          name: 'Liverpool FC',
          logo: '🔴',
          score: 3,
          color: 'from-red-500 to-red-700'
        },
        league: 'Premier League',
        sport: 'soccer',
        status: 'live',
        startTime: '2024-01-15T15:00:00Z',
        currentTime: '78:45',
        period: '2nd Half',
        streamUrl: 'https://example.com/stream2',
        viewers: 89000,
        odds: {
          team1Win: { back: 3.20, lay: 3.25, change: 'down' },
          draw: { back: 3.50, lay: 3.55, change: 'stable' },
          team2Win: { back: 2.10, lay: 2.12, change: 'up' }
        },
        markets: [
          {
            id: 'match_odds',
            name: 'Full Time Result',
            type: 'match_odds',
            options: [
              { name: 'Man United', odds: 3.20, change: 'down', volume: 25000 },
              { name: 'Draw', odds: 3.50, change: 'stable', volume: 15000 },
              { name: 'Liverpool', odds: 2.10, change: 'up', volume: 35000 }
            ]
          },
          {
            id: 'total_goals',
            name: 'Total Goals Over/Under 2.5',
            type: 'over_under',
            options: [
              { name: 'Over 2.5', odds: 1.45, change: 'down', volume: 40000 },
              { name: 'Under 2.5', odds: 2.75, change: 'up', volume: 18000 }
            ]
          }
        ],
        stats: {
          possession: { team1: 42, team2: 58 },
          shots: { team1: 8, team2: 15 },
          corners: { team1: 3, team2: 9 },
          fouls: { team1: 12, team2: 8 },
          yellowCards: { team1: 3, team2: 2 },
          redCards: { team1: 0, team2: 0 }
        },
        events: [
          {
            id: '1',
            type: 'goal',
            team: 'team1',
            player: 'Marcus Rashford',
            time: '23:15',
            description: 'Goal - Right foot shot'
          },
          {
            id: '2',
            type: 'goal',
            team: 'team2',
            player: 'Mohamed Salah',
            time: '34:22',
            description: 'Goal - Left foot shot'
          }
        ],
        featured: true,
        trending: false
      }
    ]
    
    setLiveMatches(mockMatches)
    if (mockMatches.length > 0) {
      setSelectedMatch(mockMatches[0].id)
    }
  }

  /**
   * Get the currently selected match
   */
  const getCurrentMatch = () => {
    return liveMatches.find(match => match.id === selectedMatch)
  }

  /**
   * Toggle video playback
   */
  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  /**
   * Toggle video mute
   */
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  /**
   * Filter matches based on search and sport
   */
  const filteredMatches = liveMatches.filter(match => {
    if (selectedSport !== 'all' && match.sport !== selectedSport) {
      return false
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return match.team1.name.toLowerCase().includes(query) ||
             match.team2.name.toLowerCase().includes(query) ||
             match.league.toLowerCase().includes(query)
    }
    
    return true
  })

  // Initialize on component mount
  useEffect(() => {
    initializeWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const currentMatch = getCurrentMatch()

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Connection Status Bar */}
      <div className={`w-full py-2 px-4 text-center text-sm transition-colors ${
        isConnected 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Live Streaming Connected</span>
              <Activity className="w-4 h-4 animate-pulse" />
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Connecting to Live Stream...</span>
            </>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🔴 <span className="text-red-400">Live</span> Matches
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
              Watch live sports with real-time streaming, scores, and betting odds
            </p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{liveMatches.reduce((sum, match) => sum + match.viewers, 0).toLocaleString()} watching</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>{liveMatches.length} live matches</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            {currentMatch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-secondary-800 rounded-2xl overflow-hidden border border-secondary-700"
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  {/* Mock video player - replace with actual video component */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-accent-900/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">📺</div>
                      <div className="text-2xl font-bold mb-2">Live Stream</div>
                      <div className="text-lg opacity-75">{currentMatch.team1.name} vs {currentMatch.team2.name}</div>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={togglePlayback}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center space-x-2 text-white">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{currentMatch.viewers.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 text-white text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span>LIVE</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleFullscreen}
                          className="text-white hover:bg-white/20"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{currentMatch.team1.logo}</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {currentMatch.team1.score} - {currentMatch.team2.score}
                        </div>
                        <div className="text-sm text-secondary-400">{currentMatch.currentTime}</div>
                      </div>
                      <div className="text-2xl">{currentMatch.team2.logo}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{currentMatch.league}</div>
                      <div className="text-sm text-secondary-400">{currentMatch.period}</div>
                    </div>
                  </div>

                  {/* Team Names */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="font-semibold text-white">{currentMatch.team1.name}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-secondary-400">VS</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">{currentMatch.team2.name}</div>
                    </div>
                  </div>

                  {/* Quick Betting Odds */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-secondary-700 rounded-lg p-3 text-center hover:bg-secondary-600 transition-colors cursor-pointer">
                      <div className="text-sm text-secondary-300 mb-1">{currentMatch.team1.name}</div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-bold text-white">{currentMatch.odds.team1Win.back}</span>
                        {currentMatch.odds.team1Win.change === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {currentMatch.odds.team1Win.change === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                    
                    {currentMatch.odds.draw && (
                      <div className="bg-secondary-700 rounded-lg p-3 text-center hover:bg-secondary-600 transition-colors cursor-pointer">
                        <div className="text-sm text-secondary-300 mb-1">Draw</div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-bold text-white">{currentMatch.odds.draw.back}</span>
                          {currentMatch.odds.draw.change === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                          {currentMatch.odds.draw.change === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-secondary-700 rounded-lg p-3 text-center hover:bg-secondary-600 transition-colors cursor-pointer">
                      <div className="text-sm text-secondary-300 mb-1">{currentMatch.team2.name}</div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-bold text-white">{currentMatch.odds.team2Win.back}</span>
                        {currentMatch.odds.team2Win.change === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {currentMatch.odds.team2Win.change === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Match Statistics */}
            {currentMatch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 mt-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Match Statistics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Possession</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">{currentMatch.stats.possession.team1}%</span>
                      <div className="w-32 h-2 bg-secondary-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                          style={{ width: `${currentMatch.stats.possession.team1}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">{currentMatch.stats.possession.team2}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Shots</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">{currentMatch.stats.shots.team1}</span>
                      <Target className="w-4 h-4 text-secondary-400" />
                      <span className="text-white font-semibold">{currentMatch.stats.shots.team2}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Corners</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">{currentMatch.stats.corners.team1}</span>
                      <div className="w-4 h-4 border border-secondary-400 rounded-sm" />
                      <span className="text-white font-semibold">{currentMatch.stats.corners.team2}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Yellow Cards</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">{currentMatch.stats.yellowCards.team1}</span>
                      <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                      <span className="text-white font-semibold">{currentMatch.stats.yellowCards.team2}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Live Matches List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Live Matches</h3>
                <Button variant="ghost" size="sm" onClick={() => {}}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMatch === match.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-700 hover:bg-secondary-600 text-secondary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">LIVE</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Eye className="w-3 h-3" />
                        <span>{(match.viewers / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium mb-1">
                      {match.team1.name} vs {match.team2.name}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-75">{match.league}</span>
                      <span className="font-bold">
                        {match.team1.score} - {match.team2.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Betting Markets */}
            {currentMatch && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700"
              >
                <h3 className="text-xl font-bold text-white mb-6">Betting Markets</h3>
                
                <div className="space-y-4">
                  {currentMatch.markets.map((market) => (
                    <div key={market.id} className="border border-secondary-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">{market.name}</h4>
                      <div className="space-y-2">
                        {market.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary-700 rounded hover:bg-secondary-600 transition-colors cursor-pointer"
                          >
                            <span className="text-sm text-secondary-300">{option.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white">{option.odds}</span>
                              {option.change === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                              {option.change === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}