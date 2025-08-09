'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Crown, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Casino section component displaying casino games and features
 * Includes live casino, slots, and table games
 */
export default function CasinoSection() {
  const games = [
    {
      name: 'Live Blackjack',
      image: '🃏',
      players: '2.4k',
      category: 'Table Games',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      name: 'Mega Slots',
      image: '🎰',
      players: '5.8k',
      category: 'Slots',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Live Roulette',
      image: '🎲',
      players: '3.2k',
      category: 'Table Games',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Baccarat',
      image: '♠️',
      players: '1.9k',
      category: 'Table Games',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Andar Bahar',
      image: '🎴',
      players: '4.1k',
      category: 'Indian Games',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Teen Patti',
      image: '🃖',
      players: '6.3k',
      category: 'Indian Games',
      gradient: 'from-pink-500 to-rose-600'
    }
  ]

  const features = [
    {
      icon: Crown,
      title: 'VIP Experience',
      description: 'Exclusive tables for high rollers'
    },
    {
      icon: Zap,
      title: 'Instant Play',
      description: 'No download required, play instantly'
    },
    {
      icon: Sparkles,
      title: 'Live Dealers',
      description: 'Real dealers streaming 24/7'
    },
    {
      icon: Gift,
      title: 'Daily Bonuses',
      description: 'Free spins and cashback offers'
    }
  ]

  const jackpots = [
    { name: 'Mega Fortune', amount: '৳2,45,67,890' },
    { name: 'Divine Fortune', amount: '৳1,89,34,567' },
    { name: 'Hall of Gods', amount: '৳98,76,543' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-secondary-800 to-secondary-900">
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
            Live <span className="gradient-text">Casino</span>
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Experience the thrill of a real casino from home. <mcreference link="https://bajilive.app/" index="5">5</mcreference>
            Play with professional dealers and win big with our progressive jackpots.
          </p>
        </motion.div>

        {/* Jackpot Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-16 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              🎰 Progressive Jackpots 🎰
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jackpots.map((jackpot, index) => (
                <div key={jackpot.name} className="text-center">
                  <div className="text-lg font-semibold text-white/90">{jackpot.name}</div>
                  <div className="text-2xl font-bold text-white">{jackpot.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {games.map((game, index) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-secondary-800 rounded-2xl overflow-hidden border border-secondary-700 hover:border-primary-500 transition-all duration-300 card-hover">
                <div className={`h-48 bg-gradient-to-br ${game.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {game.image}
                  </span>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{game.players} playing</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{game.name}</h3>
                    <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                      {game.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-secondary-300">Live Now</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Play Now
                    </Button>
                  </div>
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
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <div className="bg-secondary-800 rounded-2xl p-8 border border-secondary-700">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Win Big?
            </h3>
            <p className="text-secondary-300 mb-6">
              Join thousands of players and start your casino journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="min-w-[200px]">
                Play Casino
              </Button>
              <Button variant="outline" size="xl" className="min-w-[200px]">
                View All Games
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}