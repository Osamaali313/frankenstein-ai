'use client'

import { motion } from 'framer-motion'
import { Users, User } from 'lucide-react'

interface ModeToggleProps {
  mode: 'agentic' | 'solo'
  onModeChange: (mode: 'agentic' | 'solo') => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">Mode:</span>
      <div className="relative flex items-center bg-black/50 rounded-full p-1 border border-white/10">
        {/* Sliding background */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-linear-to-r from-[#FA6D1B] to-[#F25C07]"
          initial={false}
          animate={{
            left: mode === 'agentic' ? '4px' : '50%',
            right: mode === 'agentic' ? '50%' : '4px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Agentic Mode Button */}
        <button
          onClick={() => onModeChange('agentic')}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            mode === 'agentic'
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Agentic
        </button>

        {/* Solo Mode Button */}
        <button
          onClick={() => onModeChange('solo')}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            mode === 'solo'
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <User className="w-4 h-4" />
          Solo
        </button>
      </div>
    </div>
  )
}
