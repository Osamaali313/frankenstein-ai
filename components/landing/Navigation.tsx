'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { UserMenu } from '@/components/auth/UserMenu'

const navigationLinks = [
  { href: '#features', label: 'Features' },
  { href: '#agents', label: 'Agents' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#demo', label: 'Demo' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-full overflow-hidden transition-all duration-300">
          {/* Animated rotating gradient border */}
          <div
            className="absolute inset-0 animate-rotate-gradient"
            style={{
              background: `conic-gradient(
                from 0deg at 50% 50%,
                #FA6D1B 0%,
                #7A7A3D 25%,
                #4A7A3D 55%,
                #F25C07 85%,
                #FA6D1B 100%
              )`,
              filter: 'blur(8px)',
              opacity: isScrolled ? 0.8 : 0.5,
            }}
          />

          {/* Inner background */}
          <div
            className={`relative rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-black/90 backdrop-blur-xl'
                : 'bg-black/70 backdrop-blur-md'
            }`}
            style={{
              margin: '2px',
            }}
          >
            <div className="flex items-center justify-between h-16 px-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
              >
                <motion.div
                  className="relative w-10 h-10"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Frankenstein AI Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-[#FA6D1B] to-[#F25C07]">
                  FRANKENSTEIN<span className="text-[#FA6D1B]">.AI</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-[#FA6D1B] to-[#F25C07] group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}

                <UserMenu />

                <Link href="/studio">
                  <button className="relative px-6 py-2 rounded-full overflow-hidden group">
                    {/* Animated border */}
                    <div
                      className="absolute inset-0 bg-linear-to-r from-[#FA6D1B] via-[#F25C07] to-[#FA6D1B] opacity-100 group-hover:opacity-100 transition-opacity"
                      style={{
                        padding: '2px',
                      }}
                    />
                    {/* Inner background */}
                    <div className="relative bg-linear-to-r from-[#FA6D1B] to-[#F25C07] group-hover:from-[#F25C07] group-hover:to-[#FA6D1B] transition-all duration-300 rounded-full px-4 py-1.5">
                      <span className="relative text-white font-semibold text-sm">Try Now</span>
                    </div>
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 rounded-3xl overflow-hidden"
            >
              <div className="bg-black/90 backdrop-blur-xl border border-[#FA6D1B]/30 rounded-3xl px-4 py-6 space-y-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/studio" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full relative px-6 py-3 rounded-full overflow-hidden group">
                    {/* Inner background */}
                    <div className="relative bg-linear-to-r from-[#FA6D1B] to-[#F25C07] rounded-full">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="relative text-white font-semibold text-sm">Try Now</span>
                      </div>
                    </div>
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes rotate-gradient {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-rotate-gradient {
          animation: rotate-gradient 5s linear infinite;
        }
      `}</style>
    </nav>
  )
}
