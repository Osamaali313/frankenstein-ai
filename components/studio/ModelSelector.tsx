'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  disabled?: boolean
}

const MODELS = [
  { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4.5', description: 'Latest & most capable' },
  { id: 'claude-sonnet-4-20241022', name: 'Claude Sonnet 4', description: 'Fast and intelligent' },
  { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Most powerful reasoning' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Previous generation' },
]

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedModelInfo = MODELS.find(m => m.id === selectedModel) || MODELS[0]

  if (disabled) {
    return (
      <div className="opacity-50 cursor-not-allowed">
        <div className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-md border border-white/10">
          <span className="text-sm text-gray-500">Model selection disabled in Agentic mode</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-3 py-2 bg-black/50 hover:bg-black/60 rounded-md border border-white/10 transition-colors min-w-[200px]"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400">Model</span>
          <span className="text-sm text-white font-medium">{selectedModelInfo.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl overflow-hidden z-50"
            >
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                    selectedModel === model.id ? 'bg-[#FA6D1B]/10' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      {selectedModel === model.id && (
                        <span className="text-xs text-[#FA6D1B]">✓ Selected</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{model.description}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
