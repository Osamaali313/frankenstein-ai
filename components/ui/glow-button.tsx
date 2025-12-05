'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function GlowButton({
  children,
  className,
  ...props
}: GlowButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "glow-button border-none w-[15em] h-[3em] rounded-[3em] flex justify-center items-center gap-3 bg-[#1C1A1C] cursor-pointer transition-all duration-[450ms] ease-in-out",
        "hover:bg-gradient-to-t hover:from-[#A47CF3] hover:to-[#683FEA] hover:-translate-y-0.5",
        className
      )}
      style={{
        boxShadow: 'none',
      }}
    >
      {/* Sparkle Icon */}
      <svg
        height="24"
        width="24"
        fill="#AAAAAA"
        viewBox="0 0 24 24"
        data-name="Layer 1"
        id="Layer_1"
        className="sparkle fill-[#AAAAAA] transition-all duration-[800ms] ease-linear"
      >
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
      </svg>

      {/* Text */}
      <span className="text font-semibold text-[#AAAAAA] text-base transition-all duration-[450ms]">
        {children}
      </span>

      <style jsx>{`
        .glow-button:hover {
          box-shadow:
            inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
            inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
            0px 0px 0px 4px rgba(255, 255, 255, 0.2),
            0px 0px 180px 0px #9917FF;
        }

        .glow-button:hover .text {
          color: white;
        }

        .glow-button:hover .sparkle {
          fill: white;
          transform: scale(1.2);
        }
      `}</style>
    </button>
  )
}
