'use client'

import { useState } from 'react'
import { Play, Square, Terminal, Eye, Code2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SandpackPreview } from './SandpackPreview'

interface CodeExecutorProps {
  code: string
  language: string
  filename?: string
  allFiles?: Record<string, string>
}

type ExecutionTab = 'output' | 'preview'

export function CodeExecutor({ code, language, filename, allFiles }: CodeExecutorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<ExecutionTab>('output')

  // Determine if language supports live preview with Sandpack
  const supportsPreview = ['html', 'javascript', 'typescript', 'css', 'jsx', 'tsx'].includes(language.toLowerCase())

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('')
    setError('')

    try {
      if (supportsPreview) {
        // For web technologies, we'll use client-side execution
        setActiveTab('preview')
      } else {
        // For backend languages, send to backend for execution
        const response = await fetch('http://localhost:8000/api/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            language,
            filename,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setOutput(data.output)
          setActiveTab('output')
        } else {
          setError(data.error || 'Execution failed')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code')
    } finally {
      setIsRunning(false)
    }
  }

  const handleStop = () => {
    setIsRunning(false)
    // TODO: Implement stop execution via backend
  }

  return (
    <div className="flex flex-col h-full bg-black/30 backdrop-blur-sm border-t border-white/10">
      {/* Execution Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FA6D1B]" />
          <span className="text-sm font-semibold text-white">Code Execution</span>
          {filename && (
            <span className="text-xs text-[#FA6D1B] bg-black/50 px-2 py-1 rounded border border-white/10">
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Toggle */}
          {supportsPreview && (
            <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('output')}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors flex items-center gap-1',
                  activeTab === 'output'
                    ? 'bg-[#FA6D1B] text-white'
                    : 'text-[#FA6D1B] hover:bg-white/5'
                )}
              >
                <Code2 className="w-3 h-3" />
                Output
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors flex items-center gap-1',
                  activeTab === 'preview'
                    ? 'bg-[#FA6D1B] text-white'
                    : 'text-[#FA6D1B] hover:bg-white/5'
                )}
              >
                <Eye className="w-3 h-3" />
                Preview
              </button>
            </div>
          )}

          {/* Run/Stop Button */}
          {!isRunning ? (
            <Button
              onClick={handleRun}
              size="sm"
              className="bg-[#4A7A3D] hover:bg-[#3A6A2D] text-white"
              disabled={!code.trim()}
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Execution Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'output' && (
          <div className="h-full overflow-auto p-4">
            {isRunning ? (
              <div className="flex items-center gap-3 text-[#FA6D1B]">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#FA6D1B] border-t-transparent"></div>
                <span className="text-sm">Executing code...</span>
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400 mb-1">Execution Error</p>
                  <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            ) : output ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#4A7A3D]" />
                  <span className="text-sm font-semibold text-white">Output:</span>
                </div>
                <pre className="text-sm text-white font-mono bg-black/50 p-4 rounded-lg border border-white/10 overflow-x-auto">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal className="w-12 h-12 text-[#FA6D1B]/50 mb-3" />
                <p className="text-white font-semibold mb-1">Ready to Execute</p>
                <p className="text-sm text-[#FA6D1B]">
                  Click the Run button to execute your code
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && supportsPreview && (
          <SandpackPreview
            files={{
              [filename || '/App.jsx']: code,
              ...(allFiles || {})
            }}
            activeFile={filename || '/App.jsx'}
            language={language}
            showEditor={false}
          />
        )}
      </div>
    </div>
  )
}
