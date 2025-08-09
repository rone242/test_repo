import { Metadata } from 'next'
import CasinoPage from '@/components/pages/CasinoPage'

export const metadata: Metadata = {
  title: 'Casino - PASA Live',
  description: 'Experience the thrill of live casino games with professional dealers. Play slots, blackjack, roulette, and more.',
}

/**
 * Casino page route component
 * Renders the main casino gaming interface
 */
export default function Casino() {
  return <CasinoPage />
}