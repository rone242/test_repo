'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, Award, Clock } from 'lucide-react'
import Link from 'next/link'

/**
 * Footer component with comprehensive site information and links
 * Features company info, quick links, payment methods, and social media
 */
export default function Footer() {
  const quickLinks = [
    { name: 'Sports Betting', href: '/sports' },
    { name: 'Live Betting', href: '/live' },
    { name: 'Casino Games', href: '/casino' },
    { name: 'Promotions', href: '/promotions' },
    { name: 'Results', href: '/results' },
    { name: 'Help Center', href: '/help' }
  ]

  const sportsLinks = [
    { name: 'Cricket', href: '/sports/cricket' },
    { name: 'Football', href: '/sports/football' },
    { name: 'Basketball', href: '/sports/basketball' },
    { name: 'Tennis', href: '/sports/tennis' },
    { name: 'Kabaddi', href: '/sports/kabaddi' },
    { name: 'Esports', href: '/sports/esports' }
  ]

  const casinoLinks = [
    { name: 'Live Blackjack', href: '/casino/blackjack' },
    { name: 'Live Roulette', href: '/casino/roulette' },
    { name: 'Slots', href: '/casino/slots' },
    { name: 'Baccarat', href: '/casino/baccarat' },
    { name: 'Andar Bahar', href: '/casino/andar-bahar' },
    { name: 'Teen Patti', href: '/casino/teen-patti' }
  ]

  const supportLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Responsible Gaming', href: '/responsible-gaming' },
    { name: 'Payment Methods', href: '/payments' }
  ]

  const paymentMethods = [
    'bKash', 'Rocket', 'Nagad', 'Bank Transfer', 'Visa', 'Mastercard', 'Bitcoin', 'USDT'
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-400' }
  ]

  return (
    <footer className="bg-secondary-900 border-t border-secondary-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">PASA</h3>
              <p className="text-secondary-300 mb-6">
                Bangladesh's premier online betting platform offering sports betting, 
                live casino games, and exciting promotions with secure payments and 24/7 support.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-secondary-300">
                <Mail className="w-5 h-5 text-primary-400" />
                <span>support@pasa.live</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-300">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-300">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`p-2 bg-secondary-800 rounded-lg text-secondary-400 transition-colors ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Sports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Sports</h4>
            <ul className="space-y-3">
              {sportsLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Casino */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Casino</h4>
            <ul className="space-y-3">
              {casinoLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-secondary-800"
        >
          <h4 className="text-lg font-semibold text-white mb-6 text-center">Payment Methods</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="bg-secondary-800 px-4 py-2 rounded-lg text-secondary-300 text-sm"
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-secondary-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-400 mb-3" />
              <h5 className="text-white font-semibold mb-2">Secure & Licensed</h5>
              <p className="text-secondary-300 text-sm">
                Licensed by Curacao Gaming Authority
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-yellow-400 mb-3" />
              <h5 className="text-white font-semibold mb-2">Award Winning</h5>
              <p className="text-secondary-300 text-sm">
                Best Online Betting Platform 2024
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-blue-400 mb-3" />
              <h5 className="text-white font-semibold mb-2">24/7 Support</h5>
              <p className="text-secondary-300 text-sm">
                Round-the-clock customer assistance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-secondary-800"
        >
          <div className="flex flex-wrap justify-center gap-6">
            {supportLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-secondary-950 border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary-400 text-sm mb-4 md:mb-0">
              © 2024 PASA. All rights reserved. | 18+ Only | Gamble Responsibly
            </div>
            <div className="text-secondary-400 text-sm">
              Powered by BJ Group | Version 2.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}