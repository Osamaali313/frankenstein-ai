'use client'

import { Agent } from '@/types'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

interface AgentStatusDashboardProps {
  agents: Agent[]
  currentAgent: string
  workflowPhase: string
  iterationCount: number
  reviewStatus: 'pending' | 'approved' | 'needs_work' | 'rejected'
}

export function AgentStatusDashboard({
  agents,
  currentAgent,
  workflowPhase,
  iterationCount,
  reviewStatus
}: AgentStatusDashboardProps) {
  const getAgentStatus = (agentId: string) => {
    // Determine if this agent is active, completed, or pending
    if (agentId === currentAgent) {
      return 'active'
    }

    // Check if agent has completed based on workflow phase
    const phaseOrder = ['valak', 'jason', 'worker', 'pinhead']
    const workerAgents = ['annabelle', 'chucky', 'freddy', 'pennywise', 'ghostface']

    if (workflowPhase === 'review' || workflowPhase === 'complete') {
      // Workers have completed if we're in review
      if (workerAgents.includes(agentId)) {
        return 'completed'
      }
    }

    if (workflowPhase === 'complete') {
      // All agents completed
      if (agentId === 'pinhead') {
        return 'completed'
      }
    }

    return 'pending'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Loader2 className="w-3 h-3 text-primary animate-spin" />
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />
      default:
        return <Circle className="w-3 h-3 text-muted-foreground/50" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-primary bg-primary/10'
      case 'completed':
        return 'border-green-500/50 bg-green-500/5'
      default:
        return 'border-border/50 bg-muted/30'
    }
  }

  return (
    <div className="p-3 border-b border-border bg-muted/20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Agent Status
        </h4>
        {iterationCount > 0 && (
          <span className="text-xs text-primary font-medium">
            Iteration {iterationCount}/3
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {agents.slice(0, 8).map((agent) => {
          const status = getAgentStatus(agent.id)
          return (
            <div
              key={agent.id}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${getStatusColor(status)}`}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg">{agent.icon}</span>
                {getStatusIcon(status)}
              </div>
              <span className="text-[10px] text-center text-muted-foreground leading-tight">
                {agent.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Review Status Badge */}
      {reviewStatus !== 'pending' && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Review:</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                reviewStatus === 'approved'
                  ? 'bg-green-500/20 text-green-500'
                  : reviewStatus === 'needs_work'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {reviewStatus === 'approved' && '✓ Approved'}
              {reviewStatus === 'needs_work' && '⚠ Needs Work'}
              {reviewStatus === 'rejected' && '✗ Rejected'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
