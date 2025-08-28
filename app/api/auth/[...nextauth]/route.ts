import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

/**
 * NextAuth configuration options
 * Handles authentication with credentials provider
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Here you would typically validate against your database
          // For now, we'll use a simple mock validation
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (response.ok) {
            const user = await response.json()
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/', // Custom sign-in page (your modal)
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const { connectDB } = await import('@/lib/mongodb')
          const User = (await import('@/models/User')).default
          
          await connectDB()
          
          let existingUser = await User.findOne({ googleId: user.id })
          
          if (!existingUser) {
            // Check if user exists with same email
            existingUser = await User.findOne({ email: user.email })
            
            if (existingUser) {
              // Link Google account to existing user
              existingUser.googleId = user.id
              existingUser.profilePicture = user.image || ''
              existingUser.authProvider = 'google'
              await existingUser.save()
            } else {
              // Create new user
              await User.create({
                name: user.name,
                email: user.email,
                googleId: user.id,
                profilePicture: user.image || '',
                isVerified: true,
                authProvider: 'google',
                lastLogin: new Date()
              })
            }
          } else {
            // Update existing Google user
            existingUser.lastLogin = new Date()
            existingUser.profilePicture = user.image || existingUser.profilePicture
            await existingUser.save()
          }
        } catch (error) {
          console.error('Google sign-in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }