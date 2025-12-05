"use client";

import React from 'react';
import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function GalaxyBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-gradient-to-r from-[#4A7A3D] to-[#7A7A3D]" />}>
        <Spline
          className="w-full h-full pointer-events-auto"
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
      </Suspense>

      {/* Subtle gradient overlays to blend with main background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#3F6833]/70 via-transparent to-[#68682F]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#4A7A3D]/40 pointer-events-none" />

      {/* Green tint to match Halloween color scheme */}
      <div className="absolute inset-0 bg-[#7A7A3D]/5 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
