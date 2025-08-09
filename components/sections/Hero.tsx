'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Star, Users, Trophy, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * Hero section component with animated statistics and call-to-action
 * Features dynamic content and engaging visuals
 */
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: 'Experience the Thrill of Live Sports Betting',
      subtitle: 'Join millions of users betting on cricket, football, and more',
      image: '/hero-sports.jpg',
      cta: 'Start Betting Now',
      link: '/betting/sports'
    },
    {
      title: 'Premium Casino Games & Live Dealers',
      subtitle: 'Play with professional dealers in real-time',
      image: '/hero-casino.jpg',
      cta: 'Play Casino'
    },
    {
      title: 'Exclusive Bonuses & Promotions',
      subtitle: 'Get up to ৳15,000 welcome bonus',
      image: '/hero-bonus.jpg',
      cta: 'Claim Bonus'
    }
  ]

  const stats = [
    { icon: Users, value: '1M+', label: 'Active Users' },
    { icon: Trophy, value: '100K+', label: 'Daily Events' },
    { icon: Star, value: '4.8', label: 'User Rating' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="gradient-text">PASA Live</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-secondary-200">
              {slides[currentSlide].title}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary-300 mb-8 max-w-3xl mx-auto">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="xl" className="min-w-[200px]">
              {slides[currentSlide].cta}
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="min-w-[200px]"
              onClick={() => window.location.href = '/live-matches'}
            >
              <Play className="w-5 h-5 mr-2" />
              Live Matches
            </Button>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="glass-effect rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-secondary-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-secondary-600 hover:bg-secondary-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-secondary-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}