'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Code2, FileCode } from 'lucide-react'

interface MarkdownMessageProps {
  content: string
  createdFiles?: Array<{ filename: string; language: string }>
}

export function MarkdownMessage({ content, createdFiles = [] }: MarkdownMessageProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          // Headers with horror theme
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-primary mb-4 border-b border-primary/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-primary/90 mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-primary/80 mb-2 mt-4">
              {children}
            </h3>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-foreground/90 mb-3 leading-relaxed">
              {children}
            </p>
          ),

          // Strong/Bold with horror glow
          strong: ({ children }) => (
            <strong className="font-bold text-primary">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-primary/80">
              {children}
            </em>
          ),

          // Inline code with horror theme
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            // For code blocks, show file creation indicator instead
            const language = match[1]
            const codeString = String(children).replace(/\n$/, '')
            const createdFile = createdFiles.find(f => f.language === language)

            if (createdFile) {
              return (
                <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-primary/20 p-2">
                        <FileCode className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary mb-1">
                        File Created
                      </p>
                      <code className="text-xs text-foreground/70 font-mono">
                        {createdFile.filename}
                      </code>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {language}
                    </div>
                  </div>
                </div>
              )
            }

            // Fallback: show syntax highlighted code
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-border/50 shadow-lg shadow-primary/5">
                <div className="bg-muted/50 px-4 py-2 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {language}
                    </span>
                  </div>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  className="!bg-background/50 !m-0"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            )
          },

          // Lists with horror styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/80 ml-4">
              {children}
            </li>
          ),

          // Links with horror glow on hover
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic text-foreground/70 my-4 bg-primary/5 py-2 rounded-r">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-primary/20" />
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border/50 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/30">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-primary">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-foreground/80">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
