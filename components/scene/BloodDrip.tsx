'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BloodDrip() {
  const particlesRef = useRef<THREE.Points>(null)

  // Generate blood drip particles
  const particleCount = 300
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Random positions across the top
      positions[i * 3] = (Math.random() - 0.5) * 30 // X
      positions[i * 3 + 1] = 12 + Math.random() * 5 // Y (top)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 // Z

      // Drip velocities
      velocities[i] = 0.02 + Math.random() * 0.04

      // Variable sizes
      sizes[i] = Math.random() * 0.4 + 0.2

      // Variable opacity
      opacities[i] = Math.random() * 0.6 + 0.3
    }

    return { positions, velocities, sizes, opacities }
  }, [])

  // Animate blood drips falling
  useFrame(() => {
    if (!particlesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const y = positions[i3 + 1]

      // Fall down
      positions[i3 + 1] -= particles.velocities[i]

      // Reset to top when reaching bottom
      if (y < -5) {
        positions[i3] = (Math.random() - 0.5) * 30
        positions[i3 + 1] = 12 + Math.random() * 5
        positions[i3 + 2] = (Math.random() - 0.5) * 30
      }

      // Slight side drift
      positions[i3] += Math.sin(y * 0.5) * 0.01
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#8B0000"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
