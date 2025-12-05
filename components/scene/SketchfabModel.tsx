'use client'

import { useRef, useEffect } from 'react'

interface SketchfabModelProps {
  modelId: string
  position: [number, number, number]
  scale?: number
  autoRotate?: boolean
}

export function SketchfabModel({ modelId, position, scale = 1, autoRotate = true }: SketchfabModelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    // Configure Sketchfab viewer
    const iframe = iframeRef.current
    const url = new URL(iframe.src)

    // Add Sketchfab API parameters for customization
    url.searchParams.set('autostart', '1')
    url.searchParams.set('autospin', autoRotate ? '0.2' : '0')
    url.searchParams.set('ui_controls', '0')
    url.searchParams.set('ui_infos', '0')
    url.searchParams.set('ui_stop', '0')
    url.searchParams.set('ui_inspector', '0')
    url.searchParams.set('ui_watermark', '0')
    url.searchParams.set('ui_hint', '0')
    url.searchParams.set('transparent', '1')
    url.searchParams.set('camera', '0')

    iframe.src = url.toString()
  }, [modelId, autoRotate])

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate3d(${position[0] * 100}px, ${-position[1] * 100}px, ${position[2] * 10}px) scale(${scale})`,
        width: '300px',
        height: '300px',
        pointerEvents: 'auto',
      }}
    >
      <iframe
        ref={iframeRef}
        title={`Model ${modelId}`}
        frameBorder="0"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        src={`https://sketchfab.com/models/${modelId}/embed`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
    </div>
  )
}
