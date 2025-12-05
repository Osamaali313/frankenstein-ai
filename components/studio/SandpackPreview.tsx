'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackPreviewComponent,
  SandpackConsole,
  SandpackFileExplorer,
  useSandpack
} from '@codesandbox/sandpack-react'
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Terminal,
  Eye,
  Code2,
  FileCode,
  X,
  Play,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SandpackPreviewProps {
  files: Record<string, string>
  activeFile?: string
  language?: string
  showEditor?: boolean
  onClose?: () => void
}

type ViewMode = 'preview' | 'console' | 'split'

export function SandpackPreview({
  files,
  activeFile = '/App.js',
  language = 'javascript',
  showEditor = false,
  onClose
}: SandpackPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [showFileExplorer, setShowFileExplorer] = useState(false)

  // Determine template based on files and language
  const template = useMemo(() => {
    // Check if it's a React project
    if (language === 'tsx' || language === 'jsx' ||
        Object.keys(files).some(f => f.endsWith('.tsx') || f.endsWith('.jsx'))) {
      return 'react-ts'
    }

    // Check if it's a Vue project
    if (Object.keys(files).some(f => f.endsWith('.vue'))) {
      return 'vue-ts'
    }

    // Check if it's vanilla JS/TS
    if (language === 'typescript' || Object.keys(files).some(f => f.endsWith('.ts'))) {
      return 'vanilla-ts'
    }

    // Default to vanilla JS
    return 'vanilla'
  }, [files, language])

  // Prepare files for Sandpack
  const sandpackFiles = useMemo(() => {
    const preparedFiles: Record<string, { code: string; active?: boolean }> = {}

    Object.entries(files).forEach(([path, content]) => {
      // Ensure path starts with /
      const normalizedPath = path.startsWith('/') ? path : `/${path}`

      preparedFiles[normalizedPath] = {
        code: content,
        active: normalizedPath === activeFile
      }
    })

    // Add default files if not present
    if (template.includes('react')) {
      // Add index.html if not present
      if (!preparedFiles['/index.html']) {
        preparedFiles['/index.html'] = {
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frankenstein.AI Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
        }
      }

      // Add index.js/tsx if not present
      if (!preparedFiles['/index.tsx'] && !preparedFiles['/index.js']) {
        const indexFile = template === 'react-ts' ? '/index.tsx' : '/index.js'
        preparedFiles[indexFile] = {
          code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
        }
      }

      // Add App.tsx/jsx if not present and no other component files
      const hasComponentFiles = Object.keys(preparedFiles).some(
        f => f.endsWith('.tsx') || f.endsWith('.jsx')
      )

      if (!hasComponentFiles) {
        const appFile = template === 'react-ts' ? '/App.tsx' : '/App.jsx'
        preparedFiles[appFile] = {
          code: `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🧟 Frankenstein.AI</h1>
      <p>Your React app is ready!</p>
    </div>
  );
}`,
          active: true
        }
      }
    }

    return preparedFiles
  }, [files, template, activeFile])

  // Custom theme matching Frankenstein.AI
  const customTheme = {
    colors: {
      surface1: '#0a0a0a',
      surface2: '#1a1a1a',
      surface3: '#2a2a2a',
      clickable: '#FA6D1B',
      base: '#808080',
      disabled: '#4d4d4d',
      hover: '#FA6D1B',
      accent: '#FA6D1B',
      error: '#ff6b6b',
      errorSurface: '#2d1515',
    },
    syntax: {
      plain: '#ffffff',
      comment: '#757575',
      keyword: '#FA6D1B',
      tag: '#4A7A3D',
      punctuation: '#ffffff',
      definition: '#6CB6FF',
      property: '#FA6D1B',
      static: '#FB8500',
      string: '#4A7A3D',
    },
    font: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      mono: '"Fira Code", "Cascadia Code", Consolas, monospace',
      size: '14px',
      lineHeight: '1.6',
    },
  }

  return (
    <div
      className={cn(
        'bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none'
      )}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#FA6D1B]" />
          <span className="text-sm font-semibold text-white">Live Preview</span>
          <span className="text-xs text-[#FA6D1B] bg-black/50 px-2 py-0.5 rounded border border-white/10">
            {template}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
                viewMode === 'preview'
                  ? 'bg-[#FA6D1B] text-white'
                  : 'text-[#FA6D1B] hover:bg-white/5'
              )}
              title="Preview only"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('console')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
                viewMode === 'console'
                  ? 'bg-[#FA6D1B] text-white'
                  : 'text-[#FA6D1B] hover:bg-white/5'
              )}
              title="Console only"
            >
              <Terminal className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
                viewMode === 'split'
                  ? 'bg-[#FA6D1B] text-white'
                  : 'text-[#FA6D1B] hover:bg-white/5'
              )}
              title="Split view"
            >
              <Code2 className="w-3 h-3" />
            </button>
          </div>

          {/* File Explorer Toggle */}
          {showEditor && (
            <button
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className={cn(
                'p-1.5 rounded transition-colors',
                showFileExplorer
                  ? 'bg-[#FA6D1B] text-white'
                  : 'text-[#FA6D1B] hover:bg-white/5'
              )}
              title="Toggle file explorer"
            >
              <FileCode className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#FA6D1B] hover:bg-white/5 rounded transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-white hover:bg-red-500/20 rounded transition-colors"
              title="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sandpack Container */}
      <div className={cn(
        'overflow-hidden',
        isFullscreen ? 'h-[calc(100vh-48px)]' : 'h-96'
      )}>
        <SandpackProvider
          template={template}
          files={sandpackFiles}
          theme={customTheme}
          options={{
            autorun: true,
            autoReload: true,
            recompileMode: 'delayed',
            recompileDelay: 300
          }}
          customSetup={{
            dependencies: {}
          }}
        >
          <SandpackLayout>
            {/* Editor Section */}
            {showEditor && (
              <div className="flex h-full">
                {showFileExplorer && (
                  <div className="w-48 border-r border-white/10 overflow-y-auto">
                    <SandpackFileExplorer />
                  </div>
                )}
                <div className="flex-1">
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers
                    showInlineErrors
                    wrapContent
                  />
                </div>
              </div>
            )}

            {/* Preview/Console Section */}
            {viewMode === 'preview' && (
              <SandpackPreviewComponent
                showNavigator
                showRefreshButton
                showOpenInCodeSandbox={false}
              />
            )}

            {viewMode === 'console' && (
              <SandpackConsole
                showHeader
                showSyntaxError
              />
            )}

            {viewMode === 'split' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 border-b border-white/10">
                  <SandpackPreviewComponent
                    showNavigator
                    showRefreshButton
                    showOpenInCodeSandbox={false}
                  />
                </div>
                <div className="h-48">
                  <SandpackConsole
                    showHeader
                    showSyntaxError
                  />
                </div>
              </div>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1.5 bg-black/50 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-white/60">
            {Object.keys(sandpackFiles).length} file(s)
          </span>
          <span className="text-[#FA6D1B]">
            Ready
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Powered by Sandpack</span>
        </div>
      </div>
    </div>
  )
}
