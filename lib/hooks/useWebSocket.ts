'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface WebSocketHookOptions {
  url: string
  onMessage?: (data: any) => void
  onConnect?: () => void
  onDisconnect?: () => void
  reconnectInterval?: number
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  reconnectInterval = 3000
}: WebSocketHookOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const shouldReconnectRef = useRef(true)

  const connect = useCallback(() => {
    try {
      // Silently attempt to connect
      const ws = new WebSocket(url)

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (err) {
          // Silently ignore parse errors
        }
      }

      ws.onerror = (event) => {
        // Silently handle WebSocket errors - backend may not be running
        setError('Connection error')
      }

      ws.onclose = () => {
        setIsConnected(false)
        onDisconnect?.()

        // Only attempt reconnection if backend might be available
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      wsRef.current = ws
    } catch (err) {
      // Silently handle connection failures
      setError('Failed to connect')
    }
  }, [url, onMessage, onConnect, onDisconnect, reconnectInterval])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }, [])

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      wsRef.current.send(message)
      return true
    } else {
      // Silently fail if not connected
      setError('Not connected')
      return false
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return {
    isConnected,
    error,
    sendMessage,
    reconnect: connect,
    disconnect
  }
}
