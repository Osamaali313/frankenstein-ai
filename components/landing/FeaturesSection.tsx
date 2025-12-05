'use client'

import { useRef } from 'react'
import {
  Zap, Code, Users, Smartphone, Shield, Rocket
} from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { FloatingDecorations } from '@/components/ui/floating-decorations'
import { Feature3DCard } from '@/components/ui/feature-3d-card'

const features = [
  {
    icon: Users,
    title: 'Multi-Agent Collaboration',
    description: 'Specialized AI agents work together - Frontend, Backend, DevOps, Security, and more',
    color: 'text-horror-purple-400',
    delay: 0
  },
  {
    icon: Code,
    title: 'Professional Code Editor',
    description: 'Monaco editor with syntax highlighting, IntelliSense, and real-time preview',
    color: 'text-horror-pink-400',
    delay: 0.1
  },
  {
    icon: Zap,
    title: 'Full-Stack Development',
    description: 'React, Next.js, Python, FastAPI, databases, APIs - complete application stack',
    color: 'text-horror-purple-400',
    delay: 0.2
  },
  {
    icon: Shield,
    title: 'Code Execution Sandbox',
    description: 'Safe environment to test and preview your applications in real-time',
    color: 'text-horror-pink-400',
    delay: 0.3
  },
  {
    icon: Rocket,
    title: 'Production-Ready Output',
    description: 'Clean, tested code with error handling, security best practices, and deployment readiness',
    color: 'text-horror-red-400',
    delay: 0.4
  },
  {
    icon: Smartphone,
    title: 'File System Management',
    description: 'Create, edit, and organize files with full project structure control',
    color: 'text-horror-purple-400',
    delay: 0.5
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 10
    }
  }
}

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden px-4 py-8"
    >
      {/* Floating Decorations */}
      <FloatingDecorations pumpkinPosition="top-right" potPosition="bottom-left" />

      {/* Category Halloween Images */}
      <motion.div
        className="absolute top-20 left-5 w-24 h-24 md:w-32 md:h-32 z-0 opacity-15"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/category1-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-5 w-24 h-24 md:w-32 md:h-32 z-0 opacity-15"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Image
          src="/category2-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/4 w-20 h-20 md:w-28 md:h-28 z-0 opacity-15"
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Image
          src="/category3-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto w-full z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-horror-pink-400 to-horror-red-500"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Powerful Tools & Capabilities
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Professional development tools powered by AI agents
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature3DCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
