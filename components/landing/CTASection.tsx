'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SpaceButton } from '@/components/ui/space-button'
import { GitHubButton } from '@/components/ui/github-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-32">
      {/* Floating Halloween decorations */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 md:w-40 md:h-40 z-0 opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/discount-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10 w-28 h-28 md:w-36 md:h-36 z-0 opacity-20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Image
          src="/trick-treat6-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <div className="relative max-w-4xl mx-auto text-center w-full z-10">
        <BlurFade delay={0.2} inView>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-[#8B0000] via-[#DC143C] to-[#FA6D1B]" style={{
            filter: 'drop-shadow(0 0 40px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 80px rgba(250, 109, 27, 0.5)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.7))'
          }}>
            Ready to Build Something Spooky?
          </h2>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join developers who are already building with AI-powered horror agents
          </p>
        </BlurFade>

        <BlurFade delay={0.6} inView>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/studio">
              <SpaceButton>
                START BUILDING
              </SpaceButton>
            </Link>

            <GitHubButton
              href="https://github.com/yourusername/frankenstein-ai"
            >
              View on Github
            </GitHubButton>
          </div>
        </BlurFade>

        {/* Additional Info */}
        <BlurFade delay={0.8} inView>
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-400">Open Source</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">Free</div>
                <div className="text-gray-400">Forever</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">Active</div>
                <div className="text-gray-400">Development</div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
