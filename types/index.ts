// Agent ID types
export type AgentId = 'annabelle' | 'chucky' | 'freddy' | 'jason' | 'pennywise' | 'ghostface' | 'valak' | 'pinhead' | 'samara' | 'jigsaw'

// Message types
export interface Message {
  id: string
  role: 'user' | 'agent'
  agent?: AgentId
  content: string
  timestamp: Date
}

// Agent types
export interface Agent {
  id: AgentId
  name: string
  icon: string
  specialty: string
  description: string
  expertise: string[]
}

// File system types
export interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  language?: string
  content?: string
}

// Agent definitions
export const agents: Agent[] = [
  {
    id: 'annabelle',
    name: 'Annabelle',
    icon: '👻',
    specialty: 'Frontend & UI/UX',
    description: 'The possessed doll obsessed with perfect design',
    expertise: ['React', 'Next.js', 'CSS', 'Tailwind', 'UI/UX', 'Animations']
  },
  {
    id: 'chucky',
    name: 'Chucky',
    icon: '🔪',
    specialty: 'Backend & Performance',
    description: 'The killer who destroys bugs and optimizes code',
    expertise: ['FastAPI', 'Databases', 'Performance', 'APIs', 'Security']
  },
  {
    id: 'freddy',
    name: 'Freddy',
    icon: '😈',
    specialty: 'Fullstack & Complex Features',
    description: 'The nightmare developer who builds while you sleep',
    expertise: ['Fullstack', 'Integrations', 'Real-time', 'Auth', 'Payments']
  }
]
