import Hero from '@/components/sections/Hero'
import SportsSection from '@/components/sections/SportsSection'
import CasinoSection from '@/components/sections/CasinoSection'
import LiveBetting from '@/components/sections/LiveBetting'
import Promotions from '@/components/sections/Promotions'

/**
 * Main homepage component that displays all sections of the PASA Live platform
 * Includes hero section, sports betting, casino games, live betting, and promotions
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <Hero />
      <SportsSection />
      <LiveBetting />
      <CasinoSection />
      <Promotions />
    </div>
  )
}