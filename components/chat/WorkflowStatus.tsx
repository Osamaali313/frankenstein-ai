'use client'

import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface WorkflowStatusProps {
  phase: string
  iterationCount: number
  reviewStatus: 'pending' | 'approved' | 'needs_work' | 'rejected'
  currentAgent: string
  agentIcon: string
}

export function WorkflowStatus({
  phase,
  iterationCount,
  reviewStatus,
  currentAgent,
  agentIcon
}: WorkflowStatusProps) {
  const getPhaseDisplay = () => {
    switch (phase) {
      case 'clarification':
        return { label: 'Clarifying Requirements', color: 'text-blue-500' }
      case 'requirements':
        return { label: 'Defining Requirements', color: 'text-purple-500' }
      case 'work':
        return { label: 'Building Solution', color: 'text-yellow-500' }
      case 'review':
        return { label: 'Code Review in Progress', color: 'text-orange-500' }
      case 'complete':
        return { label: 'Workflow Complete', color: 'text-green-500' }
      default:
        return { label: 'Processing...', color: 'text-muted-foreground' }
    }
  }

  const getReviewStatusIcon = () => {
    switch (reviewStatus) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'needs_work':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
    }
  }

  const getReviewStatusText = () => {
    switch (reviewStatus) {
      case 'approved':
        return 'Approved by Pinhead'
      case 'needs_work':
        return 'Revising based on feedback'
      case 'rejected':
        return 'Rejected - requires rework'
      default:
        return 'Awaiting review'
    }
  }

  const phaseDisplay = getPhaseDisplay()

  return (
    <div className="border-b border-border p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
      {/* Workflow Phase */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className={`w-4 h-4 animate-spin ${phaseDisplay.color}`} />
          <span className={`text-sm font-medium ${phaseDisplay.color}`}>
            {phaseDisplay.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{agentIcon}</span>
          <span className="capitalize">{currentAgent}</span>
        </div>
      </div>

      {/* Iteration & Review Status */}
      {iterationCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {getReviewStatusIcon()}
            <span className="text-xs text-muted-foreground">
              {getReviewStatusText()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-primary">
              Iteration {iterationCount}/3
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-2 w-full bg-muted rounded-full h-1">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-500"
          style={{
            width: phase === 'complete' ? '100%' :
                   phase === 'review' ? '75%' :
                   phase === 'work' ? '50%' :
                   phase === 'requirements' ? '25%' : '10%'
          }}
        />
      </div>
    </div>
  )
}
