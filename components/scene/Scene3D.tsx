'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { AgentCharacter } from './AgentCharacter'
import { SceneEnvironment } from './SceneEnvironment'
import { ParticleSystem } from './ParticleSystem'
import { BloodDrip } from './BloodDrip'
import { Agent } from '@/types'
import * as THREE from 'three'

interface Scene3DProps {
  agents: Agent[]
  selectedAgent: string | null
  onSelectAgent: (agentId: string) => void
}

export function Scene3D({ agents, selectedAgent, onSelectAgent }: Scene3DProps) {
  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Dark horror gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-950/10 to-black" />

      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />

        {/* Dark Horror Lighting - Visible but Dramatic */}
        <ambientLight intensity={0.2} color="#1a0a1f" />
        <pointLight position={[10, 8, 10]} intensity={1.5} color="#F97316" castShadow />
        <pointLight position={[-10, -5, -10]} intensity={1.2} color="#A78BFA" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#10B981" />
        <spotLight
          position={[0, 20, 0]}
          angle={0.5}
          penumbra={1}
          intensity={1.5}
          castShadow
          color="#ff3333"
          distance={35}
        />
        {/* Additional fill lights for visibility */}
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8B0000" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#4a1a8f" />

        <Suspense fallback={null}>
          {/* Scene Environment (fog, smog, blood pool) */}
          <SceneEnvironment />

          {/* Agent Characters with Sketchfab Models */}
          {agents.map((agent, index) => (
            <AgentCharacter
              key={agent.id}
              agent={agent}
              position={getAgentPosition(index, agents.length)}
              isSelected={selectedAgent === agent.id}
              onSelect={() => onSelectAgent(agent.id)}
            />
          ))}

          {/* Horror Particle Effects */}
          <ParticleSystem />

          {/* Blood Dripping from Above */}
          <BloodDrip />
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Horror Post Processing - Balanced for Visibility */}
        <EffectComposer>
          <Bloom
            intensity={2.5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.6}
            blendFunction={BlendFunction.NORMAL}
          />
          <ChromaticAberration
            offset={[0.0015, 0.0015]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay - Horror Themed */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center space-y-3">
        <p className="text-2xl text-red-500 font-bold tracking-wide drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">
          🎃 Choose Your Horror Agent 🎃
        </p>
        <p className="text-sm text-white/80 font-medium tracking-wide drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
          Click a character to unleash their dark coding power
        </p>
        {selectedAgent && (
          <p className="text-xs text-green-400 font-bold animate-pulse drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
            ✓ Agent Selected - Close to Begin
          </p>
        )}
      </div>

      {/* Top instruction */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-white/60 font-medium uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
          Drag to Rotate • Scroll to Zoom • Click to Select
        </p>
      </div>

      {/* Blood splatter decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="20" r="15" fill="#8B0000" opacity="0.6" />
          <circle cx="35" cy="45" r="8" fill="#8B0000" opacity="0.4" />
          <circle cx="15" cy="50" r="5" fill="#8B0000" opacity="0.5" />
          <ellipse cx="25" cy="35" rx="12" ry="20" fill="#8B0000" opacity="0.3" transform="rotate(25 25 35)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-30 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="20" r="15" fill="#8B0000" opacity="0.6" />
          <circle cx="35" cy="45" r="8" fill="#8B0000" opacity="0.4" />
          <circle cx="15" cy="50" r="5" fill="#8B0000" opacity="0.5" />
          <ellipse cx="25" cy="35" rx="12" ry="20" fill="#8B0000" opacity="0.3" transform="rotate(25 25 35)" />
        </svg>
      </div>
    </div>
  )
}

// Helper: Calculate positions in a circle
function getAgentPosition(index: number, total: number): [number, number, number] {
  const radius = 5
  const angle = (index / total) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  return [x, 0, z]
}
