import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import Benefits from '../components/landing/Benefits'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Pricing />
      <Benefits />
      <Footer />
    </div>
  )
}
