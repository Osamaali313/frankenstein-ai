'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { DatabaseService, Project } from '@/lib/services/database-service'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, FolderOpen, Trash2, Eye, Lock, Calendar, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/lib/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    if (user) {
      loadProjects()
    }
  }, [user, authLoading, router])

  const loadProjects = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await DatabaseService.getProjects(user.id)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      })
    } else {
      setProjects(data || [])
    }

    setLoading(false)
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newProjectName.trim()) return

    setCreating(true)

    const { data, error } = await DatabaseService.createProject({
      user_id: user.id,
      name: newProjectName,
      description: newProjectDescription,
      template_type: 'blank',
      is_public: false,
    })

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Project Created',
        description: `${newProjectName} is ready to go!`,
      })
      setShowCreateModal(false)
      setNewProjectName('')
      setNewProjectDescription('')
      loadProjects()

      if (data) {
        router.push(`/studio?project=${data.id}`)
      }
    }

    setCreating(false)
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This cannot be undone.`)) {
      return
    }

    const { error } = await DatabaseService.deleteProject(projectId)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Project Deleted',
        description: `${projectName} has been deleted`,
      })
      loadProjects()
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a1a] to-[#1a2a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FA6D1B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a1a] to-[#1a2a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FA6D1B] to-[#F25C07]">
                My Projects
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your AI-powered development projects
              </p>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-6 opacity-50">
              <Image
                src="/logo.png"
                alt="Frankenstein AI"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No projects yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first project to start building with AI agents
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#FA6D1B]/50 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FolderOpen className="w-8 h-8 text-[#FA6D1B]" />
                    <div className="flex items-center gap-2">
                      {project.is_public ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#FA6D1B] transition-colors">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => router.push(`/studio?project=${project.id}`)}
                      className="flex-1 bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white"
                    >
                      Open
                    </Button>
                    <Button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-[#FA6D1B]/0 to-[#F25C07]/0 group-hover:from-[#FA6D1B]/10 group-hover:to-[#F25C07]/10 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-black/95 to-[#1a1a1a]/95 border-[#FA6D1B]/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FA6D1B] to-[#F25C07]">
              Create New Project
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Project Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="My Awesome Project"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[#FA6D1B]"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description (Optional)
              </label>
              <Input
                id="description"
                type="text"
                placeholder="What are you building?"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 focus:border-[#FA6D1B]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setShowCreateModal(false)}
                variant="ghost"
                className="flex-1 text-gray-400 hover:text-white hover:bg-white/10"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating || !newProjectName.trim()}
                className="flex-1 bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white font-semibold"
              >
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
