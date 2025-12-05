'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AgentAvatar } from '@/components/studio/AgentAvatar'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'

export interface AgentMessage {
  id: string
  fromAgent: string
  toAgent?: string
  message: string
  timestamp: Date
  type: 'message' | 'handoff' | 'status'
}

interface AgentCommunicationPanelProps {
  messages: AgentMessage[]
  agents: Array<{
    id: string
    name: string
    icon: string
    specialty: string
  }>
  currentAgent?: string
}

export function AgentCommunicationPanel({ messages, agents, currentAgent }: AgentCommunicationPanelProps) {
  const getAgentInfo = (agentId: string) => {
    return agents.find(a => a.id === agentId)
  }

  return (
    <div className="h-full flex flex-col bg-black/30 backdrop-blur-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/50">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-[#FA6D1B]">⚡</span>
          Agent Communication
        </h3>
        <p className="text-xs text-[#FA6D1B] mt-1">Watch agents collaborate in real-time</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => {
            const fromAgent = getAgentInfo(msg.fromAgent)
            const toAgent = msg.toAgent ? getAgentInfo(msg.toAgent) : null

            if (!fromAgent) return null

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative ${
                  msg.type === 'handoff'
                    ? 'bg-[#FA6D1B]/10 border-[#FA6D1B]/30'
                    : msg.type === 'status'
                    ? 'bg-[#4A7A3D]/10 border-[#4A7A3D]/30'
                    : 'bg-white/5 border-white/10'
                } border rounded-lg p-3`}
              >
                {/* Message Type Badge */}
                {msg.type === 'handoff' && (
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#FA6D1B] text-white text-xs rounded-full font-medium flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Handoff
                  </div>
                )}
                {msg.type === 'status' && (
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#4A7A3D] text-white text-xs rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Status
                  </div>
                )}

                {/* Agent Info */}
                <div className="flex items-start gap-3">
                  <AgentAvatar
                    src={fromAgent.icon}
                    alt={fromAgent.name}
                    status={msg.fromAgent === currentAgent ? 'active' : 'idle'}
                    size="sm"
                  />

                  <div className="flex-1 min-w-0">
                    {/* From -> To */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {fromAgent.name}
                      </span>
                      {toAgent && (
                        <>
                          <ArrowRight className="w-3 h-3 text-[#FA6D1B]" />
                          <span className="text-sm font-medium text-white">
                            {toAgent.name}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-[#FA6D1B] ml-auto">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Specialty Badge */}
                    <div className="text-xs text-[#FA6D1B] mb-2">
                      {fromAgent.specialty}
                    </div>

                    {/* Message Content */}
                    <div className="text-sm text-white leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#FA6D1B]" />
            </div>
            <p className="text-white text-sm font-semibold">No agent communication yet</p>
            <p className="text-[#FA6D1B] text-xs mt-1">
              Messages will appear when agents start collaborating
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
