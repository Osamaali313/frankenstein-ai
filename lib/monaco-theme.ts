import type { editor } from 'monaco-editor'

export const frankensteinDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },

    // Keywords
    { token: 'keyword', foreground: 'A855F7', fontStyle: 'bold' },
    { token: 'keyword.control', foreground: 'EC4899' },

    // Strings
    { token: 'string', foreground: '34D399' },

    // Numbers
    { token: 'number', foreground: 'F59E0B' },

    // Functions
    { token: 'function', foreground: '60A5FA' },
    { token: 'support.function', foreground: '60A5FA' },

    // Variables
    { token: 'variable', foreground: 'E5E7EB' },
    { token: 'variable.parameter', foreground: 'FCA5A5' },

    // Types
    { token: 'type', foreground: '22D3EE' },
    { token: 'type.identifier', foreground: '22D3EE' },

    // Operators
    { token: 'operator', foreground: 'EC4899' },

    // Classes
    { token: 'class', foreground: 'A78BFA' },

    // Constants
    { token: 'constant', foreground: 'F59E0B' },

    // Tags (HTML/JSX)
    { token: 'tag', foreground: 'EC4899' },
    { token: 'tag.attribute', foreground: 'A855F7' },

    // Punctuation
    { token: 'delimiter', foreground: '9CA3AF' },
    { token: 'delimiter.bracket', foreground: 'EC4899' },
  ],
  colors: {
    // Editor
    'editor.background': '#000000',
    'editor.foreground': '#E5E7EB',
    'editorCursor.foreground': '#A855F7',
    'editor.lineHighlightBackground': '#1F2937',
    'editorLineNumber.foreground': '#4B5563',
    'editorLineNumber.activeForeground': '#A855F7',

    // Selection
    'editor.selectionBackground': '#A855F720',
    'editor.selectionHighlightBackground': '#A855F710',
    'editor.inactiveSelectionBackground': '#A855F710',

    // Find/Match
    'editor.findMatchBackground': '#EC489950',
    'editor.findMatchHighlightBackground': '#EC489920',

    // Gutter
    'editorGutter.background': '#000000',
    'editorGutter.addedBackground': '#34D399',
    'editorGutter.deletedBackground': '#EF4444',
    'editorGutter.modifiedBackground': '#F59E0B',

    // Minimap
    'minimap.background': '#000000',
    'minimap.selectionHighlight': '#A855F7',
    'minimap.findMatchHighlight': '#EC4899',

    // Scrollbar
    'scrollbar.shadow': '#00000050',
    'scrollbarSlider.background': '#A855F720',
    'scrollbarSlider.hoverBackground': '#A855F730',
    'scrollbarSlider.activeBackground': '#A855F740',

    // Suggest widget
    'editorSuggestWidget.background': '#1F2937',
    'editorSuggestWidget.border': '#374151',
    'editorSuggestWidget.foreground': '#E5E7EB',
    'editorSuggestWidget.selectedBackground': '#A855F730',

    // Bracket matching
    'editorBracketMatch.background': '#A855F720',
    'editorBracketMatch.border': '#A855F7',

    // Whitespace
    'editorWhitespace.foreground': '#374151',

    // Indent guide
    'editorIndentGuide.background': '#374151',
    'editorIndentGuide.activeBackground': '#4B5563',
  }
}

// Apply theme function
export function applyMonacoTheme(monaco: any) {
  monaco.editor.defineTheme('frankenstein-dark', frankensteinDarkTheme)
  monaco.editor.setTheme('frankenstein-dark')
}
