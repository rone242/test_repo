'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Live betting section component with real-time match updates
 * Features live odds, match statistics, and betting interface
 */
export default function LiveBetting() {
  const [selectedMatch, setSelectedMatch] = useState(0)
  const [liveOdds, setLiveOdds] = useState<{ [key: string]: number }>({})

  const liveMatches = [
    {
      id: 1,
      sport: 'Cricket',
      teams: { home: 'Bangladesh', away: 'India' },
      score: { home: '245/6', away: '198/4' },
      time: '32.4 overs',
      status: 'Live',
      odds: { home: 2.45, away: 1.65, draw: 3.20 }
    },
    {
      id: 2,
      sport: 'Football',
      teams: { home: 'Manchester City', away: 'Liverpool' },
      score: { home: '2', away: '1' },
      time: "78'",
      status: 'Live',
      odds: { home: 1.85, away: 4.20, draw: 3.40 }
    },
    {
      id: 3,
      sport: 'Basketball',
      teams: { home: 'Lakers', away: 'Warriors' },
      score: { home: '89', away: '92' },
      time: 'Q3 8:45',
      status: 'Live',
      odds: { home: 2.10, away: 1.75, draw: null }
    }
  ]

  const popularMarkets = [
    { name: 'Match Winner', count: 3 },
    { name: 'Total Goals/Runs', count: 5 },
    { name: 'Next Wicket/Goal', count: 8 },
    { name: 'Player Performance', count: 12 }
  ]

  // Simulate live odds updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOdds(prev => {
        const newOdds = { ...prev }
        liveMatches.forEach(match => {
          const variation = (Math.random() - 0.5) * 0.1
          newOdds[`${match.id}_home`] = Math.max(1.01, (match.odds.home + variation))
          newOdds[`${match.id}_away`] = Math.max(1.01, (match.odds.away + variation))
          if (match.odds.draw) {
            newOdds[`${match.id}_draw`] = Math.max(1.01, (match.odds.draw + variation))
          }
        })
        return newOdds
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getOdds = (matchId: number, type: string, originalOdds: number) => {
    const key = `${matchId}_${type}`
    return liveOdds[key] ? liveOdds[key].toFixed(2) : originalOdds.toFixed(2)
  }

  const getOddsChange = (matchId: number, type: string, originalOdds: number) => {
    const key = `${matchId}_${type}`
    const currentOdds = liveOdds[key] || originalOdds
    return currentOdds > originalOdds ? 'up' : currentOdds < originalOdds ? 'down' : 'same'
  }

  return (
    <section className="py-20 bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Live</span> Betting
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Experience the thrill of live betting with real-time odds updates. <mcreference link="https://baji-bd.com/" index="1">1</mcreference>
            Place bets as the action unfolds and maximize your winning potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Matches */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-secondary-800 rounded-2xl border border-secondary-700 overflow-hidden"
            >
              <div className="p-6 border-b border-secondary-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Live Matches</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-secondary-300">Live Updates</span>
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                {liveMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`p-6 border-b border-secondary-700 last:border-b-0 cursor-pointer transition-colors ${
                      selectedMatch === index ? 'bg-secondary-700' : 'hover:bg-secondary-750'
                    }`}
                    onClick={() => setSelectedMatch(index)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                          {match.sport}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-secondary-400" />
                          <span className="text-sm text-secondary-300">{match.time}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                        {match.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teams.home}</div>
                        <div className="text-2xl font-bold text-primary-400">{match.score.home}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-secondary-400 text-sm">VS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{match.teams.away}</div>
                        <div className="text-2xl font-bold text-primary-400">{match.score.away}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-secondary-600 hover:bg-primary-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                        <div className="flex items-center justify-between">
                          <span>{match.teams.home}</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold">{getOdds(match.id, 'home', match.odds.home)}</span>
                            {getOddsChange(match.id, 'home', match.odds.home) === 'up' && (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            )}
                            {getOddsChange(match.id, 'home', match.odds.home) === 'down' && (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {match.odds.draw && (
                        <button className="bg-secondary-600 hover:bg-primary-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                          <div className="flex items-center justify-between">
                            <span>Draw</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-bold">{getOdds(match.id, 'draw', match.odds.draw)}</span>
                              {getOddsChange(match.id, 'draw', match.odds.draw) === 'up' && (
                                <TrendingUp className="w-3 h-3 text-green-400" />
                              )}
                              {getOddsChange(match.id, 'draw', match.odds.draw) === 'down' && (
                                <TrendingDown className="w-3 h-3 text-red-400" />
                              )}
                            </div>
                          </div>
                        </button>
                      )}
                      
                      <button className="bg-secondary-600 hover:bg-primary-600 text-white py-2 px-3 rounded-lg transition-colors text-sm">
                        <div className="flex items-center justify-between">
                          <span>{match.teams.away}</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-bold">{getOdds(match.id, 'away', match.odds.away)}</span>
                            {getOddsChange(match.id, 'away', match.odds.away) === 'up' && (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            )}
                            {getOddsChange(match.id, 'away', match.odds.away) === 'down' && (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Betting Markets */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-secondary-800 rounded-2xl border border-secondary-700 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Popular Markets</h3>
              <div className="space-y-3">
                {popularMarkets.map((market, index) => (
                  <div key={market.name} className="flex items-center justify-between p-3 bg-secondary-700 rounded-lg hover:bg-secondary-600 transition-colors cursor-pointer">
                    <span className="text-white">{market.name}</span>
                    <span className="text-sm bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                      {market.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Live Betting Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Real-time odds updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Cash out anytime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Live match statistics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span>Multiple betting options</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full mt-4">
                Start Live Betting
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}