import mongoose, { Document, Schema } from 'mongoose'

/**
 * Interface for Game document
 * Represents both casino games and sports events
 */
export interface IGame extends Document {
  name: string
  type: 'casino' | 'sports' | 'live-casino' | 'esports'
  category: string
  provider: string
  description?: string
  image?: string
  thumbnail?: string
  isActive: boolean
  isLive: boolean
  isFeatured: boolean
  minBet: number
  maxBet: number
  rtp?: number // Return to Player percentage for casino games
  popularity: number
  playerCount?: number
  jackpot?: number
  
  // Sports specific fields
  sport?: string
  league?: string
  homeTeam?: string
  awayTeam?: string
  startTime?: Date
  endTime?: Date
  status?: 'upcoming' | 'live' | 'finished' | 'cancelled'
  
  // Casino specific fields
  gameId?: string
  volatility?: 'low' | 'medium' | 'high'
  paylines?: number
  reels?: number
  
  // Metadata
  tags: string[]
  languages: string[]
  currencies: string[]
  devices: string[]
  
  createdAt: Date
  updatedAt: Date
}

/**
 * Game schema for MongoDB
 * Stores information about casino games and sports events
 */
const GameSchema = new Schema<IGame>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['casino', 'sports', 'live-casino', 'esports'],
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  provider: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isLive: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  minBet: {
    type: Number,
    required: true,
    min: 0
  },
  maxBet: {
    type: Number,
    required: true,
    min: 0
  },
  rtp: {
    type: Number,
    min: 0,
    max: 100
  },
  popularity: {
    type: Number,
    default: 0,
    index: true
  },
  playerCount: {
    type: Number,
    default: 0
  },
  jackpot: {
    type: Number,
    default: 0
  },
  
  // Sports specific fields
  sport: {
    type: String,
    trim: true,
    index: true
  },
  league: {
    type: String,
    trim: true
  },
  homeTeam: {
    type: String,
    trim: true
  },
  awayTeam: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    index: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  
  // Casino specific fields
  gameId: {
    type: String,
    trim: true,
    sparse: true,
    index: true
  },
  volatility: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  paylines: {
    type: Number,
    min: 1
  },
  reels: {
    type: Number,
    min: 3
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  currencies: [{
    type: String,
    trim: true
  }],
  devices: [{
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: ['desktop', 'mobile', 'tablet']
  }]
}, {
  timestamps: true
})

// Indexes for better query performance
GameSchema.index({ type: 1, category: 1 })
GameSchema.index({ provider: 1, isActive: 1 })
GameSchema.index({ isLive: 1, startTime: 1 })
GameSchema.index({ isFeatured: 1, popularity: -1 })
GameSchema.index({ sport: 1, status: 1 })
GameSchema.index({ name: 'text', description: 'text' })

// Virtual for sports match display name
GameSchema.virtual('matchName').get(function() {
  if (this.type === 'sports' && this.homeTeam && this.awayTeam) {
    return `${this.homeTeam} vs ${this.awayTeam}`
  }
  return this.name
})

// Method to check if game is available for betting
GameSchema.methods.isAvailableForBetting = function() {
  if (!this.isActive) return false
  
  if (this.type === 'sports') {
    return this.status === 'upcoming' || this.status === 'live'
  }
  
  return true
}

// Method to get game URL
GameSchema.methods.getGameUrl = function() {
  const baseUrl = this.type === 'sports' ? '/sports' : '/casino'
  return `${baseUrl}/${this.category}/${this._id}`
}

// Static method to get popular games
GameSchema.statics.getPopularGames = function(type?: string, limit = 10) {
  const query: any = { isActive: true }
  if (type) query.type = type
  
  return this.find(query)
    .sort({ popularity: -1, playerCount: -1 })
    .limit(limit)
}

// Static method to get live games
GameSchema.statics.getLiveGames = function(type?: string) {
  const query: any = { isActive: true, isLive: true }
  if (type) query.type = type
  
  return this.find(query).sort({ startTime: 1 })
}

// Static method to get featured games
GameSchema.statics.getFeaturedGames = function(type?: string, limit = 6) {
  const query: any = { isActive: true, isFeatured: true }
  if (type) query.type = type
  
  return this.find(query)
    .sort({ popularity: -1 })
    .limit(limit)
}

// Pre-save middleware to update popularity based on player count
GameSchema.pre('save', function(next) {
  if (this.playerCount !== undefined) {
    this.popularity = Math.floor(this.playerCount * 0.1) + (this.isFeatured ? 100 : 0)
  }
  next()
})

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema)