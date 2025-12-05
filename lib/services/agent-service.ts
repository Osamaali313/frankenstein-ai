export interface AgentMessage {
  content: string
  agent?: string
}

export interface AgentResponse {
  type: 'thinking' | 'response' | 'error'
  agent?: string
  message?: string
  content?: string
}

export interface CodeBlock {
  language: string
  code: string
  filename?: string
}

export class AgentService {
  /**
   * Extract code blocks from agent response
   */
  static extractCodeBlocks(content: string): CodeBlock[] {
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g
    const blocks: CodeBlock[] = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1]
      const code = match[2].trim()

      // Try to infer filename from code
      const filename = this.inferFilename(code, language)

      blocks.push({
        language,
        code,
        filename
      })
    }

    return blocks
  }

  /**
   * Infer filename from code content
   */
  private static inferFilename(code: string, language: string): string {
    // Look for export statements
    const exportMatch = code.match(/export\s+(?:default\s+)?(?:function|class|const)\s+(\w+)/)
    if (exportMatch) {
      const name = exportMatch[1]
      return `${name}.${this.getFileExtension(language)}`
    }

    // Look for component names
    const componentMatch = code.match(/(?:function|const)\s+(\w+Component|\w+Page)/)
    if (componentMatch) {
      const name = componentMatch[1]
      return `${name}.${this.getFileExtension(language)}`
    }

    // Default naming
    return `generated-${Date.now()}.${this.getFileExtension(language)}`
  }

  /**
   * Get file extension for language
   */
  private static getFileExtension(language: string): string {
    const extensionMap: Record<string, string> = {
      typescript: 'tsx',
      tsx: 'tsx',
      ts: 'ts',
      javascript: 'jsx',
      jsx: 'jsx',
      js: 'js',
      python: 'py',
      css: 'css',
      html: 'html',
      json: 'json',
      markdown: 'md',
    }

    return extensionMap[language.toLowerCase()] || 'txt'
  }

  /**
   * Format message for sending to backend
   */
  static formatMessage(content: string, agent?: string): AgentMessage {
    return {
      content,
      agent
    }
  }

  /**
   * Parse backend response
   */
  static parseResponse(data: any): AgentResponse {
    return {
      type: data.type || 'response',
      agent: data.agent,
      message: data.message,
      content: data.content || data.response
    }
  }
}
