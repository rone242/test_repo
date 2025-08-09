'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  History, 
  Bell, 
  Eye, 
  EyeOff,
  Edit3,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Wallet,
  Lock,
  Smartphone,
  Globe,
  Save,
  X,
  Plus,
  Minus,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'

/**
 * User profile page component with comprehensive account management
 * Features personal info, security settings, betting history, and preferences
 */
export default function UserProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [walletBalance, setWalletBalance] = useState(15420.50)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bkash')
  const [accountNumber, setAccountNumber] = useState('')
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false)
  
  // User profile data state
  const [profileData, setProfileData] = useState({
    firstName: 'Razzak',
    lastName: 'Ahmed',
    email: 'razzak.ahmed@example.com',
    phone: '+880 1712-345678',
    dateOfBirth: '1990-05-15',
    address: 'Dhaka, Bangladesh',
    avatar: '/api/placeholder/150/150',
    vipLevel: 'Gold',
    totalBets: 1247,
    winRate: 68.5,
    totalWinnings: 125420.50,
    joinDate: '2022-03-15'
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    betLimits: {
      daily: 5000,
      weekly: 25000,
      monthly: 100000
    }
  })

  // Recent transaction history
  const [transactionHistory, setTransactionHistory] = useState([
    {
      id: 1,
      type: 'deposit',
      amount: 2000,
      method: 'bKash',
      status: 'completed',
      date: '2024-01-15 14:30',
      reference: 'TXN123456789'
    },
    {
      id: 2,
      type: 'withdraw',
      amount: 1500,
      method: 'Nagad',
      status: 'pending',
      date: '2024-01-14 16:45',
      reference: 'TXN987654321'
    },
    {
      id: 3,
      type: 'deposit',
      amount: 5000,
      method: 'Rocket',
      status: 'completed',
      date: '2024-01-13 10:20',
      reference: 'TXN456789123'
    },
    {
      id: 4,
      type: 'withdraw',
      amount: 800,
      method: 'bKash',
      status: 'failed',
      date: '2024-01-12 18:15',
      reference: 'TXN789123456'
    }
  ])

  // Payment methods
  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: '📱', color: 'bg-pink-500' },
    { id: 'nagad', name: 'Nagad', icon: '💳', color: 'bg-orange-500' },
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: 'bg-purple-500' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: 'bg-blue-500' }
  ]
  const [bettingHistory, setBettingHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      match: 'Bangladesh vs India',
      sport: 'Cricket',
      bet: 'Bangladesh to Win',
      amount: 1000,
      odds: 2.45,
      result: 'won',
      payout: 2450
    },
    {
      id: 2,
      date: '2024-01-14',
      match: 'Real Madrid vs Barcelona',
      sport: 'Football',
      bet: 'Over 2.5 Goals',
      amount: 500,
      odds: 1.85,
      result: 'lost',
      payout: 0
    },
    {
      id: 3,
      date: '2024-01-13',
      match: 'Blackjack Table 3',
      sport: 'Casino',
      bet: 'Hand #892',
      amount: 250,
      odds: 2.0,
      result: 'won',
      payout: 500
    }
  ])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'history', label: 'Betting History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  /**
   * Handle deposit transaction
   */
  const handleDeposit = async () => {
    if (!depositAmount || !accountNumber) return
    
    setIsProcessingTransaction(true)
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: transactionHistory.length + 1,
        type: 'deposit',
        amount: parseFloat(depositAmount),
        method: paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || '',
        status: 'pending',
        date: new Date().toLocaleString(),
        reference: `TXN${Date.now()}`
      }
      
      setTransactionHistory(prev => [newTransaction, ...prev])
      setWalletBalance(prev => prev + parseFloat(depositAmount))
      setDepositAmount('')
      setAccountNumber('')
      setIsProcessingTransaction(false)
    }, 2000)
  }

  /**
   * Handle withdraw transaction
   */
  const handleWithdraw = async () => {
    if (!withdrawAmount || !accountNumber || parseFloat(withdrawAmount) > walletBalance) return
    
    setIsProcessingTransaction(true)
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: transactionHistory.length + 1,
        type: 'withdraw',
        amount: parseFloat(withdrawAmount),
        method: paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || '',
        status: 'pending',
        date: new Date().toLocaleString(),
        reference: `TXN${Date.now()}`
      }
      
      setTransactionHistory(prev => [newTransaction, ...prev])
      setWalletBalance(prev => prev - parseFloat(withdrawAmount))
      setWithdrawAmount('')
      setAccountNumber('')
      setIsProcessingTransaction(false)
    }, 2000)
  }
  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Handle security settings update
   */
  const handleSecurityUpdate = (field: string, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Save profile changes
   */
  const handleSaveProfile = () => {
    // Save profile data to backend
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  /**
   * Handle avatar upload
   */
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle file upload
      console.log('Uploading avatar:', file)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-8">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-secondary-300 text-lg">Manage your account settings and preferences</p>
        </motion.header>

        {/* Profile Overview Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700 mb-8"
        >
          <article className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <figure className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
            </figure>

            {/* User Info */}
            <section className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-secondary-300 mb-2">{profileData.email}</p>
              <ul className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <li className="flex items-center text-secondary-400">
                  <Trophy className="w-4 h-4 mr-1" />
                  {profileData.vipLevel} Member
                </li>
                <li className="flex items-center text-secondary-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(profileData.joinDate).toLocaleDateString()}
                </li>
              </ul>
            </section>

            {/* Stats */}
            <aside className="grid grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-2xl font-bold text-white block">{profileData.totalBets}</span>
                <span className="text-xs text-secondary-400">Total Bets</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-green-400 block">{profileData.winRate}%</span>
                <span className="text-xs text-secondary-400">Win Rate</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-primary-400 block">৳{profileData.totalWinnings.toLocaleString()}</span>
                <span className="text-xs text-secondary-400">Total Winnings</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-400 block">৳{walletBalance.toLocaleString()}</span>
                <span className="text-xs text-secondary-400">Wallet Balance</span>
              </div>
            </aside>
          </article>
        </motion.section>

        {/* Tab Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-secondary-800 rounded-2xl p-2 border border-secondary-700 mb-8"
        >
          <ul className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-300 hover:text-white hover:bg-secondary-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* Tab Content */}
        <motion.section
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-secondary-800 rounded-2xl p-6 border border-secondary-700"
        >
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <article>
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                <Button
                  variant={isEditing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </header>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>

                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>

                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>

                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>

                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleProfileUpdate('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>

                <fieldset>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleProfileUpdate('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-secondary-700 border border-secondary-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                </fieldset>
              </form>
            </article>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <article>
              <header className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Wallet Management</h3>
                <p className="text-secondary-300">Manage your deposits, withdrawals, and transaction history</p>
              </header>

              {/* Wallet Balance Card */}
              <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-2">Current Balance</h4>
                    <p className="text-3xl font-bold text-white">৳{walletBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                </div>
              </section>

              {/* Deposit & Withdraw Forms */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Deposit Form */}
                <article className="bg-secondary-700 rounded-xl p-6">
                  <header className="flex items-center mb-6">
                    <div className="bg-green-500 rounded-full p-2 mr-3">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">Deposit Money</h4>
                  </header>

                  <form className="space-y-4">
                    {/* Payment Method Selection */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex items-center p-3 rounded-lg border transition-all ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-secondary-600 bg-secondary-600 hover:border-secondary-500'
                            }`}
                          >
                            <span className="text-2xl mr-3">{method.icon}</span>
                            <span className="text-white text-sm font-medium">{method.name}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Amount Input */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Deposit Amount (৳)
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                      <div className="flex gap-2 mt-2">
                        {[500, 1000, 2000, 5000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setDepositAmount(amount.toString())}
                            className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 text-secondary-300 text-sm rounded transition-colors"
                          >
                            ৳{amount}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Account Number */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter your account number"
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </fieldset>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleDeposit}
                      disabled={!depositAmount || !accountNumber || isProcessingTransaction}
                      className="w-full"
                    >
                      {isProcessingTransaction ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-4 h-4 mr-2" />
                          Deposit Money
                        </>
                      )}
                    </Button>
                  </form>
                </article>

                {/* Withdraw Form */}
                <article className="bg-secondary-700 rounded-xl p-6">
                  <header className="flex items-center mb-6">
                    <div className="bg-red-500 rounded-full p-2 mr-3">
                      <Minus className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">Withdraw Money</h4>
                  </header>

                  <form className="space-y-4">
                    {/* Payment Method Selection */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-3">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex items-center p-3 rounded-lg border transition-all ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-secondary-600 bg-secondary-600 hover:border-secondary-500'
                            }`}
                          >
                            <span className="text-2xl mr-3">{method.icon}</span>
                            <span className="text-white text-sm font-medium">{method.name}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Amount Input */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Withdraw Amount (৳)
                      </label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={walletBalance}
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                      <p className="text-xs text-secondary-400 mt-1">
                        Available balance: ৳{walletBalance.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {[500, 1000, 2000, Math.floor(walletBalance)].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setWithdrawAmount(amount.toString())}
                            disabled={amount > walletBalance}
                            className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 text-secondary-300 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {amount === Math.floor(walletBalance) ? 'All' : `৳${amount}`}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Account Number */}
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter your account number"
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </fieldset>

                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !accountNumber || parseFloat(withdrawAmount) > walletBalance || isProcessingTransaction}
                      className="w-full"
                    >
                      {isProcessingTransaction ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Withdraw Money
                        </>
                      )}
                    </Button>
                  </form>
                </article>
              </section>

              {/* Transaction History */}
              <section className="bg-secondary-700 rounded-xl p-6">
                <header className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-white">Recent Transactions</h4>
                  <DollarSign className="w-6 h-6 text-primary-400" />
                </header>

                <div className="space-y-4">
                  {transactionHistory.map((transaction) => (
                    <article
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-secondary-600 rounded-lg hover:bg-secondary-500 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowDownLeft className="w-4 h-4 text-white" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">
                            {transaction.type} via {transaction.method}
                          </p>
                          <p className="text-secondary-400 text-sm">
                            {transaction.date} • {transaction.reference}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-1">
                          {transaction.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                          {transaction.status === 'pending' && (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                          {transaction.status === 'failed' && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-xs capitalize ${
                            transaction.status === 'completed' ? 'text-green-400' :
                            transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {transactionHistory.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
                    <p className="text-secondary-400">No transactions yet</p>
                  </div>
                )}
              </section>
            </article>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <article>
              <header className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Security Settings</h3>
                <p className="text-secondary-300">Manage your account security and privacy settings</p>
              </header>
              
              <section className="space-y-6">
                {/* Password Change */}
                <section className="bg-secondary-700 rounded-xl p-4">
                  <header className="mb-4">
                    <h4 className="text-lg font-semibold text-white">Change Password</h4>
                  </header>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </fieldset>
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                        placeholder="Enter new password"
                      />
                    </fieldset>
                  </form>
                  <Button variant="primary" size="sm" className="mt-4">
                    Update Password
                  </Button>
                </section>

                {/* Two-Factor Authentication */}
                <section className="bg-secondary-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">Two-Factor Authentication</h4>
                      <p className="text-secondary-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => handleSecurityUpdate('twoFactorEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </section>

                {/* Betting Limits */}
                <section className="bg-secondary-700 rounded-xl p-4">
                  <header className="mb-4">
                    <h4 className="text-lg font-semibold text-white">Betting Limits</h4>
                  </header>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Daily Limit (৳)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.betLimits.daily}
                        onChange={(e) => handleSecurityUpdate('betLimits', {
                          ...securitySettings.betLimits,
                          daily: parseInt(e.target.value)
                        })}
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </fieldset>
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Weekly Limit (৳)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.betLimits.weekly}
                        onChange={(e) => handleSecurityUpdate('betLimits', {
                          ...securitySettings.betLimits,
                          weekly: parseInt(e.target.value)
                        })}
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </fieldset>
                    <fieldset>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Monthly Limit (৳)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.betLimits.monthly}
                        onChange={(e) => handleSecurityUpdate('betLimits', {
                          ...securitySettings.betLimits,
                          monthly: parseInt(e.target.value)
                        })}
                        className="w-full bg-secondary-600 border border-secondary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      />
                    </fieldset>
                  </form>
                </section>
              </section>
            </article>
          )}

          {/* Betting History Tab */}
          {activeTab === 'history' && (
            <article>
              <header className="mb-6">
                <h3 className="text-xl font-bold text-white">Betting History</h3>
              </header>

              <section className="bg-secondary-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Bet Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Payout
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-600">
                    {[
                      {
                        date: '2024-01-15',
                        event: 'Man City vs Arsenal',
                        type: 'Match Winner',
                        amount: '৳500',
                        status: 'Won',
                        payout: '৳850'
                      },
                      {
                        date: '2024-01-14',
                        event: 'Barcelona vs Real Madrid',
                        type: 'Over/Under',
                        amount: '৳300',
                        status: 'Lost',
                        payout: '৳0'
                      },
                      {
                        date: '2024-01-13',
                        event: 'Liverpool vs Chelsea',
                        type: 'Both Teams Score',
                        amount: '৳200',
                        status: 'Won',
                        payout: '৳340'
                      }
                    ].map((bet, index) => (
                      <tr key={index} className="hover:bg-secondary-600">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {bet.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {bet.event}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                          {bet.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {bet.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bet.status === 'Won' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {bet.payout}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </article>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <article>
              <header className="mb-6">
                <h3 className="text-xl font-bold text-white">Notification Settings</h3>
              </header>

              <section className="space-y-6">
                {/* Email Notifications */}
                <section className="bg-secondary-700 rounded-lg p-6">
                  <header className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Email Notifications</h4>
                    <Mail className="w-5 h-5 text-blue-400" />
                  </header>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">Promotional offers</span>
                      </label>
                    </li>
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">Betting results</span>
                      </label>
                    </li>
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-white">Weekly summaries</span>
                      </label>
                    </li>
                  </ul>
                </section>

                {/* SMS Notifications */}
                <section className="bg-secondary-700 rounded-lg p-6">
                  <header className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">SMS Notifications</h4>
                    <Smartphone className="w-5 h-5 text-green-400" />
                  </header>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">Login alerts</span>
                      </label>
                    </li>
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-white">Deposit confirmations</span>
                      </label>
                    </li>
                  </ul>
                </section>

                {/* Push Notifications */}
                <section className="bg-secondary-700 rounded-lg p-6">
                  <header className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Push Notifications</h4>
                    <Bell className="w-5 h-5 text-yellow-400" />
                  </header>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">Live match updates</span>
                      </label>
                    </li>
                    <li className="flex items-center justify-between">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-white">Bet settlement</span>
                      </label>
                    </li>
                  </ul>
                </section>
              </section>

              <footer className="mt-8">
                <Button variant="primary" size="sm">
                  Save Preferences
                </Button>
              </footer>
            </article>
          )}
        </motion.section>
      </section>
    </main>
  )
}