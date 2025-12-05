'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SpaceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function SpaceButton({
  children,
  className,
  ...props
}: SpaceButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "space-btn flex justify-center items-center w-[13rem] h-[3rem] overflow-hidden cursor-pointer backdrop-blur-[1rem] rounded-[5rem] transition-all duration-500 border-4 border-double border-transparent",
        "bg-[length:300%_300%] animate-gradient",
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(#212121, #212121), linear-gradient(137.48deg, #8B0000 10%, #DC143C 45%, #FA6D1B 67%, #FA6D1B 87%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '0 0 30px rgba(250, 109, 27, 0.5), 0 0 60px rgba(220, 20, 60, 0.3)',
      }}
    >
      {/* Stars Container */}
      <div
        id="container-stars"
        className="absolute z-[-1] w-full h-full overflow-hidden transition-all duration-500 backdrop-blur-[1rem] rounded-[5rem]"
      >
        <div id="stars" className="relative bg-transparent w-[200rem] h-[200rem]">
          {/* Stars layers */}
          <div className="stars-after" />
          <div className="stars-before" />
        </div>
      </div>

      {/* Glow Effect */}
      <div id="glow" className="absolute flex w-[12rem]">
        <div className="circle circle-1 w-full h-[30px] blur-[2rem] animate-pulse-glow z-[-1]" />
        <div className="circle circle-2 w-full h-[30px] blur-[2rem] animate-pulse-glow z-[-1]" />
      </div>

      {/* Text */}
      <strong className="z-[2] text-xs tracking-[5px] text-white" style={{ textShadow: '0 0 4px white' }}>
        {children}
      </strong>

      <style jsx>{`
        @keyframes gradient_301 {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse_3011 {
          0% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        @keyframes animStar {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-135rem);
          }
        }

        @keyframes animStarRotate {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0);
          }
        }

        .animate-gradient {
          animation: gradient_301 5s ease infinite;
        }

        .animate-pulse-glow {
          animation: pulse_3011 4s infinite;
        }

        .circle-1 {
          background: rgba(220, 20, 60, 0.8);
        }

        .circle-2 {
          background: rgba(250, 109, 27, 0.8);
        }

        .space-btn:hover #container-stars {
          z-index: 1;
          background-color: #212121;
        }

        .space-btn:hover {
          transform: scale(1.1);
        }

        .space-btn:active {
          border: double 4px #FA6D1B;
          background-origin: border-box;
          background-clip: content-box, border-box;
          animation: none;
          box-shadow: 0 0 40px rgba(250, 109, 27, 0.8), 0 0 80px rgba(220, 20, 60, 0.6);
        }

        .space-btn:active .circle {
          background: #FA6D1B;
        }

        .stars-after {
          content: "";
          position: absolute;
          top: -10rem;
          left: -100rem;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(#ffffff 1px, transparent 1%);
          background-size: 50px 50px;
          animation: animStarRotate 90s linear infinite;
        }

        .stars-before {
          content: "";
          position: absolute;
          top: 0;
          left: -50%;
          width: 170%;
          height: 500%;
          background-image: radial-gradient(#ffffff 1px, transparent 1%);
          background-size: 50px 50px;
          opacity: 0.5;
          animation: animStar 60s linear infinite;
        }
      `}</style>
    </button>
  )
}
