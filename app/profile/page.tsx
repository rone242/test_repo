import { Metadata } from 'next'
import UserProfilePage from '@/components/pages/UserProfilePage'

export const metadata: Metadata = {
  title: 'My Profile - PASA Live',
  description: 'Manage your account settings, personal information, security preferences, and betting history.',
}

/**
 * User profile page route
 * Provides comprehensive account management interface
 */
export default function ProfilePage() {
  return <UserProfilePage />
}