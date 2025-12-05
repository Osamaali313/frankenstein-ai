'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null)

  // Generate EPIC horror particles with MORE blood
  const particleCount = 3000
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution with closer particles
      const radius = 6 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      // Enhanced horror color palette - MORE BLOOD RED
      const colorChoice = Math.random()
      if (colorChoice < 0.35) {
        // BLOOD RED (increased probability)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.1
        colors[i * 3 + 2] = 0.1
      } else if (colorChoice < 0.55) {
        // DARK RED
        colors[i * 3] = 0.7
        colors[i * 3 + 1] = 0
        colors[i * 3 + 2] = 0
      } else if (colorChoice < 0.7) {
        // Purple
        colors[i * 3] = 0.7
        colors[i * 3 + 1] = 0.3
        colors[i * 3 + 2] = 1
      } else if (colorChoice < 0.85) {
        // Eerie Green
        colors[i * 3] = 0.2
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 0.4
      } else {
        // Orange flames
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.5
        colors[i * 3 + 2] = 0
      }

      // Variable sizes - more variation
      sizes[i] = Math.random() * 0.2 + 0.05

      // Slow drift velocities with more chaos
      velocities[i * 3] = (Math.random() - 0.5) * 0.03
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.04
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03
    }

    return { positions, colors, sizes, velocities }
  }, [])

  // Animate particles with complex motion
  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.getElapsedTime()

    // Slow rotation
    particlesRef.current.rotation.y = time * 0.03
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1

    // Animate each particle
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      // Drift motion
      positions[i3] += particles.velocities[i3]
      positions[i3 + 1] += particles.velocities[i3 + 1]
      positions[i3 + 2] += particles.velocities[i3 + 2]

      // Wave motion
      positions[i3 + 1] += Math.sin(time * 0.5 + x + z) * 0.005

      // Boundary check - reset if too far
      const distance = Math.sqrt(x * x + y * y + z * z)
      if (distance > 25) {
        const angle = Math.random() * Math.PI * 2
        const r = 8
        positions[i3] = r * Math.cos(angle)
        positions[i3 + 1] = (Math.random() - 0.5) * 10
        positions[i3 + 2] = r * Math.sin(angle)
      }
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
          attach="attributes-color"
          count={particleCount}
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
