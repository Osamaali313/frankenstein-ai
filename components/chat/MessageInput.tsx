'use client'

import { useState, KeyboardEvent, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  initialValue?: string
}

export function MessageInput({ onSend, disabled, placeholder = 'Ask the horror agents...', initialValue }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [hasAutoSent, setHasAutoSent] = useState(false)
  const onSendRef = useRef(onSend)

  // Keep ref updated
  useEffect(() => {
    onSendRef.current = onSend
  }, [onSend])

  // Set initial value and auto-send when provided
  useEffect(() => {
    console.log('MessageInput useEffect:', { initialValue, hasAutoSent, disabled })
    if (initialValue && !hasAutoSent && !disabled) {
      console.log('🚀 Auto-sending initial prompt:', initialValue)
      setInput(initialValue)
      // Auto-send the initial prompt
      setTimeout(() => {
        console.log('⚡ Executing onSend with:', initialValue.trim())
        onSendRef.current(initialValue.trim())
        setInput('')
        setHasAutoSent(true)
      }, 1000) // Longer delay to ensure everything is ready
    }
  }, [initialValue, hasAutoSent, disabled])

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-white/10 bg-black/40 backdrop-blur-sm p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 resize-none rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-[#FA6D1B]/60 focus:outline-none focus:ring-2 focus:ring-[#FA6D1B] disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="h-auto px-4 bg-[#FA6D1B] hover:bg-[#F25C07] text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
      <p className="text-xs text-[#FA6D1B] mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
