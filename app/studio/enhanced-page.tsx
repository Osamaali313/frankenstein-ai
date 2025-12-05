'use client'

import { useState } from 'react'
import { EnhancedFileTree } from '@/components/studio/EnhancedFileTree'
import { CommandPalette } from '@/components/studio/CommandPalette'
import { ToastSystem } from '@/components/studio/ToastSystem'
import { StatusBar } from '@/components/studio/StatusBar'
import { MonacoEditor } from '@/components/editor/MonacoEditor'
import { ChatPanel } from '@/components/chat/ChatPanel'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { Agent } from '@/types'

const AGENTS: Agent[] = [
  {
    id: 'annabelle',
    name: 'Annabelle',
    icon: '👻',
    specialty: 'Frontend Specialist',
    description: 'A creepy doll obsessed with pixel-perfect UI/UX',
    expertise: ['React', 'CSS', 'UI/UX', 'Animations', 'TypeScript'],
  },
  {
    id: 'chucky',
    name: 'Chucky',
    icon: '🔪',
    specialty: 'Backend Specialist',
    description: 'An aggressive killer doll focused on brutal performance',
    expertise: ['Python', 'FastAPI', 'Databases', 'APIs', 'Performance'],
  },
  {
    id: 'freddy',
    name: 'Freddy',
    icon: '😈',
    specialty: 'Fullstack Specialist',
    description: 'The nightmare developer who integrates everything',
    expertise: ['Fullstack', 'Integration', 'Real-time', 'Auth', 'Payments'],
  },
]

export default function EnhancedStudioPage() {
  const [isConnected, setIsConnected] = useState(true)
  const [currentFile, setCurrentFile] = useState('src/App.tsx')
  const [code, setCode] = useState(`// Welcome to Frankenstein.AI Studio
// Enhanced with professional UI components!

import React from 'react'

export function App() {
  return (
    <div className="app">
      <h1>Hello, Horror Dev Team! 👻</h1>
      <p>Start coding with your AI agents...</p>
    </div>
  )
}
`)

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Command Palette */}
      <CommandPalette />

      {/* Toast Notifications */}
      <ToastSystem />

      {/* Main Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File Tree */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <EnhancedFileTree />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-white/10 hover:bg-horror-purple-500/50 transition-colors" />

        {/* Editor */}
        <ResizablePanel defaultSize={50}>
          <MonacoEditor
            language="typescript"
            value={code}
            onChange={(value) => setCode(value || '')}
          />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-white/10 hover:bg-horror-purple-500/50 transition-colors" />

        {/* Chat */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <ChatPanel agents={AGENTS} />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <StatusBar
        isConnected={isConnected}
        currentFile={currentFile}
        errors={0}
        warnings={0}
        isProcessing={false}
      />
    </div>
  )
}
