'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { HeroPromptBox } from './HeroPromptBox'
import Image from 'next/image'

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Floating Halloween Images */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 z-0 opacity-30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/home1-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute top-40 right-10 w-32 h-32 md:w-48 md:h-48 z-0 opacity-30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Image
          src="/home2-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 md:w-36 md:h-36 z-0 opacity-20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Image
          src="/trick-treat4-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 w-24 h-24 md:w-36 md:h-36 z-0 opacity-20"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Image
          src="/trick-treat5-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center px-4 py-20 w-full min-h-screen pointer-events-none">
        <motion.div
          style={{ y, opacity }}
          className="w-full max-w-5xl mx-auto text-center"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-[#8B0000] via-[#DC143C] to-[#FA6D1B]" style={{
              filter: 'drop-shadow(0 0 40px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 80px rgba(250, 109, 27, 0.5)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.7))'
            }}>
              Your Horror Dev Team
            </h1>
            <p className="text-xl md:text-2xl text-white" style={{
              textShadow: '0 0 25px rgba(220, 20, 60, 0.5), 0 0 50px rgba(250, 109, 27, 0.3), 0 2px 10px rgba(0, 0, 0, 0.7)'
            }}>
              AI agents that code like professionals. Multi-agent collaboration from{' '}
              <span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-[#DC143C] to-[#FA6D1B]" style={{
                filter: 'drop-shadow(0 0 35px rgba(220, 20, 60, 1)) drop-shadow(0 0 70px rgba(250, 109, 27, 0.7))'
              }}>idea to production</span>.
            </p>
          </motion.div>

          {/* Prompt Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full flex justify-center pointer-events-auto"
          >
            <HeroPromptBox />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
