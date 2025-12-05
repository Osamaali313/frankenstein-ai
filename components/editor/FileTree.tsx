'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react'
import { FileNode } from '@/types'
import { cn } from '@/lib/utils'

interface FileTreeProps {
  nodes: FileNode[]
  onFileSelect: (file: FileNode) => void
  selectedPath?: string
}

interface TreeNodeProps {
  node: FileNode
  level: number
  path: string
  onFileSelect: (file: FileNode) => void
  selectedPath?: string
}

function TreeNode({ node, level, path, onFileSelect, selectedPath }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
  const currentPath = path ? `${path}/${node.name}` : node.name
  const isSelected = currentPath === selectedPath

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect(node)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors',
          isSelected && 'bg-primary/10 border-l-2 border-primary',
          'text-sm'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#FA6D1B]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#FA6D1B]" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}

        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-[#FA6D1B] flex-shrink-0" />
        ) : (
          <File className="w-4 h-4 text-[#FA6D1B] flex-shrink-0" />
        )}

        <span className={cn(
          'truncate',
          node.type === 'folder' ? 'text-white font-medium' : 'text-[#FA6D1B]',
          isSelected && 'text-[#FA6D1B] font-semibold'
        )}>
          {node.name}
        </span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${currentPath}/${child.name}-${index}`}
              node={child}
              level={level + 1}
              path={currentPath}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({ nodes, onFileSelect, selectedPath }: FileTreeProps) {
  return (
    <div className="w-full h-full overflow-auto bg-background border-r border-border">
      <div className="py-2">
        {nodes.map((node, index) => (
          <TreeNode
            key={`${node.name}-${index}`}
            node={node}
            level={0}
            path=""
            onFileSelect={onFileSelect}
            selectedPath={selectedPath}
          />
        ))}
      </div>
    </div>
  )
}
