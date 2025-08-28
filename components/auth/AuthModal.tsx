'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import axios from 'axios'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

/**
 * Authentication modal component with login and registration forms
 * Features form validation, password visibility toggle, and error handling
 */
export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>()
  const registerForm = useForm<RegisterFormData>()

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/login', data)
      
      if (response.data.token) {
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.data.token)
        
        // Sign in with NextAuth
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (result?.ok) {
          toast.success('Login successful!')
          onClose()
          window.location.href = '/dashboard' // Redirect to dashboard
        } else {
          toast.error('Login failed. Please try again.')
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        toast.success('Registration successful!')
        
        // Auto login after registration
        const loginResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })

        if (loginResult?.ok) {
          onClose()
          window.location.href = '/dashboard' // Redirect to dashboard
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-md border border-secondary-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-700">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="email"
                    {...loginForm.register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="w-full pl-10 pr-12 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    {...registerForm.register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="email"
                    {...registerForm.register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="tel"
                    {...registerForm.register('phone')}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+880 1234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="w-full pl-10 pr-12 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword', { 
                      required: 'Please confirm your password'
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                Create Account
              </Button>
            </form>
          )}

          {/* OAuth Providers */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-secondary-800 text-secondary-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google OAuth */}
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-3 px-4 border border-secondary-600 rounded-lg shadow-sm bg-secondary-700 text-sm font-medium text-white hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              {/* Telegram OAuth */}
              <button
                type="button"
                onClick={() => {
                  // Telegram Web App authentication will be handled separately
                  toast.info('Telegram authentication coming soon!')
                }}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-3 px-4 border border-secondary-600 rounded-lg shadow-sm bg-secondary-700 text-sm font-medium text-white hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 8.368-1.268 8.368-.16.708-.534.708-.534.708s-1.924-.64-2.746-1.12c-.534-.32-2.746-1.76-3.76-2.56-.16-.16-.32-.48-.16-.8.32-.64 2.746-2.56 5.334-5.12.534-.48.374-.8-.16-.48-3.76 2.4-8.8 5.28-9.6 5.76-.8.48-1.6.16-1.6.16s-1.76-.64-1.76-1.28c0-.64.96-1.12.96-1.12s10.24-4.16 11.36-4.64c1.12-.48 1.6.16 1.6.16z"/>
                </svg>
                <span className="ml-2">Telegram</span>
              </button>
            </div>
          </div>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-secondary-400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-primary-400 hover:text-primary-300 font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}