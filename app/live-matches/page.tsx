import { Metadata } from 'next'
import LiveMatchesPage from '@/components/pages/LiveMatchesPage'

export const metadata: Metadata = {
  title: 'Live Matches - PASA Live',
  description: 'Watch live sports matches with real-time streaming, scores, and betting odds. Experience the thrill of live sports betting.',
}

export default function LiveMatches() {
  return <LiveMatchesPage />
}