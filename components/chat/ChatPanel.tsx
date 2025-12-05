'use client'

import { useState, useCallback } from 'react'
import { Agent, Message } from '@/types'
import { AgentCard } from './AgentCard'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ConnectionStatus } from './ConnectionStatus'
import { AgentService } from '@/lib/services/agent-service'
import { useToast } from '@/lib/hooks/use-toast'
import { WorkflowStatus } from './WorkflowStatus'
import { AgentCommunicationPanel, AgentMessage } from './AgentCommunicationPanel'
import { AgentAvatar } from '@/components/studio/AgentAvatar'
import { MessageCircle, Users, ChevronDown } from 'lucide-react'

export interface Document {
  type: 'prd' | 'requirements' | 'vibe-prompt'
  content: string
}

// Extract documents from PinHead's response
function extractDocuments(content: string): Document[] {
  const documents: Document[] = []

  console.log('🔍 Extracting documents from response...')

  // Extract PRD - try multiple patterns
  const prdMatch = content.match(/```(?:markdown)?:?PRD\.md\n([\s\S]*?)\n```/) ||
                   content.match(/```markdown\s*:\s*PRD\.md\s*\n([\s\S]*?)\n```/)
  if (prdMatch) {
    console.log('✅ Found PRD')
    documents.push({
      type: 'prd',
      content: prdMatch[1].trim()
    })
  }

  // Extract Requirements - try multiple patterns
  const reqMatch = content.match(/```(?:markdown)?:?REQUIREMENTS\.md\n([\s\S]*?)\n```/) ||
                   content.match(/```markdown\s*:\s*REQUIREMENTS\.md\s*\n([\s\S]*?)\n```/)
  if (reqMatch) {
    console.log('✅ Found Requirements')
    documents.push({
      type: 'requirements',
      content: reqMatch[1].trim()
    })
  }

  // Extract Vibe Prompt - try multiple patterns (markdown format)
  const vibeMatch = content.match(/```(?:markdown)?:?VIBE_PROMPT\.md\n([\s\S]*?)\n```/) ||
                    content.match(/```markdown\s*:\s*VIBE_PROMPT\.md\s*\n([\s\S]*?)\n```/)
  if (vibeMatch) {
    console.log('✅ Found Vibe Prompt')
    documents.push({
      type: 'vibe-prompt',
      content: vibeMatch[1].trim()
    })
  }

  console.log(`📊 Extracted ${documents.length} document(s):`, documents.map(d => d.type))

  return documents
}

interface ChatPanelProps {
  agents: Agent[]
  selectedAgentId?: string | null
  onDocumentsGenerated?: (documents: Document[]) => void
  mode?: 'agentic' | 'solo'
  initialMessage?: string
}

export function ChatPanel({ agents, selectedAgentId, onDocumentsGenerated, mode = 'agentic', initialMessage }: ChatPanelProps) {
  const { toast } = useToast()

  // Auto-select first agent (Annabelle) by default
  const [internalSelectedAgent, setInternalSelectedAgent] = useState<Agent | null>(
    agents.length > 0 ? agents[0] : null
  )

  // Use the selectedAgentId prop if provided, otherwise use internal state
  const selectedAgent = selectedAgentId
    ? agents.find(a => a.id === selectedAgentId) || internalSelectedAgent
    : internalSelectedAgent

  const setSelectedAgent = (agent: Agent | null) => {
    setInternalSelectedAgent(agent)
  }
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [messageFiles, setMessageFiles] = useState<Map<string, Array<{ filename: string; language: string }>>>(new Map())

  // Agent Communication State
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const [chatView, setChatView] = useState<'messages' | 'communication'>('messages')
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false)

  // Connection state (always connected for direct API)
  const [isConnected, setIsConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Orchestration auto-enabled in Agentic mode, disabled in Solo mode
  const orchestrationEnabled = mode === 'agentic'
  const [workflowPhase, setWorkflowPhase] = useState<string>('')
  const [iterationCount, setIterationCount] = useState(0)
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'needs_work' | 'rejected'>('pending')
  const [currentWorkflowAgent, setCurrentWorkflowAgent] = useState<string>('')

  const agentIcons = agents.reduce((acc, agent) => {
    acc[agent.id] = agent.icon
    return acc
  }, {} as Record<string, string>)

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedAgent) {
      toast({
        title: '⚠️ No Agent Selected',
        description: 'Please select an agent first',
        variant: 'destructive'
      })
      return
    }

    // Add user message to UI
    const timestamp = Date.now()
    const userMessage: Message = {
      id: `user-${timestamp}`,
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsThinking(true)

    // Create placeholder for agent response
    const agentMessageId = `agent-${timestamp}`
    let agentContent = ''

    setMessages(prev => [...prev, {
      id: agentMessageId,
      role: 'agent' as const,
      agent: selectedAgent.id as any,
      content: '',
      timestamp: new Date()
    }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages
            .filter(m => m.content && m.content.trim().length > 0) // Filter out empty messages
            .map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const event = JSON.parse(data)

              if (event.type === 'content_delta') {
                // Update message with streaming text
                const delta = event.data?.delta
                if (delta?.type === 'text_delta' && delta.text) {
                  agentContent += delta.text
                  setMessages(prev => prev.map(m =>
                    m.id === agentMessageId
                      ? { ...m, content: agentContent }
                      : m
                  ))
                }
              } else if (event.type === 'docs_generation_started') {
                // Doc generation has started!
                console.log('📝 Doc generation started!')

                // Stop showing "thinking" indicator
                setIsThinking(false)

                // Update chat to show generation status
                let cleanMessage = agentContent
                  .replace(/\[GENERATE_DOCS\][\s\S]*?\[\/GENERATE_DOCS\]/g, '')
                  .trim()
                cleanMessage += '\n\n⏳ Summoning the documentation scribes...'

                setMessages(prev => prev.map(m =>
                  m.id === agentMessageId
                    ? { ...m, content: cleanMessage }
                    : m
                ))
              } else if (event.type === 'docs_content_delta') {
                // Doc Generator is streaming content!
                const fullContent = event.data?.fullContent || ''

                // Extract and update documents in real-time
                const documents = extractDocuments(fullContent)
                if (documents.length > 0 && onDocumentsGenerated) {
                  console.log(`📝 Streaming... ${documents.length} document(s) updating`)
                  onDocumentsGenerated(documents)
                }
              } else if (event.type === 'docs_generated') {
                // Doc Generator has completed!
                console.log('📄 Doc generation complete!')
                const docContent = event.data?.content || ''

                // Final extraction
                const documents = extractDocuments(docContent)
                if (documents.length > 0 && onDocumentsGenerated) {
                  console.log(`✅ Final: ${documents.length} document(s) completed`)
                  onDocumentsGenerated(documents)

                  // Remove [GENERATE_DOCS] tags from chat display
                  let cleanMessage = agentContent
                    .replace(/\[GENERATE_DOCS\][\s\S]*?\[\/GENERATE_DOCS\]/g, '')
                    .trim()

                  // Add completion message
                  cleanMessage += '\n\n✨ The documentation scribes have completed their work. Your comprehensive documents await in the canvas.'

                  // Update the message
                  setMessages(prev => prev.map(m =>
                    m.id === agentMessageId
                      ? { ...m, content: cleanMessage }
                      : m
                  ))
                }
              } else if (event.type === 'message_stop') {
                // Clean up [GENERATE_DOCS] tags if still visible
                if (agentContent.includes('[GENERATE_DOCS]')) {
                  let cleanMessage = agentContent
                    .replace(/\[GENERATE_DOCS\][\s\S]*?\[\/GENERATE_DOCS\]/g, '')
                    .trim()

                  setMessages(prev => prev.map(m =>
                    m.id === agentMessageId
                      ? { ...m, content: cleanMessage }
                      : m
                  ))
                }
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', parseError)
            }
          }
        }
      }

      setIsThinking(false)
    } catch (err) {
      console.error('Chat error:', err)
      setIsThinking(false)
      setError(err instanceof Error ? err.message : 'Unknown error')

      toast({
        title: '❌ Error',
        description: err instanceof Error ? err.message : 'Failed to communicate with AI',
        variant: 'destructive'
      })

      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent' as const,
          agent: selectedAgent.id as any,
          content: `❌ **Error**: ${err instanceof Error ? err.message : 'An error occurred'}\n\nPlease try again.`,
          timestamp: new Date()
        }
      ])
    }
  }, [selectedAgent, messages, toast, onDocumentsGenerated])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Agent Selection */}
      {!selectedAgent ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">
              👻 Choose Your Horror Agent
            </h2>
            <ConnectionStatus isConnected={isConnected} error={error} />
          </div>
          <div className="grid gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={setSelectedAgent}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Agent Header */}
          <div className="border-b border-white/10 p-4 bg-black/40 backdrop-blur-sm">
            {/* Agent Selector - Dropdown in Solo mode, Static in Agentic mode */}
            <div className="relative">
              <button
                onClick={() => mode === 'solo' && setIsAgentDropdownOpen(!isAgentDropdownOpen)}
                disabled={mode === 'agentic'}
                className={`w-full flex items-center justify-between gap-3 p-3 bg-black/50 rounded-lg border border-white/10 transition-colors ${
                  mode === 'solo' ? 'hover:bg-black/60 cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <AgentAvatar
                      src={selectedAgent.icon}
                      alt={selectedAgent.name}
                      status={error ? 'idle' : isConnected ? 'active' : 'thinking'}
                      size="md"
                    />
                    {/* Connection Status Indicator */}
                    <div className="absolute -bottom-1 -right-1">
                      <div className={`w-4 h-4 rounded-full border-2 border-black ${
                        error ? 'bg-red-500' : isConnected ? 'bg-green-500' : 'bg-orange-500'
                      } shadow-lg`}>
                        {isConnected && !error && (
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-white">{selectedAgent.name}</h3>
                    <p className="text-xs text-[#FA6D1B]">{selectedAgent.specialty}</p>
                  </div>
                </div>
                {mode === 'solo' && (
                  <ChevronDown className={`w-4 h-4 text-[#FA6D1B] transition-transform ${isAgentDropdownOpen ? 'rotate-180' : ''}`} />
                )}
                {mode === 'agentic' && (
                  <span className="text-xs text-[#FA6D1B] px-2 py-1 bg-black/50 rounded-md border border-white/5">
                    Auto-Routing
                  </span>
                )}
              </button>

              {/* Dropdown Menu - Only in Solo Mode */}
              {mode === 'solo' && isAgentDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsAgentDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => {
                          setSelectedAgent(agent)
                          setMessages([])
                          setIsAgentDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                          selectedAgent.id === agent.id ? 'bg-[#FA6D1B]/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AgentAvatar
                            src={agent.icon}
                            alt={agent.name}
                            status={selectedAgent.id === agent.id ? 'active' : 'idle'}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">{agent.name}</span>
                              {selectedAgent.id === agent.id && (
                                <span className="text-xs text-[#FA6D1B]">✓ Active</span>
                              )}
                            </div>
                            <span className="text-xs text-[#FA6D1B]">{agent.specialty}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Workflow Status */}
          {orchestrationEnabled && workflowPhase && (
            <WorkflowStatus
              phase={workflowPhase}
              iterationCount={iterationCount}
              reviewStatus={reviewStatus}
              currentAgent={currentWorkflowAgent}
              agentIcon={agents.find(a => a.id === currentWorkflowAgent)?.icon || '👻'}
            />
          )}

          {/* Agent Status Dashboard - Removed (not needed) */}

          {/* Messages */}
          <MessageList
            messages={messages}
            agentIcons={agentIcons}
            isThinking={isThinking}
            createdFiles={messageFiles}
          />

          {/* Input */}
          <MessageInput
            onSend={handleSendMessage}
            disabled={!isConnected || isThinking}
            placeholder={
              !isConnected
                ? "Connecting to backend..."
                : isThinking
                  ? "Agent is thinking..."
                  : `Ask ${selectedAgent.name} for help...`
            }
            initialValue={initialMessage}
          />
        </>
      )}
    </div>
  )
}
