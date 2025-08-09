import mongoose, { Document, Schema } from 'mongoose'

export interface IBet extends Document {
  userId: mongoose.Types.ObjectId
  eventId: string
  eventName: string
  sport: string
  betType: 'single' | 'multiple' | 'system'
  selections: {
    market: string
    selection: string
    odds: number
    outcome?: 'win' | 'lose' | 'void'
  }[]
  stake: number
  potentialWin: number
  actualWin?: number
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashout'
  isLive: boolean
  placedAt: Date
  settledAt?: Date
  cashoutAmount?: number
  cashoutAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Bet schema for MongoDB
 * Stores all betting information including selections, stakes, and outcomes
 */
const BetSchema = new Schema<IBet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: String,
    required: [true, 'Event ID is required']
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  sport: {
    type: String,
    required: [true, 'Sport is required'],
    enum: ['cricket', 'football', 'basketball', 'tennis', 'kabaddi', 'esports', 'other']
  },
  betType: {
    type: String,
    required: [true, 'Bet type is required'],
    enum: ['single', 'multiple', 'system']
  },
  selections: [{
    market: {
      type: String,
      required: [true, 'Market is required']
    },
    selection: {
      type: String,
      required: [true, 'Selection is required']
    },
    odds: {
      type: Number,
      required: [true, 'Odds are required'],
      min: [1.01, 'Odds must be at least 1.01']
    },
    outcome: {
      type: String,
      enum: ['win', 'lose', 'void']
    }
  }],
  stake: {
    type: Number,
    required: [true, 'Stake is required'],
    min: [1, 'Minimum stake is 1']
  },
  potentialWin: {
    type: Number,
    required: [true, 'Potential win is required']
  },
  actualWin: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'void', 'cashout'],
    default: 'pending'
  },
  isLive: {
    type: Boolean,
    default: false
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  settledAt: {
    type: Date
  },
  cashoutAmount: {
    type: Number
  },
  cashoutAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for efficient queries
BetSchema.index({ userId: 1, createdAt: -1 })
BetSchema.index({ eventId: 1 })
BetSchema.index({ status: 1 })
BetSchema.index({ sport: 1 })

// Calculate potential win before saving
BetSchema.pre('save', function(next) {
  if (this.betType === 'single' && this.selections.length === 1) {
    this.potentialWin = this.stake * this.selections[0].odds
  } else if (this.betType === 'multiple') {
    const totalOdds = this.selections.reduce((acc, sel) => acc * sel.odds, 1)
    this.potentialWin = this.stake * totalOdds
  }
  next()
})

export default mongoose.models.Bet || mongoose.model<IBet>('Bet', BetSchema)