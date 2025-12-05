"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedGradientText = ({
  children,
  className,
}: AnimatedGradientTextProps) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-horror-purple-400 via-horror-pink-500 to-horror-red-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]",
        className
      )}
    >
      {children}
    </div>
  );
};
