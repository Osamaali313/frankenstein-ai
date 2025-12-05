'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Plus,
  MoreVertical,
  FileCode
} from 'lucide-react'
import {
  SiTypescript, SiJavascript, SiPython, SiReact,
  SiHtml5, SiCss3, SiJson
} from 'react-icons/si'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Button } from '@/components/ui/button'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  modified?: boolean
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()

  const iconMap: Record<string, any> = {
    ts: <SiTypescript className="w-4 h-4 text-blue-400" />,
    tsx: <SiTypescript className="w-4 h-4 text-blue-400" />,
    js: <SiJavascript className="w-4 h-4 text-yellow-400" />,
    jsx: <SiJavascript className="w-4 h-4 text-yellow-400" />,
    py: <SiPython className="w-4 h-4 text-blue-300" />,
    html: <SiHtml5 className="w-4 h-4 text-orange-400" />,
    css: <SiCss3 className="w-4 h-4 text-blue-400" />,
    json: <SiJson className="w-4 h-4 text-yellow-300" />,
  }

  return iconMap[ext || ''] || <FileCode className="w-4 h-4 text-gray-400" />
}

interface FileTreeNodeProps {
  node: FileNode
  level: number
  selectedId: string | null
  onSelect: (id: string) => void
}

function FileTreeNode({ node, level, selectedId, onSelect }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const isSelected = selectedId === node.id

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(node.id)
    }
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
              transition-colors relative group
              ${isSelected ? 'bg-horror-purple-500/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Chevron for folders */}
            {node.type === 'folder' && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}

            {/* Icon */}
            {node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-horror-purple-400" />
              ) : (
                <Folder className="w-4 h-4 text-horror-purple-400" />
              )
            ) : (
              getFileIcon(node.name)
            )}

            {/* Name */}
            <span className="text-sm flex-1 truncate">
              {node.name}
            </span>

            {/* Modified indicator */}
            {node.modified && (
              <div className="w-2 h-2 rounded-full bg-horror-purple-400" />
            )}

            {/* Hover actions */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1"
                >
                  {node.type === 'folder' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                layoutId="selectedFile"
                className="absolute left-0 top-0 bottom-0 w-1 bg-horror-purple-500 rounded-r"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48 bg-black/95 backdrop-blur-xl border-white/10">
          <ContextMenuItem className="text-white hover:bg-white/10">
            Rename
          </ContextMenuItem>
          <ContextMenuItem className="text-white hover:bg-white/10">
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem className="text-white hover:bg-white/10">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Children */}
      <AnimatePresence>
        {node.type === 'folder' && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <FileTreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function EnhancedFileTree() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const files: FileNode[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          children: [
            { id: '3', name: 'App.tsx', type: 'file', modified: true },
            { id: '4', name: 'Button.tsx', type: 'file' },
          ]
        },
        { id: '5', name: 'index.tsx', type: 'file' },
        { id: '6', name: 'styles.css', type: 'file' },
      ]
    },
    {
      id: '7',
      name: 'public',
      type: 'folder',
      children: [
        { id: '8', name: 'index.html', type: 'file' },
      ]
    },
    { id: '9', name: 'package.json', type: 'file' },
    { id: '10', name: 'README.md', type: 'file' },
  ]

  return (
    <div className="h-full flex flex-col bg-black/50 border-r border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-medium text-white">Explorer</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
        {files.map((node) => (
          <FileTreeNode
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ))}
      </div>
    </div>
  )
}
