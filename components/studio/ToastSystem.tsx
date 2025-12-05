'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    set((state) => ({ toasts: [...state.toasts, newToast] }))

    const duration = toast.duration || 4000
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

const toastConfig = {
  success: {
    icon: Check,
    color: 'from-green-600 to-emerald-600',
    borderColor: 'border-green-500/50',
  },
  error: {
    icon: X,
    color: 'from-red-600 to-rose-600',
    borderColor: 'border-red-500/50',
  },
  info: {
    icon: Info,
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/50',
  },
  warning: {
    icon: AlertTriangle,
    color: 'from-yellow-600 to-orange-600',
    borderColor: 'border-yellow-500/50',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const config = toastConfig[toast.type]
  const Icon = config.icon
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        w-96 p-4 rounded-xl border backdrop-blur-xl
        bg-black/90 ${config.borderColor}
        shadow-2xl
      `}
    >
      <div className="flex gap-3">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg
          bg-gradient-to-br ${config.color}
          flex items-center justify-center
        `}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm text-gray-400">{toast.message}</p>
          )}
        </div>

        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function ToastSystem() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper hook for easy usage
export function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
  }
}
