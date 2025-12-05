'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedBorderCardProps {
  children: React.ReactNode
  delay?: number
}

export function AnimatedBorderCard({ children, delay = 0 }: AnimatedBorderCardProps) {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[20px]"
        style={{
          background: '#07182e',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Rotating gradient background - Halloween theme */}
        <div
          className="absolute w-[200%] h-[200%] animate-rotate-gradient"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              #FA6D1B 0%,
              #7A7A3D 25%,
              #4A7A3D 55%,
              #F25C07 85%,
              #FA6D1B 100%
            )`,
            filter: 'blur(10px) brightness(1.2)',
            zIndex: 0
          }}
        />

        {/* Inner mask */}
        <div
          className="absolute rounded-[16px]"
          style={{
            inset: '4px',
            background: '#1a1a1c',
            zIndex: 1,
            boxShadow: 'inset 0 0 20px rgba(250, 109, 27, 0.1)'
          }}
        />

        {/* Radial gradient overlay */}
        <div
          className="absolute w-[200%] h-[200%]"
          style={{
            background: 'radial-gradient(circle at center, transparent 40%, #1a1a1c 80%)',
            zIndex: 1
          }}
        />

        {/* Content */}
        <div className="relative z-[2] w-full h-full p-8">
          {children}
        </div>
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
    </motion.div>
  )
}
