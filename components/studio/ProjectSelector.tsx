'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectService } from '@/lib/services/project-service'

interface ProjectSelectorProps {
  onProjectSelected: (projectId: string) => void
  onClose?: () => void
}

export function ProjectSelector({ onProjectSelected, onClose }: ProjectSelectorProps) {
  const [projectName, setProjectName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectId.trim()) {
      setError('Please enter both project name and ID')
      return
    }

    // Validate project ID (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(projectId)) {
      setError('Project ID can only contain lowercase letters, numbers, and hyphens')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const result = await ProjectService.createProject(projectId, projectName)

      if (result.success) {
        // Initialize Git for the project
        await ProjectService.initGit(projectId)

        onProjectSelected(projectId)
        if (onClose) onClose()
      } else {
        setError(result.error || 'Failed to create project')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const handleQuickStart = async (template: string) => {
    const templates: Record<string, { name: string; id: string }> = {
      'react': { name: 'React App', id: 'react-horror-app' },
      'python': { name: 'Python Project', id: 'python-horror-project' },
      'nextjs': { name: 'Next.js App', id: 'nextjs-horror-app' }
    }

    const selected = templates[template]
    if (selected) {
      setProjectName(selected.name)
      setProjectId(selected.id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FolderPlus className="w-8 h-8 text-[#FA6D1B]" />
                Create Horror Project
              </h2>
              <p className="text-sm text-[#FA6D1B] mt-1">
                Start a new coding nightmare with Frankenstein.AI
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Start Templates */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Start Templates</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickStart('react')}
                className="p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-[#FA6D1B]/10 hover:border-[#FA6D1B]/50 transition-all text-center"
              >
                <div className="text-2xl mb-2">⚛️</div>
                <div className="text-sm font-medium text-white">React</div>
                <div className="text-xs text-[#FA6D1B] mt-1">Frontend App</div>
              </button>

              <button
                onClick={() => handleQuickStart('python')}
                className="p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-[#FA6D1B]/10 hover:border-[#FA6D1B]/50 transition-all text-center"
              >
                <div className="text-2xl mb-2">🐍</div>
                <div className="text-sm font-medium text-white">Python</div>
                <div className="text-xs text-[#FA6D1B] mt-1">Backend Project</div>
              </button>

              <button
                onClick={() => handleQuickStart('nextjs')}
                className="p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-[#FA6D1B]/10 hover:border-[#FA6D1B]/50 transition-all text-center"
              >
                <div className="text-2xl mb-2">▲</div>
                <div className="text-sm font-medium text-white">Next.js</div>
                <div className="text-xs text-[#FA6D1B] mt-1">Full-stack</div>
              </button>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Horror App"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-[#FA6D1B]/60 focus:outline-none focus:ring-2 focus:ring-[#FA6D1B]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Project ID
                <span className="text-xs text-[#FA6D1B] ml-2">
                  (lowercase, hyphens only)
                </span>
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="my-horror-app"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-[#FA6D1B]/60 focus:outline-none focus:ring-2 focus:ring-[#FA6D1B] font-mono"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Create Button */}
          <Button
            onClick={handleCreateProject}
            disabled={isCreating || !projectName.trim() || !projectId.trim()}
            className="w-full bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Project...
              </>
            ) : (
              <>
                <FolderPlus className="w-5 h-5 mr-2" />
                Create Project Workspace
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#FA6D1B]">
            🎃 Your project will be created with Git initialized and ready for horror coding
          </p>
        </div>
      </motion.div>
    </div>
  )
}
