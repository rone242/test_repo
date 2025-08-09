import mongoose, { Document, Schema } from 'mongoose'

/**
 * Interface for Transaction document
 * Represents all financial transactions including deposits, withdrawals, and bets
 */
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus' | 'refund' | 'cashback'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing'
  
  // Payment details
  paymentMethod?: string
  paymentProvider?: string
  paymentReference?: string
  paymentDetails?: {
    accountNumber?: string
    accountName?: string
    bankName?: string
    transactionId?: string
    walletAddress?: string
    phoneNumber?: string
  }
  
  // Betting related
  betId?: mongoose.Types.ObjectId
  gameId?: mongoose.Types.ObjectId
  
  // Bonus related
  bonusId?: mongoose.Types.ObjectId
  bonusType?: string
  
  // Transaction metadata
  description?: string
  notes?: string
  adminNotes?: string
  
  // Processing details
  processedBy?: mongoose.Types.ObjectId
  processedAt?: Date
  failureReason?: string
  
  // Balance tracking
  balanceBefore: number
  balanceAfter: number
  
  // Fees
  fee?: number
  feeType?: 'fixed' | 'percentage'
  
  createdAt: Date
  updatedAt: Date
}

/**
 * Transaction schema for MongoDB
 * Stores all financial transactions and payment records
 */
const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'bet', 'win', 'bonus', 'refund', 'cashback'],
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'BDT',
    enum: ['BDT', 'USD', 'EUR', 'BTC', 'USDT']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
    default: 'pending',
    index: true
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    trim: true,
    index: true
  },
  paymentProvider: {
    type: String,
    trim: true
  },
  paymentReference: {
    type: String,
    trim: true,
    sparse: true,
    index: true
  },
  paymentDetails: {
    accountNumber: String,
    accountName: String,
    bankName: String,
    transactionId: String,
    walletAddress: String,
    phoneNumber: String
  },
  
  // Betting related
  betId: {
    type: Schema.Types.ObjectId,
    ref: 'Bet',
    sparse: true,
    index: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    sparse: true,
    index: true
  },
  
  // Bonus related
  bonusId: {
    type: Schema.Types.ObjectId,
    ref: 'Bonus',
    sparse: true,
    index: true
  },
  bonusType: {
    type: String,
    trim: true
  },
  
  // Transaction metadata
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  
  // Processing details
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  processedAt: {
    type: Date,
    index: true
  },
  failureReason: {
    type: String,
    trim: true
  },
  
  // Balance tracking
  balanceBefore: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Fees
  fee: {
    type: Number,
    default: 0,
    min: 0
  },
  feeType: {
    type: String,
    enum: ['fixed', 'percentage'],
    default: 'fixed'
  }
}, {
  timestamps: true
})

// Compound indexes for better query performance
TransactionSchema.index({ userId: 1, type: 1 })
TransactionSchema.index({ userId: 1, status: 1 })
TransactionSchema.index({ userId: 1, createdAt: -1 })
TransactionSchema.index({ type: 1, status: 1, createdAt: -1 })
TransactionSchema.index({ paymentMethod: 1, status: 1 })
TransactionSchema.index({ status: 1, createdAt: 1 })

// Virtual for net amount (amount - fee)
TransactionSchema.virtual('netAmount').get(function() {
  return this.amount - (this.fee || 0)
})

// Virtual for formatted amount with currency
TransactionSchema.virtual('formattedAmount').get(function() {
  const symbol = this.currency === 'BDT' ? '৳' : this.currency === 'USD' ? '$' : this.currency
  return `${symbol}${this.amount.toLocaleString()}`
})

// Method to check if transaction can be cancelled
TransactionSchema.methods.canBeCancelled = function() {
  return this.status === 'pending' && ['deposit', 'withdrawal'].includes(this.type)
}

// Method to check if transaction is successful
TransactionSchema.methods.isSuccessful = function() {
  return this.status === 'completed'
}

// Method to get transaction description
TransactionSchema.methods.getDescription = function() {
  if (this.description) return this.description
  
  switch (this.type) {
    case 'deposit':
      return `Deposit via ${this.paymentMethod || 'Payment Gateway'}`
    case 'withdrawal':
      return `Withdrawal to ${this.paymentMethod || 'Account'}`
    case 'bet':
      return 'Bet Placement'
    case 'win':
      return 'Bet Winnings'
    case 'bonus':
      return `${this.bonusType || 'Bonus'} Credit`
    case 'refund':
      return 'Bet Refund'
    case 'cashback':
      return 'Cashback Credit'
    default:
      return 'Transaction'
  }
}

// Static method to get user transaction history
TransactionSchema.statics.getUserTransactions = function(
  userId: string, 
  type?: string, 
  status?: string, 
  limit = 50, 
  skip = 0
) {
  const query: any = { userId }
  if (type) query.type = type
  if (status) query.status = status
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('betId gameId')
}

// Static method to get transaction statistics
TransactionSchema.statics.getTransactionStats = function(
  userId?: string, 
  startDate?: Date, 
  endDate?: Date
) {
  const matchQuery: any = {}
  if (userId) matchQuery.userId = new mongoose.Types.ObjectId(userId)
  if (startDate || endDate) {
    matchQuery.createdAt = {}
    if (startDate) matchQuery.createdAt.$gte = startDate
    if (endDate) matchQuery.createdAt.$lte = endDate
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    }
  ])
}

// Static method to get pending transactions
TransactionSchema.statics.getPendingTransactions = function(type?: string) {
  const query: any = { status: 'pending' }
  if (type) query.type = type
  
  return this.find(query)
    .sort({ createdAt: 1 })
    .populate('userId', 'name email phone')
}

// Pre-save middleware to set processed date
TransactionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date()
  }
  next()
})

// Pre-save middleware to generate description if not provided
TransactionSchema.pre('save', function(next) {
  if (!this.description) {
    this.description = this.getDescription()
  }
  next()
})

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)