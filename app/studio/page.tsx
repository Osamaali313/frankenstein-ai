'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FileTree } from '@/components/editor/FileTree'
import { MonacoEditor } from '@/components/editor/MonacoEditor'
import { ChatPanel, Document } from '@/components/chat/ChatPanel'
import { LearningDashboard } from '@/components/learning/LearningDashboard'
import { CodeExecutor } from '@/components/studio/CodeExecutor'
import { DocumentCanvas } from '@/components/studio/DocumentCanvas'
import { SandpackPreview } from '@/components/studio/SandpackPreview'
import { FileNode, Agent } from '@/types'
import { sampleFiles, flattenFiles } from '@/lib/file-system'
import { Code2, MessageSquare, FolderTree, X, Sparkles, Brain, Play, Save, Eye, Plus } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { ModeToggle } from '@/components/studio/ModeToggle'
import { ModelSelector } from '@/components/studio/ModelSelector'
import { AgentAvatar } from '@/components/studio/AgentAvatar'
import { useEffect } from 'react'

// Removed HorrorCardSlider import - not needed

const AGENTS: Agent[] = [
  {
    id: 'pinhead',
    name: 'PinHead',
    icon: '/halloween-assets/trick-treat2-img.png',
    specialty: 'Digital CTO',
    description: 'Strategic technical leader who generates PRDs, Requirements, and Vibe Prompts',
    expertise: ['Product Strategy', 'Requirements', 'Technical Planning', 'Architecture', 'Documentation'],
  },
  {
    id: 'annabelle',
    name: 'Annabelle',
    icon: '/halloween-assets/new1-img.png',
    specialty: 'Frontend Specialist',
    description: 'A creepy doll obsessed with pixel-perfect UI/UX and beautiful designs',
    expertise: ['React', 'CSS', 'UI/UX', 'Animations', 'TypeScript', 'Accessibility'],
  },
  {
    id: 'chucky',
    name: 'Chucky',
    icon: '/halloween-assets/new2-img.png',
    specialty: 'Backend Specialist',
    description: 'An aggressive killer doll focused on brutal performance and APIs',
    expertise: ['Python', 'FastAPI', 'Databases', 'APIs', 'Performance', 'Security'],
  },
  {
    id: 'jason',
    name: 'Jason',
    icon: '/halloween-assets/new4-img.png',
    specialty: 'Business Analyst',
    description: 'The silent slasher who cuts through ambiguity to define requirements',
    expertise: ['Requirements', 'User Stories', 'Edge Cases', 'Acceptance Criteria', 'Process Mapping'],
  },
  {
    id: 'pennywise',
    name: 'Pennywise',
    icon: '/halloween-assets/new5-img.png',
    specialty: 'Testing Specialist',
    description: 'The dancing clown who finds bugs where you least expect them',
    expertise: ['Testing', 'QA', 'Jest', 'Cypress', 'Debugging', 'TDD', 'E2E Testing'],
  },
  {
    id: 'ghostface',
    name: 'Ghostface',
    icon: '/halloween-assets/new6-img.png',
    specialty: 'Security Expert',
    description: 'Hunts down vulnerabilities and security flaws before attackers do',
    expertise: ['Security', 'Auth', 'Encryption', 'Pentesting', 'OWASP', 'XSS', 'SQL Injection'],
  },
  {
    id: 'valak',
    name: 'Valak',
    icon: '/halloween-assets/trick-treat1-img.png',
    specialty: 'Project Manager',
    description: 'The demonic nun who asks the hard questions and keeps projects on track',
    expertise: ['Project Planning', 'Agile', 'Risk Management', 'Stakeholder Communication', 'Sprint Planning'],
  },
]

export default function StudioPage() {
  const { toast } = useToast()
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [fileSystem, setFileSystem] = useState<FileNode[]>([])
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [selectedFilePath, setSelectedFilePath] = useState<string>('')
  const [openFiles, setOpenFiles] = useState<FileNode[]>([])
  const [showFileTree, setShowFileTree] = useState(true)
  const [showChat, setShowChat] = useState(true)
  const [showExecutor, setShowExecutor] = useState(true)
  const [showLearningDashboard, setShowLearningDashboard] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [mode, setMode] = useState<'agentic' | 'solo'>('agentic')
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-20250514')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [allProjectFiles, setAllProjectFiles] = useState<Record<string, string>>({})
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const fileMap = flattenFiles(fileSystem)

  // Auto-create project on mount (in-memory, no backend needed)
  useEffect(() => {
    if (!currentProject && !isCreatingProject) {
      setIsCreatingProject(true)

      // Generate unique project ID based on timestamp
      const timestamp = Date.now()
      const projectId = `project-${timestamp}`

      console.log('✅ Created in-memory project:', projectId)
      setCurrentProject(projectId)
      setIsCreatingProject(false)
    }
  }, [])

  // Load project structure when project is selected
  // Disabled - no backend needed, files created by AI will be added dynamically
  // useEffect(() => {
  //   if (currentProject) {
  //     loadProjectStructure()
  //   }
  // }, [currentProject])

  // Load all project files when file system changes (for preview)
  useEffect(() => {
    if (fileSystem.length > 0) {
      const files: Record<string, string> = {}

      // Recursively collect all files from in-memory fileSystem
      const collectFiles = (nodes: FileNode[], currentPath: string = ''): void => {
        for (const node of nodes) {
          const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
          if (node.type === 'file') {
            files[`/${nodePath}`] = node.content || ''
          } else if (node.type === 'folder' && node.children) {
            collectFiles(node.children, nodePath)
          }
        }
      }

      collectFiles(fileSystem)
      setAllProjectFiles(files)
    } else {
      setAllProjectFiles({})
    }
  }, [fileSystem, selectedFile])

  // Check for initial prompt from landing page
  useEffect(() => {
    const storedPrompt = sessionStorage.getItem('initialPrompt')
    console.log('Studio: Checking for initial prompt:', { storedPrompt, currentProject })
    if (storedPrompt && currentProject) {
      console.log('✅ Studio: Setting initial prompt:', storedPrompt)
      // Clear the stored prompt
      sessionStorage.removeItem('initialPrompt')

      // Set it to state so ChatPanel can use it
      setInitialPrompt(storedPrompt)

      // Show a welcome notification
      toast({
        title: '🧟 Ready to Code!',
        description: 'Your workspace is ready. Let\'s bring your idea to life!',
      })
    }
  }, [currentProject, toast])

  // Removed loadProjectStructure - no backend needed, files are created in-memory by AI

  const getLanguageFromExtension = (ext: string): string => {
    const map: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.html': 'html',
      '.css': 'css',
      '.json': 'json',
      '.md': 'markdown'
    }
    return map[ext] || 'plaintext'
  }

  const handleFileSelect = async (file: FileNode, filePath?: string) => {
    if (file.type === 'file') {
      // Files are already in memory, no backend needed
      const path = filePath || file.name
      setSelectedFile(file)
      setSelectedFilePath(path)
      setHasUnsavedChanges(false)

      if (!openFiles.find((f) => f.name === file.name)) {
        setOpenFiles([...openFiles, file])
      }
    }
  }

  const handleSaveFile = async () => {
    if (!selectedFile || !selectedFilePath) return

    // Save in-memory (no backend needed)
    setHasUnsavedChanges(false)
    toast({
      title: '💾 Saved',
      description: `${selectedFile.name} saved in memory`
    })
  }

  const handleEditorChange = (newContent: string) => {
    if (selectedFile) {
      setSelectedFile({
        ...selectedFile,
        content: newContent
      })
      setHasUnsavedChanges(true)
    }
  }

  // Collect all files for preview (Sandpack) - in-memory only
  const getAllProjectFiles = (): Record<string, string> => {
    const files: Record<string, string> = {}

    // Recursively collect all files from in-memory fileSystem
    const collectFiles = (nodes: FileNode[], currentPath: string = ''): void => {
      for (const node of nodes) {
        const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
        if (node.type === 'file') {
          files[`/${nodePath}`] = node.content || ''
        } else if (node.type === 'folder' && node.children) {
          collectFiles(node.children, nodePath)
        }
      }
    }

    collectFiles(fileSystem)

    return files
  }

  const handleCloseTab = (file: FileNode) => {
    const newOpenFiles = openFiles.filter((f) => f.name !== file.name)
    setOpenFiles(newOpenFiles)
    if (selectedFile?.name === file.name) {
      setSelectedFile(newOpenFiles[newOpenFiles.length - 1] || null)
    }
  }

  const handleAgentSelect = useCallback((agentId: string) => {
    setSelectedAgent(agentId)

    const agent = AGENTS.find(a => a.id === agentId)
    if (agent) {
      toast({
        title: `${agent.icon} ${agent.name} Selected`,
        description: agent.description,
      })
    }
  }, [toast])

  const handleDocumentsGenerated = useCallback(async (docs: Document[]) => {
    console.log('📄 Documents generated:', docs.map(d => d.type))

    setDocuments(docs)

    toast({
      title: '✨ Documents Created',
      description: `PinHead generated ${docs.length} document(s) for you`,
    })
  }, [toast])

  const currentFilePath = Array.from(fileMap.entries()).find(
    ([_, node]) => node === selectedFile
  )?.[0]

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-linear-to-r from-[#4A7A3D] to-[#7A7A3D]">
      {/* Floating Halloween decorations */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 z-0 opacity-10 pointer-events-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/home1-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 md:w-28 md:h-28 z-0 opacity-10 pointer-events-none"
        animate={{
          y: [0, 12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Image
          src="/trick-treat6-img.png"
          alt="Halloween decoration"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Frankenstein AI Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-[#FA6D1B] to-[#F25C07]">
                FRANKENSTEIN<span className="text-[#FA6D1B]">.AI</span>
              </h1>
            </div>
            <span className="text-sm text-gray-400">Horror Agent Studio</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <ModeToggle mode={mode} onModeChange={setMode} />

            {/* Divider */}
            <div className="h-8 w-px bg-white/10" />

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 text-sm rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 border border-white/10"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="px-3 py-1.5 text-sm rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 border border-white/10"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>

            {/* Save Button */}
            {selectedFile && (
              <button
                onClick={handleSaveFile}
                disabled={!hasUnsavedChanges}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 border ${
                  hasUnsavedChanges
                    ? 'bg-[#FA6D1B] hover:bg-[#F25C07] text-white border-[#FA6D1B]'
                    : 'bg-white/5 text-white/50 border-white/10 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {hasUnsavedChanges ? 'Save' : 'Saved'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Loading overlay while creating project */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FA6D1B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">🧟 Preparing Your Workspace...</h2>
            <p className="text-[#FA6D1B]">Setting up your coding environment</p>
          </div>
        </div>
      )}

      {/* Learning Dashboard Modal */}
      {showLearningDashboard && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-2xl">
            <LearningDashboard onClose={() => setShowLearningDashboard(false)} />
          </div>
        </div>
      )}

      {/* 3D Scene Modal removed - not needed */}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        {showFileTree && (
          <div className="w-64 flex-shrink-0 border-r border-white/10 bg-black/30 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">FILES</h3>
                <button
                  onClick={() => {
                    const fileName = prompt('Enter file name (e.g., App.tsx):')
                    if (fileName) {
                      const newFile: FileNode = {
                        name: fileName,
                        type: 'file',
                        content: `// ${fileName}\n\n`
                      }
                      setFileSystem([...fileSystem, newFile])
                      handleFileSelect(newFile)
                      toast({
                        title: 'File Created',
                        description: `${fileName} has been created`
                      })
                    }
                  }}
                  className="p-1 text-[#FA6D1B] hover:bg-white/10 rounded"
                  title="New File"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {fileSystem.length > 0 ? (
                <FileTree
                  nodes={fileSystem}
                  onFileSelect={(file) => handleFileSelect(file)}
                  selectedPath={selectedFilePath}
                />
              ) : (
                <div className="text-sm text-gray-400 space-y-3">
                  <p>No files yet</p>
                  <button
                    onClick={() => {
                      const defaultFiles: FileNode[] = [
                        {
                          name: 'App.tsx',
                          type: 'file',
                          content: `import React from 'react'

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#FA6D1B', fontSize: '2.5rem' }}>
        🧟 Frankenstein.AI
      </h1>
      <p style={{ color: '#666', marginTop: '1rem' }}>
        Start building with your horror AI agents!
      </p>
      <button
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#FA6D1B',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
        onClick={() => alert('Hello from Frankenstein.AI!')}
      >
        Click Me
      </button>
    </div>
  )
}`
                        },
                        {
                          name: 'index.tsx',
                          type: 'file',
                          content: `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`
                        }
                      ]
                      setFileSystem(defaultFiles)
                      handleFileSelect(defaultFiles[0])
                      toast({
                        title: 'Starter Files Created',
                        description: 'Created React starter files - click Preview to see them!'
                      })
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#FA6D1B] hover:bg-[#F25C07] text-white rounded transition-colors"
                  >
                    Create Starter Files
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editor + Preview Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Open Files Tabs */}
          {openFiles.length > 0 && (
            <div className="flex items-center gap-1 px-4 py-2 bg-black/30 border-b border-white/10 overflow-x-auto">
              {openFiles.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-sm cursor-pointer transition-colors ${
                    selectedFile?.name === file.name
                      ? 'bg-black/40 text-white border-t border-l border-r border-white/10'
                      : 'bg-black/20 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <Code2 className="w-3 h-3" />
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloseTab(file)
                    }}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor or Preview */}
          <div className="flex-1 overflow-hidden">
            {showPreview && fileSystem.length > 0 ? (
              <div className="h-full p-4">
                <SandpackPreview
                  files={allProjectFiles}
                  activeFile={selectedFilePath}
                  showEditor={false}
                  onClose={() => setShowPreview(false)}
                />
              </div>
            ) : selectedFile ? (
              <MonacoEditor
                value={selectedFile.content || ''}
                language={getLanguageFromExtension(selectedFile.name.split('.').pop() || '')}
                onChange={handleEditorChange}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-black/20">
                <div className="text-center text-gray-400 max-w-md">
                  <Code2 className="w-20 h-20 mx-auto mb-6 opacity-20" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Welcome to Frankenstein.AI Studio
                  </h2>
                  <p className="mb-6">
                    Create files or chat with an AI agent to get started
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowFileTree(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FolderTree className="w-4 h-4" />
                      Show Files
                    </button>
                    <button
                      onClick={() => setShowChat(true)}
                      className="px-4 py-2 bg-[#FA6D1B] hover:bg-[#F25C07] text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Open Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-96 flex-shrink-0 border-l border-white/10 bg-black/40 backdrop-blur-sm">
            <ChatPanel
              agents={AGENTS}
              selectedAgentId={selectedAgent}
              onDocumentsGenerated={handleDocumentsGenerated}
              mode={mode}
              initialMessage={initialPrompt || undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}
