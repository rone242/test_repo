import { Metadata } from 'next'
import LoggedInDashboard from '@/components/sections/LoggedInDashboard'

export const metadata: Metadata = {
  title: 'Dashboard - PASA Live',
  description: 'Your personalized betting dashboard with live matches, account overview, recent bets, and quick actions.',
}

/**
 * Dashboard page for logged-in users
 * Displays personalized content, account information, and betting activities
 */
export default function DashboardPage() {
  return <LoggedInDashboard />
}