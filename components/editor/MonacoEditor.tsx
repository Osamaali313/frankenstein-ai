'use client'

import { useState, useEffect } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { applyMonacoTheme } from '@/lib/monaco-theme'

interface MonacoEditorProps {
  file?: {
    name: string
    language: string
    content: string
  }
  language?: string
  value?: string
  onChange?: (value: string) => void
}

export function MonacoEditor({ file, language, value, onChange }: MonacoEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorWillMount = (monaco: Monaco) => {
    // Apply our custom Frankenstein Dark theme
    applyMonacoTheme(monaco)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={file?.language || language || 'typescript'}
        value={file?.content || value || ''}
        theme="frankenstein-dark"
        onChange={(value) => onChange?.(value || '')}
        beforeMount={handleEditorWillMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  )
}
