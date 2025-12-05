'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Agent } from '@/types'

interface AgentCharacterProps {
  agent: Agent
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
}

export function AgentCharacter({ agent, position, isSelected, onSelect }: AgentCharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Floating animation
  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.3
  })

  const modelId = getSketchfabModelId(agent.id)
  const characterConfig = getCharacterConfig(agent.id)

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow ring */}
      {(isSelected || hovered) && (
        <mesh scale={3} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.08, 16, 100]} />
          <meshBasicMaterial
            color={characterConfig.emissive}
            transparent
            opacity={isSelected ? 0.7 : 0.4}
          />
        </mesh>
      )}

      {/* 3D Model Container - Fixed positioning */}
      <Html
        position={[0, 1, 0]}
        center
        distanceFactor={8}
        style={{
          width: '500px',
          height: '500px',
          pointerEvents: 'auto',
        }}
        transform
        occlude={false}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            overflow: 'hidden',
            border: isSelected
              ? `5px solid ${characterConfig.emissive}`
              : hovered
              ? `3px solid ${characterConfig.emissive}80`
              : '2px solid rgba(255,255,255,0.2)',
            boxShadow: isSelected
              ? `0 0 50px ${characterConfig.emissive}`
              : hovered
              ? `0 0 30px ${characterConfig.emissive}80`
              : '0 0 15px rgba(0,0,0,0.8)',
            transition: 'all 0.3s ease',
            transform: isSelected ? 'scale(1.1)' : hovered ? 'scale(1.05)' : 'scale(1)',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <iframe
            src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&autospin=0.2&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_loading=0&transparent=1&preload=1`}
            title={`${agent.name} 3D Model`}
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              pointerEvents: 'none',
            }}
          />
          {/* Black overlay to hide bottom UI/watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, #000000, transparent)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </div>
      </Html>

      {/* Sparkles effect */}
      {(isSelected || hovered) && (
        <Sparkles
          count={100}
          scale={5}
          size={4}
          speed={isSelected ? 2 : 1}
          color={characterConfig.emissive}
        />
      )}

      {/* Point light from character */}
      <pointLight
        position={[0, 1, 0]}
        intensity={isSelected ? 4 : hovered ? 2 : 1}
        color={characterConfig.emissive}
        distance={10}
      />

      {/* Name label with glow */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.6}
        color={isSelected ? characterConfig.emissive : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={isSelected ? 0.08 : 0.04}
        outlineColor={characterConfig.emissive}
      >
        {agent.icon} {agent.name}
      </Text>

      {/* Selection indicator - spinning rings */}
      {isSelected && (
        <>
          <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2, 2.4, 64]} />
            <meshBasicMaterial
              color={characterConfig.emissive}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 2, 64]} />
            <meshBasicMaterial
              color={characterConfig.color}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  )
}

// Get Sketchfab model ID for each agent
function getSketchfabModelId(agentId: string): string {
  switch (agentId) {
    case 'annabelle':
      return '406d089005a24dc18d814d885bb6d3a9' // Annabelle Doll
    case 'chucky':
      return '0f9b68ca815a4970854745a9f43e2130' // Real-Time Chucky
    case 'freddy':
      return '288e93f07684496a8ff8fbf60f6d9d75' // Freddy Krueger Bust
    default:
      return '406d089005a24dc18d814d885bb6d3a9'
  }
}

// Character-specific color configurations
function getCharacterConfig(agentId: string) {
  switch (agentId) {
    case 'annabelle':
      return {
        color: '#C084FC', // Bright purple
        emissive: '#A855F7',
      }
    case 'chucky':
      return {
        color: '#F87171', // Bright red
        emissive: '#EF4444',
      }
    case 'freddy':
      return {
        color: '#34D399', // Eerie green
        emissive: '#10B981',
      }
    default:
      return {
        color: '#FB923C',
        emissive: '#F97316',
      }
  }
}
