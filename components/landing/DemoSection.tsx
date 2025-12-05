'use client'

import { Play } from 'lucide-react'
import Image from 'next/image'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BorderBeam } from '@/components/magicui/border-beam'
import { FloatingDecorations } from '@/components/ui/floating-decorations'
import { motion } from 'framer-motion'

export function DemoSection() {
  return (
    <section id="demo" className="relative overflow-hidden px-4 py-8">
        {/* Floating Decorations */}
        <FloatingDecorations pumpkinPosition="bottom-left" potPosition="top-right" />

        {/* Additional Halloween Images */}
        <motion.div
          className="absolute top-10 right-10 w-28 h-28 md:w-36 md:h-36 z-0 opacity-15"
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/about-img.png"
            alt="Halloween decoration"
            fill
            className="object-contain"
          />
        </motion.div>

        <div className="relative max-w-6xl mx-auto w-full z-10">
          {/* Section Header */}
          <BlurFade delay={0.2} inView>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-horror-purple-400 to-horror-pink-500">
                See It In Action
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Watch how our horror AI agents collaborate to build real applications
              </p>
            </div>
          </BlurFade>

          {/* Demo Video/Screenshot Container */}
          <BlurFade delay={0.4} inView>
            <div className="relative glass rounded-2xl p-2 overflow-hidden">
              <BorderBeam size={300} duration={15} delay={0} />

              <div className="relative bg-linear-to-br from-horror-purple-900/20 to-horror-pink-900/20 rounded-xl overflow-hidden">
                {/* Loom Video Embed */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src="https://www.loom.com/embed/a0453d07d6ce4f7e8cde14bd52789d84"
                    frameBorder="0"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Feature Highlights Below Demo */}
          <BlurFade delay={0.6} inView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-horror-purple-400 mb-2">
                  Real-time
                </div>
                <p className="text-gray-400 text-sm">
                  Watch code being generated live
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-horror-pink-400 mb-2">
                  Collaborative
                </div>
                <p className="text-gray-400 text-sm">
                  Multiple agents working together
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-horror-red-400 mb-2">
                  Production-Ready
                </div>
                <p className="text-gray-400 text-sm">
                  Code you can deploy immediately
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
    </section>
  )
}
