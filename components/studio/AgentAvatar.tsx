'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface AgentAvatarProps {
  src: string
  alt: string
  status?: 'idle' | 'thinking' | 'active'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
}

const statusColors = {
  idle: 'border-gray-500/50',
  thinking: 'border-[#FA6D1B]/70 shadow-[0_0_15px_rgba(250,109,27,0.5)]',
  active: 'border-[#4A7A3D]/70 shadow-[0_0_15px_rgba(74,122,61,0.5)]'
}

export function AgentAvatar({
  src,
  alt,
  status = 'idle',
  size = 'md',
  className = ''
}: AgentAvatarProps) {
  // Check if src is an emoji or image path
  const isEmoji = src.length <= 4 && !src.startsWith('/')

  return (
    <motion.div
      className={`relative ${sizeMap[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full border-2 ${statusColors[status]} transition-all duration-300`} />

      {/* Image/Emoji container */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center">
        {isEmoji ? (
          <span className={`${size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-4xl'}`}>
            {src}
          </span>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      {/* Status indicator dot */}
      {status !== 'idle' && (
        <motion.div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${
            status === 'thinking' ? 'bg-[#FA6D1B]' : 'bg-[#4A7A3D]'
          }`}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  )
}
