import { FileNode } from '@/types'

export const sampleFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'App.tsx',
        type: 'file',
        language: 'typescript',
        content: `import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold">Hello, Frankenstein!</h1>
      <p className="mt-4 text-gray-300">
        Welcome to your spooky coding environment 👻
      </p>
    </div>
  )
}
`
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'Button.tsx',
            type: 'file',
            language: 'typescript',
            content: `interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all'
  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-purple-500 hover:bg-purple-600 text-white'
  }

  return (
    <button
      onClick={onClick}
      className={\`\${baseStyles} \${variantStyles[variant]}\`}
    >
      {children}
    </button>
  )
}
`
          },
          {
            name: 'Card.tsx',
            type: 'file',
            language: 'typescript',
            content: `interface CardProps {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gray-800 border border-orange-500/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-orange-500 mb-4">{title}</h3>
      <div className="text-gray-300">{children}</div>
    </div>
  )
}
`
          }
        ]
      },
      {
        name: 'styles',
        type: 'folder',
        children: [
          {
            name: 'globals.css',
            type: 'file',
            language: 'css',
            content: `body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: #0a0a0f;
  color: #e0e0e0;
}

h1, h2, h3 {
  color: #f97316;
}

.spooky-glow {
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}
`
          }
        ]
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      {
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Frankenstein AI</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "frankenstein-app",
  "version": "1.0.0",
  "description": "A spooky coding project",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
`
  },
  {
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# Frankenstein AI Project

Welcome to your horror-themed development environment!

## Features
- 👻 Annabelle - Frontend specialist
- 🔪 Chucky - Backend specialist
- 😈 Freddy - Fullstack specialist

## Getting Started
Select an agent and start coding!
`
  }
]

export function flattenFiles(nodes: FileNode[], path = ''): Map<string, FileNode> {
  const map = new Map<string, FileNode>()

  for (const node of nodes) {
    const fullPath = path ? `${path}/${node.name}` : node.name

    if (node.type === 'file') {
      map.set(fullPath, node)
    }

    if (node.children) {
      const childMap = flattenFiles(node.children, fullPath)
      childMap.forEach((value, key) => map.set(key, value))
    }
  }

  return map
}
