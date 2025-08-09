'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Play, 
  TrendingUp, 
  Users, 
  Calendar, 
  Trophy, 
  Wifi,
  WifiOff,
  Activity,
  Star,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import Button from '@/components/ui/Button'

// Types for sports data
interface Match {
  id: string
  team1: string
  team2: string
  league: string
  sport: string
  status: 'live' | 'upcoming' | 'finished'
  startTime: string
  odds: {
    team1: { back: number; lay: number }
    draw?: { back: number; lay: number }
    team2: { back: number; lay: number }
  }
  score?: {
    team1: number
    team2: number
  }
  matched: number
  inPlay: boolean
  featured: boolean
}

interface SportCategory {
  id: string
  name: string
  icon: string
  count: number
  active: boolean
}

/**
 * Dynamic sports page component with WebSocket integration
 * Features real-time odds updates, live match data, and responsive design
 */
export default function SportsPage() {
  // State management
  const [activeTab, setActiveTab] = useState('Home')
  const [selectedSport, setSelectedSport] = useState('Cricket')
  const [viewBy, setViewBy] = useState('Time')
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, live, upcoming, featured
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null)

  // Navigation tabs with dynamic counts
  const [navTabs, setNavTabs] = useState([
    { name: 'Home', count: null },
    { name: 'In-Play', count: 0 },
    { name: 'Multi Markets', count: null },
    { name: 'Cricket', count: 0 },
    { name: 'Soccer', count: 0 },
    { name: 'Tennis', count: 0 },
    { name: 'E-Soccer', count: 0 },
    { name: 'Result', count: null }
  ])

  // Sports categories with dynamic counts
  const [sportsCategories, setSportsCategories] = useState<SportCategory[]>([
    { id: 'all', name: 'All Sports', icon: '⚽', count: 0, active: true },
    { id: 'cricket', name: 'Cricket', icon: '🏏', count: 0, active: false },
    { id: 'soccer', name: 'Soccer', icon: '⚽', count: 0, active: false },
    { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0, active: false },
    { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0, active: false },
    { id: 'esports', name: 'E-Sports', icon: '🎮', count: 0, active: false }
  ])

  /**
   * Initialize WebSocket connection for real-time data
   */
  const initializeWebSocket = () => {
    try {
      // In production, replace with your actual WebSocket URL
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.pasalive.com/ws/sports' 
        : 'ws://localhost:8080/ws/sports'
      
      wsRef.current = new WebSocket(wsUrl)
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setLoading(false)
        
        // Subscribe to sports data
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          channels: ['matches', 'odds', 'scores']
        }))
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            initializeWebSocket()
          }
        }, 3000)
      }
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }
      
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setLoading(false)
      // Load mock data if WebSocket fails
      loadMockData()
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'matches_update':
        setMatches(data.matches)
        updateCategoryCounts(data.matches)
        break
        
      case 'odds_update':
        updateMatchOdds(data.matchId, data.odds)
        break
        
      case 'score_update':
        updateMatchScore(data.matchId, data.score)
        break
        
      case 'match_status':
        updateMatchStatus(data.matchId, data.status)
        break
        
      default:
        console.log('Unknown message type:', data.type)
    }
  }

  /**
   * Update match odds in real-time
   */
  const updateMatchOdds = (matchId: string, newOdds: any) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, odds: newOdds }
        : match
    ))
  }

  /**
   * Update match scores in real-time
   */
  const updateMatchScore = (matchId: string, newScore: any) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, score: newScore }
        : match
    ))
  }

  /**
   * Update match status
   */
  const updateMatchStatus = (matchId: string, newStatus: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, status: newStatus as any }
        : match
    ))
  }

  /**
   * Update category counts based on matches
   */
  const updateCategoryCounts = (matchesData: Match[]) => {
    const counts = matchesData.reduce((acc, match) => {
      acc[match.sport] = (acc[match.sport] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    setSportsCategories(prev => prev.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? matchesData.length : (counts[cat.id] || 0)
    })))

    // Update nav tab counts
    setNavTabs(prev => prev.map(tab => {
      if (tab.name === 'In-Play') {
        return { ...tab, count: matchesData.filter(m => m.inPlay).length }
      }
      if (tab.name === 'Cricket') {
        return { ...tab, count: counts.cricket || 0 }
      }
      if (tab.name === 'Soccer') {
        return { ...tab, count: counts.soccer || 0 }
      }
      if (tab.name === 'Tennis') {
        return { ...tab, count: counts.tennis || 0 }
      }
      return tab
    }))
  }

  /**
   * Load mock data for development/fallback
   */
  const loadMockData = () => {
    const mockMatches: Match[] = [
      {
        id: '1',
        team1: 'Bangladesh Tigers',
        team2: 'India Warriors',
        league: 'Asia Cup 2024',
        sport: 'cricket',
        status: 'live',
        startTime: new Date().toISOString(),
        odds: {
          team1: { back: 1.85, lay: 1.87 },
          team2: { back: 2.15, lay: 2.17 }
        },
        score: { team1: 156, team2: 89 },
        matched: 125000,
        inPlay: true,
        featured: true
      },
      {
        id: '2',
        team1: 'Manchester United',
        team2: 'Liverpool FC',
        league: 'Premier League',
        sport: 'soccer',
        status: 'live',
        startTime: new Date().toISOString(),
        odds: {
          team1: { back: 2.10, lay: 2.12 },
          draw: { back: 3.20, lay: 3.25 },
          team2: { back: 3.50, lay: 3.55 }
        },
        score: { team1: 1, team2: 2 },
        matched: 89000,
        inPlay: true,
        featured: true
      },
      {
        id: '3',
        team1: 'Novak Djokovic',
        team2: 'Rafael Nadal',
        league: 'French Open',
        sport: 'tennis',
        status: 'upcoming',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        odds: {
          team1: { back: 1.75, lay: 1.77 },
          team2: { back: 2.25, lay: 2.27 }
        },
        matched: 45000,
        inPlay: false,
        featured: true
      }
    ]
    
    setMatches(mockMatches)
    updateCategoryCounts(mockMatches)
    setLoading(false)
  }

  /**
   * Filter matches based on current filters
   */
  const filteredMatches = matches.filter(match => {
    // Sport filter
    if (selectedSport !== 'All Sports' && match.sport !== selectedSport.toLowerCase()) {
      return false
    }
    
    // Status filter
    if (filter === 'live' && match.status !== 'live') return false
    if (filter === 'upcoming' && match.status !== 'upcoming') return false
    if (filter === 'featured' && !match.featured) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return match.team1.toLowerCase().includes(query) ||
             match.team2.toLowerCase().includes(query) ||
             match.league.toLowerCase().includes(query)
    }
    
    return true
  })

  /**
   * Handle manual refresh
   */
  const handleRefresh = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'refresh',
        timestamp: Date.now()
      }))
    } else {
      loadMockData()
    }
  }

  // Initialize WebSocket on component mount
  useEffect(() => {
    initializeWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

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
              <span>Live Data Connected</span>
              <Activity className="w-4 h-4 animate-pulse" />
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Connecting to Live Data...</span>
            </>
          )}
        </div>
      </div>

      {/* Top Navigation */}
      <div className="bg-primary-600 border-b border-primary-500 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {navTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-3 text-sm font-medium relative transition-all duration-200 ${
                    activeTab === tab.name
                      ? 'bg-primary-700 text-white shadow-inner'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && tab.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 text-primary-100 hover:text-white hover:bg-primary-700 rounded transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 bg-secondary-800 min-h-screen shadow-xl">
          <div className="p-4">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary-700 text-white rounded-lg border border-secondary-600 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'all', name: 'All Matches', icon: '📋' },
                  { id: 'live', name: 'Live Now', icon: '🔴' },
                  { id: 'upcoming', name: 'Upcoming', icon: '⏰' },
                  { id: 'featured', name: 'Featured', icon: '⭐' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2 ${
                      filter === filterOption.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <span>{filterOption.icon}</span>
                    <span>{filterOption.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sports Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Sports
              </h3>
              <ul className="space-y-2">
                {sportsCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedSport(category.name)
                        setSportsCategories(prev => prev.map(cat => ({
                          ...cat,
                          active: cat.id === category.id
                        })))
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between ${
                        category.active
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      {category.count > 0 && (
                        <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-accent-600 overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2">Live Sports Betting</h1>
                <p className="text-primary-100">Real-time odds • Live scores • Instant updates</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">{matches.filter(m => m.inPlay).length} Live</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{matches.length} Total Matches</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedSport} Matches
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredMatches.length} matches found
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">View by:</span>
                <select
                  value={viewBy}
                  onChange={(e) => setViewBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="Time">Time</option>
                  <option value="League">League</option>
                  <option value="Popularity">Popularity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading live matches...</p>
              </div>
            </div>
          )}

          {/* Matches Table */}
          {!loading && (
            <div className="bg-white">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100 border-b text-sm font-medium text-gray-700">
                <div className="col-span-6">Match</div>
                <div className="col-span-2 text-center">1</div>
                <div className="col-span-2 text-center">X</div>
                <div className="col-span-2 text-center">2</div>
              </div>

              {/* Matches List */}
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-12 gap-2 p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Match Info */}
                      <div className="col-span-6">
                        <div className="flex items-center space-x-3">
                          {match.status === 'live' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                          {match.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-blue-600 hover:underline cursor-pointer">
                              {match.team1} vs {match.team2}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-4">
                              <span>{match.league}</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {match.status === 'live' 
                                    ? 'LIVE' 
                                    : new Date(match.startTime).toLocaleTimeString()
                                  }
                                </span>
                              </span>
                              {match.score && (
                                <span className="font-medium text-green-600">
                                  {match.score.team1} - {match.score.team2}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Matched: ${match.matched.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team 1 Odds */}
                      <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-1">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                          >
                            {match.odds.team1.back.toFixed(2)}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                          >
                            {match.odds.team1.lay.toFixed(2)}
                          </motion.button>
                        </div>
                      </div>

                      {/* Draw Odds (if applicable) */}
                      <div className="col-span-2">
                        {match.odds.draw ? (
                          <div className="grid grid-cols-2 gap-1">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                            >
                              {match.odds.draw.back.toFixed(2)}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                            >
                              {match.odds.draw.lay.toFixed(2)}
                            </motion.button>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm">-</div>
                        )}
                      </div>

                      {/* Team 2 Odds */}
                      <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-1">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                          >
                            {match.odds.team2.back.toFixed(2)}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 px-2 py-1 text-sm rounded font-medium transition-colors"
                          >
                            {match.odds.team2.lay.toFixed(2)}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filteredMatches.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search query to find matches.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Features Section */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Real-Time Updates</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Get instant odds updates and live scores through our WebSocket connection.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Best Odds</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Access the most competitive odds across all major sports and leagues.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Multi Markets</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Explore hundreds of betting markets for every match and tournament.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}