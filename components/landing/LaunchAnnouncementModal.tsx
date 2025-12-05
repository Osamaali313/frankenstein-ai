'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Code2, Eye, Layers } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface LaunchAnnouncementModalProps {
  onClose: () => void
}

export function LaunchAnnouncementModal({ onClose }: LaunchAnnouncementModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-[#FA6D1B]/30 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Pumpkin Image */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/home1-img.png"
                  alt="Halloween Pumpkin"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FA6D1B] via-[#F25C07] to-[#FA6D1B]"
            >
              🎃 Coming Soon!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl font-semibold text-center text-white mb-3"
            >
              Horror Coding Team in Development
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-gray-400 mb-8 text-base md:text-lg leading-relaxed"
            >
              Our spooky AI agents are preparing to haunt your codebase!
              Get ready for a frightfully productive development experience.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-start gap-3 p-4 rounded-lg bg-black/40 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FA6D1B]/20 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-[#FA6D1B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI-Powered Code Generation</h3>
                  <p className="text-sm text-gray-400">
                    Multi-agent collaboration for full-stack development
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-black/40 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FA6D1B]/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#FA6D1B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Live Code Editor</h3>
                  <p className="text-sm text-gray-400">
                    Professional Monaco editor with real-time editing capabilities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-black/40 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FA6D1B]/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#FA6D1B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Real-time Preview</h3>
                  <p className="text-sm text-gray-400">
                    See your application come to life as agents build it
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <Button
                onClick={onClose}
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white rounded-xl shadow-lg shadow-[#FA6D1B]/50 transition-all duration-300 hover:scale-105"
              >
                Explore the Preview 👻
              </Button>
            </motion.div>

            {/* Footer Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-sm text-gray-500 mt-6"
            >
              Currently in active development • Launching soon
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FA6D1B] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FA6D1B] to-transparent" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
