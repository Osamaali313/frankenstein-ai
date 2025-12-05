'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Award, Brain, Target } from 'lucide-react'

interface AgentMetrics {
  total_interactions: number
  approval_rate: number
  average_rating: number
  successful_patterns: number
  learnings: number
}

interface LearningDashboardProps {
  onClose?: () => void
}

export function LearningDashboard({ onClose }: LearningDashboardProps) {
  const [metrics, setMetrics] = useState<Record<string, AgentMetrics> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    // Refresh every 10 seconds
    const interval = setInterval(fetchMetrics, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/metrics')
      const data = await response.json()
      if (data.status === 'success') {
        setMetrics(data.metrics)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAgentIcon = (agentId: string) => {
    const icons: Record<string, string> = {
      annabelle: '👻',
      chucky: '🔪',
      freddy: '😈',
      jason: '🪓',
      pennywise: '🤡',
      ghostface: '👤',
      valak: '📿',
      pinhead: '⛓️'
    }
    return icons[agentId] || '🤖'
  }

  const getAgentName = (agentId: string) => {
    const names: Record<string, string> = {
      annabelle: 'Annabelle',
      chucky: 'Chucky',
      freddy: 'Freddy',
      jason: 'Jason',
      pennywise: 'Pennywise',
      ghostface: 'Ghostface',
      valak: 'Valak',
      pinhead: 'Pinhead'
    }
    return names[agentId] || agentId
  }

  const getPerformanceLevel = (approvalRate: number) => {
    if (approvalRate >= 0.8) return { label: 'Excellent', color: 'text-green-500' }
    if (approvalRate >= 0.6) return { label: 'Good', color: 'text-blue-500' }
    if (approvalRate >= 0.4) return { label: 'Fair', color: 'text-yellow-500' }
    return { label: 'Learning', color: 'text-orange-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading agent learning data...</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No learning data available</div>
      </div>
    )
  }

  // Filter to worker agents only
  const workerAgents = ['annabelle', 'chucky', 'freddy', 'pennywise', 'ghostface']
  const workerMetrics = Object.entries(metrics).filter(([agentId]) => workerAgents.includes(agentId))

  return (
    <div className="p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Agent Learning Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Self-improving AI agents that learn from every interaction
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workerMetrics.map(([agentId, agentMetrics]) => {
          const performanceLevel = getPerformanceLevel(agentMetrics.approval_rate)

          return (
            <div
              key={agentId}
              className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getAgentIcon(agentId)}</span>
                  <div>
                    <h3 className="font-semibold">{getAgentName(agentId)}</h3>
                    <span className={`text-xs font-medium ${performanceLevel.color}`}>
                      {performanceLevel.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                {/* Approval Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>Approval Rate</span>
                  </div>
                  <span className="text-sm font-medium">
                    {(agentMetrics.approval_rate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      agentMetrics.approval_rate >= 0.8
                        ? 'bg-green-500'
                        : agentMetrics.approval_rate >= 0.6
                        ? 'bg-blue-500'
                        : agentMetrics.approval_rate >= 0.4
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${agentMetrics.approval_rate * 100}%` }}
                  />
                </div>

                {/* Average Rating */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Avg Rating</span>
                  </div>
                  <span className="text-sm font-medium">
                    {agentMetrics.average_rating.toFixed(1)}/5.0
                  </span>
                </div>

                {/* Total Interactions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Interactions</span>
                  </div>
                  <span className="text-sm font-medium">
                    {agentMetrics.total_interactions}
                  </span>
                </div>

                {/* Learning Stats */}
                <div className="pt-2 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                  <span>{agentMetrics.successful_patterns} patterns</span>
                  <span>{agentMetrics.learnings} learnings</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 rounded-lg border border-border bg-primary/5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Learning System Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Interactions</div>
            <div className="text-lg font-semibold">
              {workerMetrics.reduce((sum, [_, m]) => sum + m.total_interactions, 0)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Success Patterns</div>
            <div className="text-lg font-semibold">
              {workerMetrics.reduce((sum, [_, m]) => sum + m.successful_patterns, 0)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Learnings</div>
            <div className="text-lg font-semibold">
              {workerMetrics.reduce((sum, [_, m]) => sum + m.learnings, 0)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg Approval</div>
            <div className="text-lg font-semibold">
              {((workerMetrics.reduce((sum, [_, m]) => sum + m.approval_rate, 0) / workerMetrics.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
