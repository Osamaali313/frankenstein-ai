'use client'

import { Vortex } from '@/components/ui/vortex'
import { ReactNode } from 'react'

interface VortexSectionProps {
  children: ReactNode
  id?: string
  className?: string
}

export function VortexSection({ children, id, className }: VortexSectionProps) {
  return (
    <section id={id} className="relative min-h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={300}
        baseHue={270}
        className={`flex items-center justify-center w-full min-h-screen ${className || ''}`}
      >
        {children}
      </Vortex>
    </section>
  )
}
