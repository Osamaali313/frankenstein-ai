'use client'

import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  [key: string]: any
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useSpring(0, { stiffness: 150, damping: 15 })
  const y = useSpring(0, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    x.set(deltaX * strength)
    y.set(deltaY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div style={{ x, y }}>
      <Button
        ref={ref}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...props}
      >
        <motion.span
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-horror-purple-500 to-horror-pink-500 blur-xl"
          animate={{
            opacity: isHovered ? 0.5 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: -1 }}
        />
      </Button>
    </motion.div>
  )
}
