'use client'

import { Agent } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AgentAvatar } from '@/components/studio/AgentAvatar'

interface AgentCardProps {
  agent: Agent
  isSelected?: boolean
  onSelect: (agent: Agent) => void
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-white/10 bg-black/40 backdrop-blur-sm',
        isSelected && 'ring-2 ring-[#FA6D1B] shadow-[0_0_20px_rgba(250,109,27,0.3)]'
      )}
      onClick={() => onSelect(agent)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AgentAvatar
            src={agent.icon}
            alt={agent.name}
            status={isSelected ? 'active' : 'idle'}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-white">
              {agent.name}
              {isSelected && (
                <span className="text-xs bg-[#FA6D1B]/20 text-[#FA6D1B] px-2 py-0.5 rounded-full border border-[#FA6D1B]/30">
                  Active
                </span>
              )}
            </h3>
            <p className="text-sm text-[#FA6D1B] font-medium mb-2">{agent.specialty}</p>
            <p className="text-xs text-[#FA6D1B]/80 line-clamp-2">
              {agent.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
