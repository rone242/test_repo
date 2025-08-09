'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Settings, Wallet } from 'lucide-react'
import Button from '@/components/ui/Button'
import AuthModal from '@/components/auth/AuthModal'

/**
 * Header component with navigation, authentication, and mobile menu
 * Features responsive design and user account management
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { data: session, status } = useSession()

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const navItems = [
    { name: 'Sports', href: '/sports' },
    { name: 'Live Betting', href: '/live' },
    { name: 'Casino', href: '/casino' },
    { name: 'Promotions', href: '/promotions' },
    { name: 'Results', href: '/results' },
  ]

  return (
    <>
      <header className="bg-secondary-900/95 backdrop-blur-md border-b border-secondary-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl">PASA Live</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-white hover:text-primary-400 transition-colors">
                Home
              </a>
              <a href="/dashboard" className="text-white hover:text-primary-400 transition-colors">
                Dashboard
              </a>
              <a href="/sports" className="text-white hover:text-primary-400 transition-colors">
                Sports
              </a>
              <a href="/live-matches" className="text-white hover:text-primary-400 transition-colors">
                Live
              </a>
              <a href="/casino" className="text-white hover:text-primary-400 transition-colors">
                Casino
              </a>
              <a href="/promotions" className="text-white hover:text-primary-400 transition-colors">
                Promotions
              </a>
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-secondary-700 rounded-full animate-pulse" />
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">৳15,420.50</span>
                  </div>
                  
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        RA
                      </div>
                      <span className="hidden md:inline">Razzak</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-secondary-800 border border-secondary-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <a href="/profile" className="flex items-center px-4 py-2 text-secondary-300 hover:text-white hover:bg-secondary-700 transition-colors">
                          <User className="w-4 h-4 mr-3" />
                          My Profile
                        </a>
                        <a href="/dashboard" className="flex items-center px-4 py-2 text-secondary-300 hover:text-white hover:bg-secondary-700 transition-colors">
                          <Settings className="w-4 h-4 mr-3" />
                          Dashboard
                        </a>
                        <div className="border-t border-secondary-700 my-2"></div>
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-secondary-300 hover:text-white hover:bg-secondary-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAuthClick('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-primary-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-secondary-800 border-t border-secondary-700">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-secondary-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-secondary-700">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4" />
                      <span>{session.user?.name || 'User'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Wallet className="w-4 h-4" />
                      <span>৳0.00</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAuthClick('login')}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAuthClick('register')}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}