'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Feature3DCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: string
  delay?: number
}

export function Feature3DCard({
  icon: Icon,
  title,
  description,
  color = 'from-horror-purple-600 to-horror-pink-600',
  delay = 0
}: Feature3DCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="w-full h-[300px]"
      style={{ perspective: '1000px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full rounded-[50px] bg-linear-to-br transition-all duration-500 ease-in-out border-2"
        style={{
          transformStyle: 'preserve-3d',
          backgroundImage: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)`,
          borderColor: isHovered ? '#FA6D1B' : 'rgba(220, 20, 60, 0.5)'
        }}
        animate={{
          rotateX: isHovered ? 15 : 0,
          rotateY: isHovered ? 15 : 0,
          boxShadow: isHovered
            ? '0 0 40px rgba(250, 109, 27, 0.6), 0 0 80px rgba(220, 20, 60, 0.4), rgba(250, 109, 27, 0.3) 30px 50px 25px -40px'
            : '0 0 20px rgba(220, 20, 60, 0.3), rgba(250, 109, 27, 0.2) 0px 25px 25px -5px'
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Glass layer */}
        <motion.div
          className="absolute inset-2 rounded-[55px] border-l border-b"
          style={{
            transformStyle: 'preserve-3d',
            borderTopRightRadius: '100%',
            borderColor: 'rgba(250, 109, 27, 0.2)',
            background: 'linear-gradient(0deg, rgba(250, 109, 27, 0.05) 0%, rgba(220, 20, 60, 0.1) 100%)',
            transform: 'translate3d(0px, 0px, 25px)'
          }}
        />

        {/* Logo circles in top-right */}
        <div
          className="absolute right-0 top-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {[
            { size: 170, z: 20, delay: 0, top: 8, right: 8 },
            { size: 140, z: isHovered ? 60 : 40, delay: 0.4, top: 10, right: 10 },
            { size: 110, z: isHovered ? 80 : 60, delay: 0.8, top: 17, right: 17 },
            { size: 80, z: isHovered ? 100 : 80, delay: 1.2, top: 23, right: 23 },
            { size: 50, z: isHovered ? 120 : 100, delay: 1.6, top: 30, right: 30 }
          ].map((circle, index) => (
            <motion.div
              key={index}
              className="absolute aspect-square rounded-full"
              style={{
                width: `${circle.size}px`,
                top: `${circle.top}px`,
                right: `${circle.right}px`,
                background: index === 4 ? 'rgba(250, 109, 27, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                backdropFilter: index === 1 ? 'blur(1px)' : 'blur(5px)',
                boxShadow: index === 4
                  ? '0 0 20px rgba(250, 109, 27, 0.5), rgba(220, 20, 60, 0.2) -10px 10px 20px 0px'
                  : 'rgba(220, 20, 60, 0.1) -10px 10px 20px 0px',
                border: index === 4 ? '1px solid rgba(250, 109, 27, 0.5)' : 'none',
                transformStyle: 'preserve-3d'
              }}
              animate={{
                transform: `translate3d(0, 0, ${circle.z}px)`
              }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
                delay: circle.delay
              }}
            >
              {index === 4 && (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div
          className="px-8 pt-24"
          style={{
            transform: 'translate3d(0, 0, 26px)',
            transformStyle: 'preserve-3d'
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom section */}
        <div
          className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
          style={{
            transform: 'translate3d(0, 0, 26px)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Social buttons */}
          <div className="flex gap-2.5" style={{ transformStyle: 'preserve-3d' }}>
            {[0, 1, 2].map((index) => (
              <motion.button
                key={index}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-none shadow-md"
                style={{
                  boxShadow: 'rgba(250, 109, 27, 0.5) 0px 7px 5px -5px'
                }}
                animate={{
                  transform: isHovered ? 'translate3d(0, 0, 50px)' : 'translate3d(0, 0, 0px)',
                  boxShadow: isHovered
                    ? 'rgba(250, 109, 27, 0.2) -5px 20px 10px 0px'
                    : 'rgba(250, 109, 27, 0.5) 0px 7px 5px -5px'
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.4 + index * 0.2,
                  ease: 'easeInOut'
                }}
                whileHover={{
                  backgroundColor: '#000',
                  scale: 1.1
                }}
              >
                <div className="w-4 h-4 bg-[#FA6D1B] rounded-full" />
              </motion.button>
            ))}
          </div>

          {/* View more button */}
          <motion.div
            className="flex items-center gap-1 cursor-pointer"
            whileHover={{
              transform: 'translate3d(0, 0, 10px)'
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <button className="bg-transparent border-none text-white/90 font-bold text-xs">
              Learn More
            </button>
            <svg
              className="w-4 h-4 stroke-white/90 fill-none stroke-[3px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
