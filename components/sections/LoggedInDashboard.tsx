'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  Wallet, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Star, 
  Play, 
  Eye,
  Calendar,
  Target,
  Gift,
  Bell,
  Settings
} from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Logged-in user dashboard component with personalized content
 * Features account balance, recent bets, quick actions, and personalized recommendations
 */
export default function LoggedInDashboard() {
  const { data: session } = useSession()
  const [balance, setBalance] = useState(15420.50)
  const [recentBets, setRecentBets] = useState([
    {
      id: 1,
      match: 'Bangladesh vs India',
      sport: 'Cricket',
      bet: 'Bangladesh to Win',
      amount: 500,
      odds: 2.45,
      status: 'pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      match: 'Manchester United vs Arsenal',
      sport: 'Football',
      bet: 'Over 2.5 Goals',
      amount: 1000,
      odds: 1.85,
      status: 'won',
      time: '1 day ago'
    },
    {
      id: 3,
      match: 'Blackjack Table 5',
      sport: 'Casino',
      bet: 'Hand #1247',
      amount: 250,
      odds: 1.0,
      status: 'lost',
      time: '2 days ago'
    }
  ])

  const quickActions = [
    { icon: Play, label: 'Live Matches', href: '/live-matches', color: 'bg-red-500' },
    { icon: Trophy, label: 'Sports Betting', href: '/sports', color: 'bg-green-500' },
    { icon: Star, label: 'Casino Games', href: '/casino', color: 'bg-purple-500' },
    { icon: Gift, label: 'Promotions', href: '/promotions', color: 'bg-yellow-500' }
  ]

  const liveMatches = [
    {
      id: 1,
      team1: { name: 'Bangladesh', logo: '🇧🇩' },
      team2: { name: 'Sri Lanka', logo: '🇱🇰' },
      sport: 'Cricket',
      score: '145/4 (32.2)',
      status: 'Live',
      odds: { home: 1.85, away: 2.10 }
    },
    {
      id: 2,
      team1: { name: 'Real Madrid', logo: '⚪' },
      team2: { name: 'Barcelona', logo: '🔵' },
      sport: 'Football',
      score: '1-1 (67\')',
      status: 'Live',
      odds: { home: 2.20, away: 1.95 }
    }
  ]

  /**
   * Handle quick bet placement
   */
  const handleQuickBet = (matchId: number, betType: string, odds: number) => {
    // Quick bet functionality
    console.log(`Quick bet placed: Match ${matchId}, ${betType}, odds ${odds}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Welcome Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {session?.user?.name || 'Player'}! 👋
            </h1>
            <p className="text-secondary-300 text-lg">
              Ready to place your next winning bet?
            </p>
          </motion.div>

          {/* Account Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-8 h-8" />
                <span className="text-sm opacity-80">Balance</span>
              </div>
              <div className="text-2xl font-bold">৳{balance.toLocaleString()}</div>
              <div className="text-sm opacity-80">Available</div>
            </div>

            <div className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-sm text-secondary-400">This Week</span>
              </div>
              <div className="text-2xl font-bold text-white">+৳2,450</div>
              <div className="text-sm text-green-400">+15.2% profit</div>
            </div>

            <div className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-sm text-secondary-400">Active Bets</span>
              </div>
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-sm text-secondary-400">₹3,500 total</div>
            </div>

            <div className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-secondary-400">VIP Level</span>
              </div>
              <div className="text-2xl font-bold text-white">Gold</div>
              <div className="text-sm text-purple-400">2,450 XP to Platinum</div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 hover:border-primary-500 transition-all duration-300 text-center group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-medium">{action.label}</div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Matches */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
                    Live Matches
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = '/live-matches'}>
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="bg-secondary-700 rounded-xl p-4 hover:bg-secondary-600 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{match.team1.logo}</span>
                          <div>
                            <div className="text-white font-medium">{match.team1.name} vs {match.team2.name}</div>
                            <div className="text-sm text-secondary-400">{match.sport} • {match.status}</div>
                          </div>
                          <span className="text-2xl">{match.team2.logo}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{match.score}</div>
                          <div className="text-xs text-red-400 flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                            LIVE
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQuickBet(match.id, 'home', match.odds.home)}
                          className="flex-1 bg-secondary-600 hover:bg-primary-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          {match.team1.name} {match.odds.home}
                        </button>
                        <button
                          onClick={() => handleQuickBet(match.id, 'away', match.odds.away)}
                          className="flex-1 bg-secondary-600 hover:bg-primary-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          {match.team2.name} {match.odds.away}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="space-y-8">
              {/* Recent Bets */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700"
              >
                <h3 className="text-xl font-bold text-white mb-6">Recent Bets</h3>
                <div className="space-y-4">
                  {recentBets.map((bet) => (
                    <div key={bet.id} className="border-b border-secondary-700 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium text-sm">{bet.match}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bet.status === 'won' ? 'bg-green-500/20 text-green-400' :
                          bet.status === 'lost' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {bet.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-secondary-400 text-sm mb-1">{bet.bet}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-400">৳{bet.amount} @ {bet.odds}</span>
                        <span className="text-secondary-500">{bet.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" onClick={() => window.location.href = '/bets'}>
                  View All Bets
                </Button>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm">Your bet on Bangladesh vs India is about to start!</div>
                      <div className="text-secondary-400 text-xs">5 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm">Congratulations! You won ৳1,850 on your football bet</div>
                      <div className="text-secondary-400 text-xs">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm">New promotion available: 50% bonus on next deposit</div>
                      <div className="text-secondary-400 text-xs">1 day ago</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}