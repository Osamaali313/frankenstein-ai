'use client'

import { MessageSquare, Code2, Eye, Rocket } from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { AnimatedBorderCard } from '@/components/ui/animated-border-card'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe Your Vision',
    description: 'Tell our AI agents what you want to build in plain English - apps, features, or improvements',
    color: 'text-[var(--color-horror-purple-400)]',
    bgColor: 'bg-[var(--color-horror-purple-600)]/20'
  },
  {
    number: '02',
    icon: Code2,
    title: 'Generate Development Plan',
    description: 'AI analyzes requirements and creates a detailed implementation plan with file structure',
    color: 'text-[var(--color-horror-pink-400)]',
    bgColor: 'bg-[var(--color-horror-pink-600)]/20'
  },
  {
    number: '03',
    icon: Eye,
    title: 'Build & Collaborate',
    description: 'Specialized agents write code, run tests, and ensure security while you watch in real-time',
    color: 'text-[var(--color-horror-red-400)]',
    bgColor: 'bg-[var(--color-horror-red-600)]/20'
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Review & Deploy',
    description: 'Get production-ready code with documentation, tests, and deployment instructions',
    color: 'text-green-400',
    bgColor: 'bg-green-600/20'
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-4 py-32">
        <div className="relative max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <BlurFade delay={0.2} inView>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-horror-purple-400 to-horror-pink-500">
                How It Works
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From idea to production in four simple steps
              </p>
            </div>
          </BlurFade>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <BlurFade key={step.number} delay={0.2 + index * 0.1} inView>
                <div className="relative h-[320px]">
                  {/* Connector Line (except last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-white/20 to-transparent z-10" />
                  )}

                  {/* Step Card */}
                  <AnimatedBorderCard delay={0.2 + index * 0.1}>
                    <div className="relative h-full flex flex-col group">
                      {/* Step Number */}
                      <div className="text-6xl font-bold text-white/5 absolute top-0 right-0">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl ${step.bgColor} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </AnimatedBorderCard>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
    </section>
  )
}
