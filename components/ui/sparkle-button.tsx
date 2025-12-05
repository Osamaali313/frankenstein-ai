'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface SparkleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function SparkleButton({
  children,
  className,
  disabled,
  ...props
}: SparkleButtonProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        "sparkle-button relative cursor-pointer flex items-center gap-2 px-4 py-2 bg-transparent border-none rounded-full transition-transform duration-300",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onMouseEnter={() => !disabled && setIsActive(true)}
      onMouseLeave={() => !disabled && setIsActive(false)}
      onFocus={() => !disabled && setIsActive(true)}
      onBlur={() => !disabled && setIsActive(false)}
      style={{
        transform: isActive && !disabled ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Background layer */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full transition-all duration-300 z-0"
        style={{
          backgroundColor: 'hsla(0, 0%, 12%, 1)',
          boxShadow: isActive && !disabled
            ? `inset 0 0.5px hsl(0, 0%, 100%),
               inset 0 -1px 2px 0 hsl(0, 0%, 0%),
               0px 4px 10px -4px hsla(0, 0%, 0%, 0),
               0 0 0 0.375rem hsl(260, 97%, 50%, 0.75)`
            : `inset 0 0.5px hsl(0, 0%, 100%),
               inset 0 -1px 2px 0 hsl(0, 0%, 0%),
               0px 4px 10px -4px hsla(0, 0%, 0%, 1)`,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full transition-opacity duration-300 z-[2]"
        style={{
          background: `radial-gradient(at 51% 89%, hsla(266, 45%, 74%, 1) 0px, transparent 50%),
                       radial-gradient(at 100% 100%, hsla(266, 36%, 60%, 1) 0px, transparent 50%),
                       radial-gradient(at 22% 91%, hsla(266, 36%, 60%, 1) 0px, transparent 50%)`,
          backgroundPosition: 'top',
          opacity: isActive && !disabled ? 1 : 0,
        }}
      />

      {/* Rotating dots border */}
      <div className="dots-border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-transparent z-[-10]"
        style={{
          width: 'calc(100% + 2px)',
          height: 'calc(100% + 2px)',
        }}
      >
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-8 bg-white animate-spin-slow"
          style={{
            transformOrigin: 'left',
            mask: 'linear-gradient(transparent 0%, white 120%)',
          }}
        />
      </div>

      {/* Sparkle Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="sparkle relative z-10 w-5 h-5"
      >
        <path
          className={cn(
            "path transition-transform duration-150",
            isActive && !disabled && "animate-sparkle-1"
          )}
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          fill="currentColor"
          d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
        />
        <path
          className={cn(
            "path transition-transform duration-150",
            isActive && !disabled && "animate-sparkle-2"
          )}
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          fill="currentColor"
          d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
        />
        <path
          className={cn(
            "path transition-transform duration-150",
            isActive && !disabled && "animate-sparkle-3"
          )}
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          fill="currentColor"
          d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
        />
      </svg>

      {/* Text */}
      <span
        className="text-button relative z-10 text-base font-medium bg-clip-text"
        style={{
          backgroundImage: isActive && !disabled
            ? 'linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 100%, 1) 120%)'
            : 'linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 100%, 0) 120%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </span>

      <style jsx>{`
        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: rotate 2s linear infinite;
        }

        @keyframes sparkle-1 {
          0%, 34%, 71%, 100% {
            transform: scale(1);
          }
          17% {
            transform: scale(1.2);
          }
        }

        @keyframes sparkle-2 {
          0%, 34%, 71%, 100% {
            transform: scale(1);
          }
          49% {
            transform: scale(1.2);
          }
        }

        @keyframes sparkle-3 {
          0%, 34%, 71%, 100% {
            transform: scale(1);
          }
          83% {
            transform: scale(1.2);
          }
        }

        .animate-sparkle-1 {
          animation: sparkle-1 1.5s linear 0.5s infinite;
          transform-origin: center;
        }

        .animate-sparkle-2 {
          animation: sparkle-2 1.5s linear 0.5s infinite;
          transform-origin: center;
        }

        .animate-sparkle-3 {
          animation: sparkle-3 1.5s linear 0.5s infinite;
          transform-origin: center;
        }
      `}</style>
    </button>
  )
}
