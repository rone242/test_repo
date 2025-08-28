import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  phone?: string
  balance: number
  isVerified: boolean
  role: 'user' | 'admin'
  avatar?: string
  profilePicture?: string
  dateOfBirth?: Date
  country: string
  currency: string
  username?: string
  googleId?: string
  telegramId?: string
  authProvider?: 'credentials' | 'google' | 'telegram'
  lastLogin?: Date
  preferences: {
    language: string
    notifications: boolean
    twoFactorAuth: boolean
  }
  bettingHistory: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

/**
 * User schema for MongoDB
 * Includes authentication, profile, and betting-related fields
 */
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return this.authProvider === 'credentials'
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  telegramId: {
    type: String,
    unique: true,
    sparse: true
  },
  authProvider: {
    type: String,
    enum: ['credentials', 'google', 'telegram'],
    default: 'credentials'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    match: [/^[+]?[1-9][\d]{10,14}$/, 'Please enter a valid phone number']
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date
  },
  country: {
    type: String,
    default: 'BD'
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    twoFactorAuth: {
      type: Boolean,
      default: false
    }
  },
  bettingHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'Bet'
  }]
}, {
  timestamps: true
})

// Hash password before saving (only for credential-based auth)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password || this.authProvider !== 'credentials') {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)