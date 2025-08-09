'use client'

import { motion } from 'framer-motion'
import { Trophy, Clock, TrendingUp, Users } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Sports section component displaying available sports and betting options
 * Features animated cards and live statistics
 */
export default function SportsSection() {
  const sports = [
    {
      name: 'Cricket',
      icon: '🏏',
      description: 'IPL, BPL, World Cup & more',
      liveEvents: 45,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Football',
      icon: '⚽',
      description: 'Premier League, La Liga, Champions League',
      liveEvents: 32,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      description: 'NBA, EuroLeague, NCAA',
      liveEvents: 18,
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Tennis',
      icon: '🎾',
      description: 'Grand Slams, ATP, WTA',
      liveEvents: 24,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Kabaddi',
      icon: '🤼',
      description: 'Pro Kabaddi League, Asian Games',
      liveEvents: 8,
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Esports',
      icon: '🎮',
      description: 'Dota 2, CS:GO, Valorant',
      liveEvents: 15,
      color: 'from-indigo-500 to-purple-600'
    }
  ]

  const features = [
    {
      icon: Clock,
      title: 'Live Betting',
      description: 'Bet on live matches with real-time odds'
    },
    {
      icon: TrendingUp,
      title: 'Best Odds',
      description: 'Competitive odds across all sports'
    },
    {
      icon: Users,
      title: 'Expert Tips',
      description: 'Get insights from betting professionals'
    },
    {
      icon: Trophy,
      title: 'Big Wins',
      description: 'Join winners with massive payouts'
    }
  ]

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
            Sports <span className="gradient-text">Betting</span>
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Bet on your favorite sports with the best odds and live betting experience. <mcreference link="https://baji-bd.com/" index="1">1</mcreference>
            Over 100,000 events available daily across multiple sports.
          </p>
        </motion.div>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 hover:border-primary-500 transition-all duration-300 card-hover">
                <div className={`w-16 h-16 bg-gradient-to-r ${sport.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {sport.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{sport.name}</h3>
                <p className="text-secondary-400 mb-4">{sport.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-secondary-300">
                      {sport.liveEvents} Live Events
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Markets
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-secondary-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="xl" className="min-w-[250px]">
            Start Betting Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}