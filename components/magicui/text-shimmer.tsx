'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  duration?: number
}

export function TextShimmer({ children, className, duration = 2 }: TextShimmerProps) {
  return (
    <motion.div
      className={cn('relative inline-block', className)}
      initial={{ backgroundPosition: '200% center' }}
      animate={{ backgroundPosition: '-200% center' }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.div>
  )
}
