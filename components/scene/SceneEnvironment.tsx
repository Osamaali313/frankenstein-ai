'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

export function SceneEnvironment() {
  const smogRef = useRef<THREE.Points>(null)

  // Generate dense smog particles
  const smogCount = 1500
  const smogParticles = useMemo(() => {
    const positions = new Float32Array(smogCount * 3)
    const velocities = new Float32Array(smogCount * 3)
    const sizes = new Float32Array(smogCount)

    for (let i = 0; i < smogCount; i++) {
      // Distributed throughout the scene
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 15 - 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40

      // Slow drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = Math.random() * 0.005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // Large sizes for fog effect
      sizes[i] = Math.random() * 1.5 + 0.8
    }

    return { positions, velocities, sizes }
  }, [])

  // Animate smog drifting
  useFrame((state) => {
    if (!smogRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = smogRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < smogCount; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      // Drift motion
      positions[i3] += smogParticles.velocities[i3]
      positions[i3 + 1] += smogParticles.velocities[i3 + 1]
      positions[i3 + 2] += smogParticles.velocities[i3 + 2]

      // Swirling motion
      positions[i3] += Math.sin(time * 0.3 + y) * 0.008
      positions[i3 + 2] += Math.cos(time * 0.3 + x) * 0.008

      // Reset if too far
      const distance = Math.sqrt(x * x + z * z)
      if (distance > 25 || y > 15) {
        positions[i3] = (Math.random() - 0.5) * 30
        positions[i3 + 1] = Math.random() * 10 - 3
        positions[i3 + 2] = (Math.random() - 0.5) * 30
      }
    }

    smogRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      {/* Enhanced horror fog */}
      <fog attach="fog" args={['#120a0f', 3, 25]} />

      {/* HDR environment for reflections */}
      <Environment preset="night" />

      {/* Dark horror ground with blood tint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#1a0a0f"
          roughness={0.9}
          metalness={0.1}
          emissive="#2a0000"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Blood pool effect on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.98, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial
          color="#4a0000"
          roughness={0.3}
          metalness={0.6}
          emissive="#8B0000"
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Dense smog particles */}
      <points ref={smogRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={smogCount}
            args={[smogParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={smogCount}
            args={[smogParticles.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          color="#3a2a3f"
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Eerie ambient glow from below */}
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#4a0000" distance={15} />
      <pointLight position={[5, 0, 5]} intensity={0.3} color="#2a1a4f" distance={12} />
      <pointLight position={[-5, 0, -5]} intensity={0.3} color="#1a4a2a" distance={12} />
    </>
  )
}
