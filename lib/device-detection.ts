'use client'

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getDeviceCapabilities() {
  const mobile = isMobile()
  const reducedMotion = prefersReducedMotion()

  return {
    mobile,
    reducedMotion,
    // Reduce particle count on mobile
    particleCount: mobile ? 30 : 100,
    // Disable meteors on mobile
    showMeteors: !mobile && !reducedMotion,
    // Reduce animation complexity
    complexAnimations: !mobile && !reducedMotion
  }
}
