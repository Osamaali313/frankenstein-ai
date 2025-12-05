'use client'

import { motion } from 'framer-motion'
import { Wifi, WifiOff, Loader2, Check, AlertCircle } from 'lucide-react'

interface StatusBarProps {
  isConnected: boolean
  currentFile?: string
  errors?: number
  warnings?: number
  isProcessing?: boolean
}

export function StatusBar({
  isConnected,
  currentFile,
  errors = 0,
  warnings = 0,
  isProcessing = false
}: StatusBarProps) {
  return (
    <div className="h-8 px-4 flex items-center justify-between bg-black/50 border-t border-white/10 text-xs">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <motion.div
          className="flex items-center gap-2"
          animate={{
            color: isConnected ? '#34D399' : '#EF4444'
          }}
        >
          {isConnected ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span className="text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </motion.div>

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-horror-purple-400"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        )}

        {/* Current file */}
        {currentFile && (
          <div className="flex items-center gap-2 text-gray-400">
            <span>{currentFile}</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Errors */}
        {errors > 0 && (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{errors} Error{errors !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Warnings */}
        {warnings > 0 && (
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertCircle className="w-3 h-3" />
            <span>{warnings} Warning{warnings !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Ready indicator */}
        {!isProcessing && errors === 0 && (
          <div className="flex items-center gap-1 text-green-400">
            <Check className="w-3 h-3" />
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  )
}
