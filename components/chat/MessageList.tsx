'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { cn } from '@/lib/utils'
import { MarkdownMessage } from './MarkdownMessage'

interface MessageListProps {
  messages: Message[]
  agentIcons: Record<string, string>
  isThinking?: boolean
  createdFiles?: Map<string, Array<{ filename: string; language: string }>>
}

export function MessageList({ messages, agentIcons, isThinking, createdFiles }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-white text-lg mb-2 font-semibold">
            👻 Welcome to Frankenstein.AI
          </p>
          <p className="text-sm text-[#FA6D1B]">
            Select an agent and start a conversation...
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'agent' && message.agent && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#FA6D1B]/20 flex items-center justify-center text-xl border border-[#FA6D1B]/30">
                  🎃
                </div>
              </div>
            )}

            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'bg-[#FA6D1B] text-white'
                  : 'bg-black/50 text-white border border-white/10'
              )}
            >
              {message.role === 'agent' && message.agent && (
                <div className="text-xs font-semibold mb-1 opacity-70">
                  {message.agent.toUpperCase()}
                </div>
              )}
              <div className="text-sm">
                {message.role === 'agent' ? (
                  <MarkdownMessage
                    content={message.content}
                    createdFiles={createdFiles?.get(message.id) || []}
                  />
                ) : (
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                )}
              </div>
              <div className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xl">
                  👤
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Thinking Indicator */}
      {isThinking && (
        <div className="flex gap-3 items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl animate-pulse">⚡</span>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg px-4 py-3 border border-white/10">
            <p className="text-sm font-medium mb-2 text-[#FA6D1B]">Agent is thinking...</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#FA6D1B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#FA6D1B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#FA6D1B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
