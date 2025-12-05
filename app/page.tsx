'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/landing/Navigation'
import { ScrollProgress } from '@/components/landing/ScrollProgress'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { AgentsSection } from '@/components/landing/AgentsSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { DemoSection } from '@/components/landing/DemoSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'
import { LaunchAnnouncementModal } from '@/components/landing/LaunchAnnouncementModal'

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if modal has been shown in this session
    const hasSeenModal = sessionStorage.getItem('hasSeenLaunchModal')

    if (!hasSeenModal) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    // Mark as seen in session storage
    sessionStorage.setItem('hasSeenLaunchModal', 'true')
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-r from-[#4A7A3D] to-[#7A7A3D] text-white overflow-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Galaxy Background */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Agents Section */}
      <AgentsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Demo Section */}
      <DemoSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Launch Announcement Modal */}
      {showModal && <LaunchAnnouncementModal onClose={handleCloseModal} />}
    </main>
  )
}
