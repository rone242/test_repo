'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Clock, Users, Star, ArrowRight, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Promotions section component displaying current offers and bonuses
 * Features promotional cards, countdown timers, and call-to-action buttons
 */
export default function Promotions() {
  const [activeTab, setActiveTab] = useState('all')

  const promotions = [
    {
      id: 1,
      title: 'Welcome Bonus',
      description: 'Get 100% bonus up to ৳10,000 on your first deposit',
      image: '/api/placeholder/400/250',
      category: 'new',
      bonus: '100%',
      maxAmount: '৳10,000',
      validUntil: '2024-12-31',
      terms: 'Min deposit ৳500. Wagering requirement 35x.',
      featured: true,
      color: 'from-primary-600 to-accent-600'
    },
    {
      id: 2,
      title: 'Cricket World Cup Special',
      description: 'Enhanced odds on all Cricket World Cup matches',
      image: '/api/placeholder/400/250',
      category: 'sports',
      bonus: '50%',
      maxAmount: '৳5,000',
      validUntil: '2024-11-30',
      terms: 'Available for pre-match and live betting.',
      featured: true,
      color: 'from-green-600 to-blue-600'
    },
    {
      id: 3,
      title: 'Casino Cashback',
      description: 'Get 20% cashback on your casino losses every week',
      image: '/api/placeholder/400/250',
      category: 'casino',
      bonus: '20%',
      maxAmount: '৳2,000',
      validUntil: 'Weekly',
      terms: 'Minimum loss ৳1,000. Cashback credited every Monday.',
      featured: false,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 4,
      title: 'Refer a Friend',
      description: 'Earn ৳500 for every friend you refer who makes a deposit',
      image: '/api/placeholder/400/250',
      category: 'referral',
      bonus: '৳500',
      maxAmount: 'Unlimited',
      validUntil: 'Ongoing',
      terms: 'Friend must deposit minimum ৳1,000.',
      featured: false,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 5,
      title: 'VIP Reload Bonus',
      description: 'Exclusive 25% reload bonus for VIP members',
      image: '/api/placeholder/400/250',
      category: 'vip',
      bonus: '25%',
      maxAmount: '৳15,000',
      validUntil: '2024-12-15',
      terms: 'VIP status required. Available once per week.',
      featured: false,
      color: 'from-yellow-600 to-orange-600'
    },
    {
      id: 6,
      title: 'Live Dealer Bonus',
      description: 'Special bonus for live dealer games every weekend',
      image: '/api/placeholder/400/250',
      category: 'casino',
      bonus: '30%',
      maxAmount: '৳3,000',
      validUntil: 'Weekends',
      terms: 'Valid on live blackjack, roulette, and baccarat.',
      featured: false,
      color: 'from-teal-600 to-cyan-600'
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Offers', count: promotions.length },
    { id: 'new', label: 'New Player', count: promotions.filter(p => p.category === 'new').length },
    { id: 'sports', label: 'Sports', count: promotions.filter(p => p.category === 'sports').length },
    { id: 'casino', label: 'Casino', count: promotions.filter(p => p.category === 'casino').length },
    { id: 'vip', label: 'VIP', count: promotions.filter(p => p.category === 'vip').length }
  ]

  const filteredPromotions = activeTab === 'all' 
    ? promotions 
    : promotions.filter(p => p.category === activeTab)

  const featuredPromotions = promotions.filter(p => p.featured)

  const calculateDaysLeft = (validUntil: string) => {
    if (validUntil === 'Ongoing' || validUntil === 'Weekly' || validUntil === 'Weekends') {
      return validUntil
    }
    const endDate = new Date(validUntil)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} days left` : 'Expired'
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
            <span className="gradient-text">Exclusive</span> Promotions
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Boost your betting experience with our amazing bonuses and promotions. <mcreference link="https://baji-bd.com/" index="1">1</mcreference>
            From welcome bonuses to VIP rewards, we have something for everyone.
          </p>
        </motion.div>

        {/* Featured Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            Featured Offers
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPromotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-gradient-to-r ${promo.color} rounded-2xl p-8 text-white overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold mb-2">{promo.title}</h4>
                      <p className="text-white/90 mb-4">{promo.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{promo.bonus}</div>
                      <div className="text-sm opacity-90">Up to {promo.maxAmount}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateDaysLeft(promo.validUntil)}</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Claim Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promotion Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPromotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-secondary-800 rounded-2xl border border-secondary-700 overflow-hidden group hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="relative h-48 bg-gradient-to-r from-secondary-700 to-secondary-600">
                <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-80`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift className="w-16 h-16 text-white/80" />
                </div>
                {promo.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {promo.bonus}
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">{promo.title}</h4>
                <p className="text-secondary-300 mb-4 text-sm">{promo.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">Max Amount:</span>
                    <span className="text-white font-semibold">{promo.maxAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">Valid Until:</span>
                    <span className="text-white">{calculateDaysLeft(promo.validUntil)}</span>
                  </div>
                </div>

                <div className="bg-secondary-700 rounded-lg p-3 mb-4">
                  <p className="text-xs text-secondary-300">{promo.terms}</p>
                </div>

                <Button variant="primary" className="w-full group-hover:bg-primary-500">
                  Claim Bonus
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Promotion Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-secondary-800 rounded-2xl border border-secondary-700 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">৳50M+</div>
              <div className="text-secondary-300">Total Bonuses Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">15+</div>
              <div className="text-secondary-300">Active Promotions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">100K+</div>
              <div className="text-secondary-300">Happy Winners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-secondary-300">Bonus Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}