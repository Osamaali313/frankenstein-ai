'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, File, Code, Settings, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface Command {
  id: string
  label: string
  shortcut?: string
  icon: any
  category: string
  action: () => void
}

const commands: Command[] = [
  {
    id: 'new-file',
    label: 'New File',
    shortcut: '⌘N',
    icon: File,
    category: 'File',
    action: () => console.log('New file'),
  },
  {
    id: 'save-file',
    label: 'Save File',
    shortcut: '⌘S',
    icon: File,
    category: 'File',
    action: () => console.log('Save file'),
  },
  {
    id: 'toggle-chat',
    label: 'Toggle Chat',
    shortcut: '⌘\\',
    icon: Code,
    category: 'View',
    action: () => console.log('Toggle chat'),
  },
  {
    id: 'run-code',
    label: 'Run Code',
    shortcut: '⌘⏎',
    icon: Zap,
    category: 'Code',
    action: () => console.log('Run code'),
  },
  {
    id: 'settings',
    label: 'Settings',
    shortcut: '⌘,',
    icon: Settings,
    category: 'Settings',
    action: () => console.log('Settings'),
  },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }

      if (!open) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filteredCommands.length)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length)
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        filteredCommands[selectedIndex]?.action()
        setOpen(false)
        setSearch('')
      }

      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, selectedIndex, filteredCommands])

  useEffect(() => {
    if (open) {
      setSelectedIndex(0)
    }
  }, [search, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 bg-black/95 backdrop-blur-xl border-white/10 overflow-hidden">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="h-14 pl-12 pr-4 text-lg bg-transparent border-none focus-visible:ring-0 text-white placeholder-gray-500"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto border-t border-white/10">
          <AnimatePresence mode="wait">
            {filteredCommands.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-gray-500"
              >
                No commands found
              </motion.div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon
                  const isSelected = index === selectedIndex

                  return (
                    <motion.button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action()
                        setOpen(false)
                        setSearch('')
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-colors relative
                        ${isSelected ? 'bg-horror-purple-500/20 text-white' : 'text-gray-400 hover:bg-white/5'}
                      `}
                      whileHover={{ x: 4 }}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selectedCommand"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-horror-purple-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      <Icon className="w-5 h-5" />

                      <div className="flex-1">
                        <div className="font-medium">{cmd.label}</div>
                        <div className="text-xs text-gray-500">{cmd.category}</div>
                      </div>

                      {cmd.shortcut && (
                        <kbd className="px-2 py-1 text-xs rounded bg-white/10 text-gray-400 font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">esc</kbd>
              Close
            </span>
          </div>
          <span>⌘K to toggle</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
