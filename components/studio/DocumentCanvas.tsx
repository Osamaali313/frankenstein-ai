'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Code2, Copy, Download, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Document } from '@/components/chat/ChatPanel'
import Image from 'next/image'

interface DocumentCanvasProps {
  documents: Document[]
}

export function DocumentCanvas({ documents }: DocumentCanvasProps) {
  const [activeTab, setActiveTab] = useState<'prd' | 'requirements' | 'vibe-prompt'>('prd')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const tabs = [
    { id: 'prd' as const, label: 'PRD', icon: FileText, color: 'text-blue-400' },
    { id: 'requirements' as const, label: 'Requirements', icon: FileText, color: 'text-purple-400' },
    { id: 'vibe-prompt' as const, label: 'Vibe Prompt', icon: Code2, color: 'text-orange-400' },
  ]

  const currentDoc = documents.find(d => d.type === activeTab)

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    documents.forEach(doc => {
      const filename = doc.type === 'prd' ? 'PRD.md' :
                      doc.type === 'requirements' ? 'REQUIREMENTS.md' :
                      'VIBE_PROMPT.xml'
      handleDownload(doc.content, filename)
    })
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-black/20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mb-4"
          >
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src="/about-img.png"
                alt="No documents"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
          <p className="text-white text-lg font-semibold">No documents yet</p>
          <p className="text-sm text-[#FA6D1B] mt-2">
            Chat with PinHead to generate your PRD, Requirements, and Vibe Prompt
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black/30 backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            const hasDoc = documents.some(d => d.type === tab.id)

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!hasDoc}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FA6D1B] text-white shadow-lg shadow-[#FA6D1B]/30'
                    : hasDoc
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                {tab.label}
                {hasDoc && <div className="w-2 h-2 rounded-full bg-green-500" />}
              </button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => currentDoc && handleCopy(currentDoc.content, 0)}
            className="px-3 py-1.5 text-sm rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 border border-white/10"
          >
            {copiedIndex === 0 ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (currentDoc) {
                const filename = activeTab === 'prd' ? 'PRD.md' :
                                activeTab === 'requirements' ? 'REQUIREMENTS.md' :
                                'VIBE_PROMPT.md'
                handleDownload(currentDoc.content, filename)
              }
            }}
            className="px-3 py-1.5 text-sm rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 border border-white/10"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={downloadAll}
            className="px-3 py-1.5 text-sm rounded-md bg-[#FA6D1B] hover:bg-[#F25C07] text-white transition-colors flex items-center gap-2 border border-[#FA6D1B]"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentDoc && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-invert max-w-none"
          >
            {/* Markdown rendering for all documents including Vibe Prompt */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-white mb-6 border-b border-[#FA6D1B]/30 pb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-[#FA6D1B] mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300">
                        {children}
                      </li>
                    ),
                    code: ({ children, ...props }) => {
                      const isInline = !props.className
                      return isInline ? (
                        <code className="bg-[#FA6D1B]/20 text-[#FA6D1B] px-2 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-black/50 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-white/10">
                          {children}
                        </code>
                      )
                    },
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#FA6D1B] pl-4 italic text-gray-400 my-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {currentDoc.content}
                </ReactMarkdown>
              </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
