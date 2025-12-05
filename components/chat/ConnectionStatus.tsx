'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectionStatusProps {
  isConnected: boolean
  error?: string | null
}

export function ConnectionStatus({ isConnected, error }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
          isConnected
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        )}
      >
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Disconnected</span>
          </>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  )
}
