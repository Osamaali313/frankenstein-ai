'use client'

import { useState, useCallback } from 'react'
import ProfileCard from './ProfileCard'
import { Agent } from '@/types'

interface HorrorCardSliderProps {
  agents: Agent[]
  selectedAgent: string | null
  onSelectAgent: (agentId: string) => void
}

const HORROR_AGENT_CONFIG = {
  annabelle: {
    name: 'Annabelle',
    title: 'The Possessed Doll',
    handle: 'cursed_code',
    status: 'Waiting in the shadows...',
    behindGlowColor: 'rgba(168, 85, 247, 0.8)',
    innerGradient: 'linear-gradient(145deg, #7c3aed44 0%, #a855f788 100%)',
    avatarUrl: '/agents/anabelle.jpg',
    icon: '👻'
  },
  chucky: {
    name: 'Chucky',
    title: 'The Killer Doll',
    handle: 'play_time',
    status: 'Ready to slice bugs...',
    behindGlowColor: 'rgba(239, 68, 68, 0.8)',
    innerGradient: 'linear-gradient(145deg, #ef444444 0%, #dc262688 100%)',
    avatarUrl: '/agents/CHUCKY.jpg',
    icon: '🔪'
  },
  freddy: {
    name: 'Freddy',
    title: 'The Nightmare Coder',
    handle: 'dream_debugger',
    status: 'Coding in your dreams...',
    behindGlowColor: 'rgba(16, 185, 129, 0.8)',
    innerGradient: 'linear-gradient(145deg, #10b98144 0%, #059669 88 100%)',
    avatarUrl: '/agents/freddy.jpg',
    icon: '😈'
  },
  jason: {
    name: 'Jason',
    title: 'The Business Analyst',
    handle: 'requirements_slasher',
    status: 'Cutting through ambiguity...',
    behindGlowColor: 'rgba(59, 130, 246, 0.8)',
    innerGradient: 'linear-gradient(145deg, #3b82f644 0%, #2563eb88 100%)',
    avatarUrl: '/agents/jason.jpg',
    icon: '🪓'
  },
  pennywise: {
    name: 'Pennywise',
    title: 'The Testing Clown',
    handle: 'bug_hunter',
    status: 'Finding bugs in the sewers...',
    behindGlowColor: 'rgba(249, 115, 22, 0.8)',
    innerGradient: 'linear-gradient(145deg, #f9731644 0%, #ea580c88 100%)',
    avatarUrl: '/agents/pennywise.jpg',
    icon: '🤡'
  },
  ghostface: {
    name: 'Ghostface',
    title: 'The Security Hunter',
    handle: 'vuln_stalker',
    status: 'Hunting vulnerabilities...',
    behindGlowColor: 'rgba(107, 114, 128, 0.8)',
    innerGradient: 'linear-gradient(145deg, #6b728044 0%, #4b556388 100%)',
    avatarUrl: '/agents/ghostface.jpg',
    icon: '👤'
  },
  valak: {
    name: 'Valak',
    title: 'The Demonic PM',
    handle: 'dark_planner',
    status: 'Orchestrating the nightmare...',
    behindGlowColor: 'rgba(75, 0, 130, 0.8)',
    innerGradient: 'linear-gradient(145deg, #4B008244 0%, #30005088 100%)',
    avatarUrl: '/agents/valak.jpg',
    icon: '📿'
  },
  pinhead: {
    name: 'Pinhead',
    title: 'The Cenobite CTO',
    handle: 'code_punisher',
    status: 'Reviewing with precision...',
    behindGlowColor: 'rgba(139, 69, 19, 0.8)',
    innerGradient: 'linear-gradient(145deg, #8B451344 0%, #5C350F88 100%)',
    avatarUrl: '/agents/pinhead.jpg',
    icon: '⛓️'
  }
}

export function HorrorCardSlider({ agents, selectedAgent, onSelectAgent }: HorrorCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0) // Start with first card (Annabelle)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleCardClick = useCallback(
    (agentId: string, index: number) => {
      if (isSelecting) return // Prevent double-clicks during selection

      if (index !== currentIndex) {
        // Rotate to clicked card
        setCurrentIndex(index)
      } else {
        // If clicking center card, select the agent and close modal
        setIsSelecting(true)
        onSelectAgent(agentId)
        // Modal will close, so no need to reset isSelecting
      }
    },
    [currentIndex, onSelectAgent, isSelecting]
  )

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex
    const absPosition = ((diff + agents.length) % agents.length)

    if (absPosition === 0) return 'center'
    if (absPosition === 1 || absPosition === agents.length - 1) return 'side'
    return 'hidden'
  }

  const getTransform = (index: number) => {
    const diff = index - currentIndex
    const position = ((diff + agents.length) % agents.length)

    if (position === 0) {
      // Center card - larger and more prominent
      return 'translateX(0) scale(1.15) translateZ(80px)'
    } else if (position === 1) {
      // Right card - more spacing
      return 'translateX(85%) scale(0.75) translateZ(-20px) rotateY(-20deg)'
    } else if (position === agents.length - 1) {
      // Left card - more spacing
      return 'translateX(-85%) scale(0.75) translateZ(-20px) rotateY(20deg)'
    }
    return 'translateX(200%) scale(0.6) translateZ(-100px)'
  }

  const getZIndex = (index: number) => {
    const position = getCardPosition(index)
    if (position === 'center') return 30
    if (position === 'side') return 20
    return 10
  }

  const getOpacity = (index: number) => {
    const position = getCardPosition(index)
    if (position === 'center') return 1
    if (position === 'side') return 0.7
    return 0
  }

  return (
    <div className="relative w-full h-full flex items-start justify-center overflow-hidden pt-16">
      {/* Blood splatter background decorations */}
      <div className="absolute top-20 left-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="20" r="18" fill="#8B0000" opacity="0.6" />
          <circle cx="40" cy="50" r="10" fill="#8B0000" opacity="0.4" />
          <circle cx="15" cy="55" r="6" fill="#8B0000" opacity="0.5" />
          <ellipse cx="30" cy="35" rx="15" ry="25" fill="#8B0000" opacity="0.3" transform="rotate(25 30 35)" />
        </svg>
      </div>
      <div className="absolute top-20 right-0 w-40 h-40 opacity-20 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="20" r="18" fill="#8B0000" opacity="0.6" />
          <circle cx="40" cy="50" r="10" fill="#8B0000" opacity="0.4" />
          <circle cx="15" cy="55" r="6" fill="#8B0000" opacity="0.5" />
          <ellipse cx="30" cy="35" rx="15" ry="25" fill="#8B0000" opacity="0.3" transform="rotate(25 30 35)" />
        </svg>
      </div>

      {/* Cards container */}
      <div className="relative w-full h-full flex items-start justify-center pt-4" style={{ perspective: '2000px' }}>
        {agents.map((agent, index) => {
          const config = HORROR_AGENT_CONFIG[agent.id as keyof typeof HORROR_AGENT_CONFIG]
          const position = getCardPosition(index)

          return (
            <div
              key={agent.id}
              className="absolute transition-all duration-700 ease-out"
              style={{
                transform: getTransform(index),
                zIndex: getZIndex(index),
                opacity: getOpacity(index),
                pointerEvents: position === 'hidden' ? 'none' : 'auto',
              }}
            >
              <ProfileCard
                avatarUrl={config.avatarUrl}
                miniAvatarUrl={config.avatarUrl}
                name={`${config.icon} ${config.name}`}
                title={config.title}
                handle={config.handle}
                status={config.status}
                contactText={isSelecting && index === currentIndex ? "Opening..." : "Let Me In"}
                behindGlowEnabled={index === currentIndex}
                behindGlowColor={config.behindGlowColor}
                behindGlowSize="60%"
                innerGradient={config.innerGradient}
                enableTilt={index === currentIndex && !isSelecting}
                enableMobileTilt={false}
                onContactClick={() => handleCardClick(agent.id, index)}
                className={index === currentIndex ? 'horror-card-active' : ''}
              />
            </div>
          )
        })}
      </div>

      {/* Bottom UI */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-4 z-40">
        <p className="text-3xl text-red-500 font-bold tracking-wide drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse">
          🎃 Choose Your Horror Agent 🎃
        </p>
        <p className="text-base text-white/90 font-medium tracking-wide drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]">
          Click "Let Me In" to unleash their dark coding power
        </p>
        {selectedAgent && (
          <p className="text-sm text-green-400 font-bold animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.7)]">
            ✓ Agent Selected - Close to Begin Coding
          </p>
        )}

        {/* Indicator dots */}
        <div className="flex gap-3 justify-center pt-2">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Select ${agent.name}`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
