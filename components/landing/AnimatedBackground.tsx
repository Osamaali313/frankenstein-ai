'use client'

import { useEffect, useRef, useState } from 'react'
import { Particles } from '@/components/ui/particles'
import { Meteors } from '@/components/ui/meteors'
import { getDeviceCapabilities } from '@/lib/device-detection'

function AnimatedGradientOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Animated gradient orbs
    const orbs = [
      {
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.25,
        size: 400,
        color: 'rgba(168, 85, 247, 0.3)', // Purple
        speedX: 0.3,
        speedY: 0.2,
        phase: 0
      },
      {
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.75,
        size: 350,
        color: 'rgba(236, 72, 153, 0.25)', // Pink
        speedX: -0.2,
        speedY: 0.3,
        phase: Math.PI / 2
      },
      {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.5,
        size: 300,
        color: 'rgba(239, 68, 68, 0.2)', // Red
        speedX: 0.25,
        speedY: -0.25,
        phase: Math.PI
      }
    ]

    let time = 0

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw orbs
      orbs.forEach((orb) => {
        // Update position with sine wave for smooth movement
        orb.x += orb.speedX
        orb.y += orb.speedY

        // Bounce off edges
        if (orb.x < -orb.size / 2 || orb.x > canvas.width + orb.size / 2) {
          orb.speedX *= -1
        }
        if (orb.y < -orb.size / 2 || orb.y > canvas.height + orb.size / 2) {
          orb.speedY *= -1
        }

        // Pulsing effect
        const pulse = Math.sin(time * 0.001 + orb.phase) * 0.2 + 1

        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.size * pulse
        )
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        // Draw orb
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      time += 16
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-50"
      style={{ filter: 'blur(60px)' }}
    />
  )
}

export function AnimatedBackground() {
  const [capabilities, setCapabilities] = useState(getDeviceCapabilities())

  useEffect(() => {
    setCapabilities(getDeviceCapabilities())
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs (only on desktop) */}
      {!capabilities.mobile && <AnimatedGradientOrbs />}

      {/* Particles with adjusted count */}
      <Particles
        className="absolute inset-0"
        quantity={capabilities.particleCount}
        ease={80}
        color="#a855f7"
        refresh
      />

      {/* Meteors (only on desktop) */}
      {capabilities.showMeteors && <Meteors number={3} />}
    </div>
  )
}
