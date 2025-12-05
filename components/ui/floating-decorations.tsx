'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface FloatingDecorationsProps {
  showPumpkin?: boolean
  showPot?: boolean
  pumpkinPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  potPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const positionClasses = {
  'top-left': 'top-8 left-4 md:left-8',
  'top-right': 'top-8 right-4 md:right-8',
  'bottom-left': 'bottom-8 left-4 md:left-8',
  'bottom-right': 'bottom-8 right-4 md:right-8'
}

export function FloatingDecorations({
  showPumpkin = true,
  showPot = true,
  pumpkinPosition = 'top-right',
  potPosition = 'bottom-left'
}: FloatingDecorationsProps) {
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const
    }
  }

  return (
    <>
      {/* Pumpkin Decoration */}
      {showPumpkin && (
        <motion.div
          className={`absolute ${positionClasses[pumpkinPosition]} w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 pointer-events-none z-10 opacity-30 hover:opacity-50 transition-opacity duration-300`}
          animate={floatingAnimation}
        >
          <Image
            src="/halloween-assets/footer1-img.png"
            alt="Pumpkin decoration"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
          />
        </motion.div>
      )}

      {/* Pot/Cauldron Decoration */}
      {showPot && (
        <motion.div
          className={`absolute ${positionClasses[potPosition]} w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 pointer-events-none z-10 opacity-30 hover:opacity-50 transition-opacity duration-300`}
          animate={{
            y: [0, -20, 0],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        >
          <Image
            src="/halloween-assets/footer2-img.png"
            alt="Pot decoration"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
          />
        </motion.div>
      )}
    </>
  )
}
