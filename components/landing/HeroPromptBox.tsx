"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SparkleButton } from "@/components/ui/sparkle-button";
import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
}

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 rounded-full border-horror-purple-500/30 bg-black/50 backdrop-blur-sm text-horror-purple-200 hover:text-white hover:bg-horror-purple-500/20 hover:border-horror-purple-400"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export function HeroPromptBox() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 200,
  });

  const handleGenerateSite = () => {
    if (!message.trim()) return;

    // Store the prompt in sessionStorage to pass to Studio
    sessionStorage.setItem('initialPrompt', message);

    // Navigate to Studio
    router.push('/studio');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rainbow-border-wrapper relative">
        {/* Animated rainbow border */}
        <div className="rainbow-border-bg" />
        <div className="rainbow-border-blur" />

        {/* Content */}
        <div className="relative bg-gradient-to-b from-black to-[#272727] backdrop-blur-md rounded-xl z-10">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            placeholder="Build me a todo app with authentication..."
            className={cn(
              "w-full px-6 py-5 resize-none border-none",
              "bg-transparent text-white text-base",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-gray-400 min-h-[80px]"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between p-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-horror-purple-300 hover:bg-horror-purple-500/20 hover:text-horror-purple-200"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <SparkleButton
                disabled={!message.trim()}
                onClick={handleGenerateSite}
              >
                Generate Plan
              </SparkleButton>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rainbow-border-wrapper {
          position: relative;
          border-radius: 10px;
        }

        .rainbow-border-bg,
        .rainbow-border-blur {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 10px;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094,
            #0000ff, #00ff00, #ffff00, #ff0000);
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: steam 20s linear infinite;
        }

        .rainbow-border-blur {
          filter: blur(50px);
        }

        @keyframes steam {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
      `}</style>

      {/* Quick Actions */}
      <div className="flex items-center justify-center flex-wrap gap-3 mt-6">
        <QuickAction icon={<Code2 className="w-4 h-4" />} label="Generate Code" />
        <QuickAction icon={<Rocket className="w-4 h-4" />} label="Launch App" />
        <QuickAction icon={<Layers className="w-4 h-4" />} label="UI Components" />
        <QuickAction icon={<Palette className="w-4 h-4" />} label="Theme Ideas" />
      </div>
    </div>
  );
}
