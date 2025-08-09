'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Zap, 
  Crown, 
  Gift, 
  Sparkles,
  Play,
  Heart,
  TrendingUp,
  Clock,
  DollarSign,
  Gamepad2
} from 'lucide-react'
import Button from '@/components/ui/Button'

// TypeScript interfaces for casino data
interface CasinoGame {
  id: string
  name: string
  image: string
  category: string
  provider: string
  players: number
  rating: number
  jackpot?: string
  isLive: boolean
  isFavorite: boolean
  minBet: string
  maxBet: string
  rtp: string
  gradient: string
}

interface GameCategory {
  id: string
  name: string
  icon: any
  count: number
  isActive: boolean
}

/**
 * Comprehensive casino page component with live games, slots, and table games
 * Features real-time data, filtering, search, and interactive gaming interface
 */
export default function CasinoPage() {
  // State management for casino interface
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'jackpot'>('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [games, setGames] = useState<CasinoGame[]>([])
  const [loading, setLoading] = useState(true)

  // Casino game categories
  const categories: GameCategory[] = [
    { id: 'all', name: 'All Games', icon: Gamepad2, count: 0, isActive: selectedCategory === 'all' },
    { id: 'live', name: 'Live Casino', icon: Users, count: 0, isActive: selectedCategory === 'live' },
    { id: 'slots', name: 'Slots', icon: Sparkles, count: 0, isActive: selectedCategory === 'slots' },
    { id: 'table', name: 'Table Games', icon: Crown, count: 0, isActive: selectedCategory === 'table' },
    { id: 'indian', name: 'Indian Games', icon: Star, count: 0, isActive: selectedCategory === 'indian' },
    { id: 'jackpot', name: 'Jackpots', icon: DollarSign, count: 0, isActive: selectedCategory === 'jackpot' }
  ]

  // Mock casino games data
  const mockGames: CasinoGame[] = [
    {
      id: '1',
      name: 'Live Blackjack VIP',
      image: '🃏',
      category: 'live',
      provider: 'Evolution Gaming',
      players: 2847,
      rating: 4.8,
      isLive: true,
      isFavorite: false,
      minBet: '₹100',
      maxBet: '₹50,000',
      rtp: '99.28%',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: '2',
      name: 'Mega Fortune Dreams',
      image: '🎰',
      category: 'slots',
      provider: 'NetEnt',
      players: 5234,
      rating: 4.6,
      jackpot: '₹2,45,67,890',
      isLive: false,
      isFavorite: true,
      minBet: '₹10',
      maxBet: '₹5,000',
      rtp: '96.4%',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: '3',
      name: 'Lightning Roulette',
      image: '⚡',
      category: 'live',
      provider: 'Evolution Gaming',
      players: 3891,
      rating: 4.9,
      isLive: true,
      isFavorite: false,
      minBet: '₹50',
      maxBet: '₹25,000',
      rtp: '97.3%',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: '4',
      name: 'Teen Patti Gold',
      image: '🎴',
      category: 'indian',
      provider: 'Ezugi',
      players: 6789,
      rating: 4.7,
      isLive: true,
      isFavorite: false,
      minBet: '₹25',
      maxBet: '₹10,000',
      rtp: '98.1%',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: '5',
      name: 'Andar Bahar Live',
      image: '♠️',
      category: 'indian',
      provider: 'Evolution Gaming',
      players: 4567,
      rating: 4.5,
      isLive: true,
      isFavorite: true,
      minBet: '₹20',
      maxBet: '₹15,000',
      rtp: '97.85%',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: '6',
      name: 'Starburst',
      image: '⭐',
      category: 'slots',
      provider: 'NetEnt',
      players: 3456,
      rating: 4.4,
      isLive: false,
      isFavorite: false,
      minBet: '₹5',
      maxBet: '₹2,500',
      rtp: '96.09%',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: '7',
      name: 'Baccarat Squeeze',
      image: '🎯',
      category: 'table',
      provider: 'Evolution Gaming',
      players: 2134,
      rating: 4.6,
      isLive: true,
      isFavorite: false,
      minBet: '₹100',
      maxBet: '₹100,000',
      rtp: '98.94%',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: '8',
      name: 'Book of Dead',
      image: '📚',
      category: 'slots',
      provider: 'Play\'n GO',
      players: 4321,
      rating: 4.3,
      isLive: false,
      isFavorite: true,
      minBet: '₹10',
      maxBet: '₹2,500',
      rtp: '94.25%',
      gradient: 'from-amber-500 to-yellow-600'
    }
  ]

  // Progressive jackpots data
  const jackpots = [
    { name: 'Mega Fortune', amount: '₹2,45,67,890', increment: '+₹1,234' },
    { name: 'Divine Fortune', amount: '₹1,89,34,567', increment: '+₹987' },
    { name: 'Hall of Gods', amount: '₹98,76,543', increment: '+₹456' },
    { name: 'Arabian Nights', amount: '₹76,54,321', increment: '+₹321' }
  ]

  // Initialize games data
  useEffect(() => {
    const timer = setTimeout(() => {
      setGames(mockGames)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Update category counts
  useEffect(() => {
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = games.length
      } else {
        category.count = games.filter(game => game.category === category.id).length
      }
    })
  }, [games])

  // Filter and sort games
  const filteredGames = games
    .filter(game => {
      if (selectedCategory !== 'all' && game.category !== selectedCategory) return false
      if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.players - a.players
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return a.name.localeCompare(b.name)
        case 'jackpot':
          return (b.jackpot ? 1 : 0) - (a.jackpot ? 1 : 0)
        default:
          return 0
      }
    })

  // Toggle favorite game
  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    )
    
    setGames(prev => prev.map(game => 
      game.id === gameId 
        ? { ...game, isFavorite: !game.isFavorite }
        : game
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Live <span className="text-yellow-400">Casino</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Experience the thrill of real casino games with professional dealers streaming live 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Button>
              <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-black">
                <Gift className="w-5 h-5 mr-2" />
                Claim Bonus
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progressive Jackpots Ticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 py-4 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-white">
            <span className="text-lg font-bold">🎰 PROGRESSIVE JACKPOTS 🎰</span>
            {jackpots.map((jackpot, index) => (
              <div key={jackpot.name} className="flex items-center space-x-2">
                <span className="font-semibold">{jackpot.name}:</span>
                <span className="text-xl font-bold">{jackpot.amount}</span>
                <span className="text-sm text-green-200">{jackpot.increment}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation and Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700">
              <h3 className="text-xl font-bold text-white mb-6">Game Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      category.isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm bg-secondary-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-secondary-700">
                <h4 className="text-lg font-semibold text-white mb-4">Live Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-300">Players Online</span>
                    <span className="text-green-400 font-bold">24,567</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-300">Games Available</span>
                    <span className="text-blue-400 font-bold">{games.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-300">Total Jackpot</span>
                    <span className="text-yellow-400 font-bold">₹5.2Cr</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="jackpot">Jackpot Games</option>
                  </select>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-3"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-secondary-700"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Provider
                        </label>
                        <select className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white">
                          <option>All Providers</option>
                          <option>Evolution Gaming</option>
                          <option>NetEnt</option>
                          <option>Ezugi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Min Bet
                        </label>
                        <select className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white">
                          <option>Any Amount</option>
                          <option>₹5 - ₹50</option>
                          <option>₹50 - ₹500</option>
                          <option>₹500+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Features
                        </label>
                        <select className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white">
                          <option>All Features</option>
                          <option>Live Dealers</option>
                          <option>Progressive Jackpot</option>
                          <option>Mobile Optimized</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 animate-pulse">
                      <div className="h-48 bg-secondary-700 rounded-xl mb-4" />
                      <div className="h-4 bg-secondary-700 rounded mb-2" />
                      <div className="h-3 bg-secondary-700 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="bg-secondary-800 rounded-2xl overflow-hidden border border-secondary-700 hover:border-primary-500 transition-all duration-300 card-hover">
                          {/* Game Image/Icon */}
                          <div className={`h-48 bg-gradient-to-br ${game.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                              {game.image}
                            </span>
                            
                            {/* Overlay Info */}
                            <div className="absolute top-4 left-4 flex items-center space-x-2">
                              {game.isLive && (
                                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                                  LIVE
                                </div>
                              )}
                              {game.jackpot && (
                                <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                  JACKPOT
                                </div>
                              )}
                            </div>

                            <div className="absolute top-4 right-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(game.id)
                                }}
                                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                  game.isFavorite 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-black/50 text-white hover:bg-red-500'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${game.isFavorite ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-white text-sm font-medium flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {game.players.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Game Info */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                                {game.name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-secondary-300">{game.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-secondary-400">{game.provider}</span>
                              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                                {game.category.toUpperCase()}
                              </span>
                            </div>

                            {game.jackpot && (
                              <div className="mb-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <div className="text-xs text-yellow-400 font-medium">Progressive Jackpot</div>
                                <div className="text-lg font-bold text-yellow-400">{game.jackpot}</div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                              <div>
                                <span className="text-secondary-400">Min Bet:</span>
                                <span className="text-white ml-1 font-medium">{game.minBet}</span>
                              </div>
                              <div>
                                <span className="text-secondary-400">RTP:</span>
                                <span className="text-green-400 ml-1 font-medium">{game.rtp}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {game.isLive && (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm text-secondary-300">Live Now</span>
                                  </>
                                )}
                              </div>
                              <Button size="sm" className="min-w-[80px]">
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* No Results */}
              {!loading && filteredGames.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🎰</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
                  <p className="text-secondary-400 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}