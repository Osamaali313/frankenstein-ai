'use client'

import { BlurFade } from '@/components/magicui/blur-fade'
import { GradientCard } from '@/components/ui/gradient-card'
import { FloatingDecorations } from '@/components/ui/floating-decorations'
import Image from 'next/image'

const agents = [
  {
    id: 'pinhead',
    name: 'PinHead',
    role: 'Digital CTO',
    image: '/halloween-assets/trick-treat2-img.png',
    description: 'Strategic technical leader who generates PRDs, Requirements, and Vibe Prompts',
    specialties: ['Product Strategy', 'Requirements', 'Architecture', 'Documentation'],
    color: 'from-[var(--color-horror-pink-600)]/20 to-[var(--color-horror-red-600)]/20'
  },
  {
    id: 'annabelle',
    name: 'Annabelle',
    role: 'Frontend Specialist',
    image: '/halloween-assets/new1-img.png',
    description: 'A creepy doll obsessed with pixel-perfect UI/UX and beautiful designs',
    specialties: ['React', 'TypeScript', 'CSS', 'UI/UX', 'Accessibility'],
    color: 'from-[var(--color-horror-purple-600)]/20 to-[var(--color-horror-purple-900)]/20'
  },
  {
    id: 'chucky',
    name: 'Chucky',
    role: 'Backend Specialist',
    image: '/halloween-assets/new2-img.png',
    description: 'An aggressive killer doll focused on brutal performance and APIs',
    specialties: ['Python', 'FastAPI', 'Databases', 'APIs', 'Performance'],
    color: 'from-[var(--color-horror-red-600)]/20 to-[var(--color-horror-red-900)]/20'
  },
  {
    id: 'jason',
    name: 'Jason',
    role: 'Business Analyst',
    image: '/halloween-assets/new4-img.png',
    description: 'The silent slasher who cuts through ambiguity to define requirements',
    specialties: ['Requirements', 'User Stories', 'Edge Cases', 'Process Mapping'],
    color: 'from-blue-600/20 to-blue-900/20'
  },
  {
    id: 'pennywise',
    name: 'Pennywise',
    role: 'Testing Specialist',
    image: '/halloween-assets/new5-img.png',
    description: 'The dancing clown who finds bugs where you least expect them',
    specialties: ['Jest', 'Cypress', 'Testing', 'TDD', 'E2E Testing'],
    color: 'from-orange-600/20 to-orange-900/20'
  },
  {
    id: 'ghostface',
    name: 'Ghostface',
    role: 'Security Expert',
    image: '/halloween-assets/new6-img.png',
    description: 'Hunts down vulnerabilities and security flaws before attackers do',
    specialties: ['Security', 'Auth', 'Encryption', 'OWASP', 'Pentesting'],
    color: 'from-gray-600/20 to-gray-900/20'
  },
  {
    id: 'valak',
    name: 'Valak',
    role: 'Project Manager',
    image: '/halloween-assets/trick-treat1-img.png',
    description: 'The demonic nun who asks the hard questions and keeps projects on track',
    specialties: ['Agile', 'Planning', 'Risk Management', 'Sprint Planning'],
    color: 'from-[var(--color-horror-purple-600)]/20 to-[var(--color-horror-pink-600)]/20'
  }
]

export function AgentsSection() {
  return (
    <section id="agents" className="relative overflow-hidden px-4 py-32">
        {/* Floating Decorations */}
        <FloatingDecorations pumpkinPosition="top-left" potPosition="bottom-right" />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <BlurFade delay={0.2} inView>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-horror-purple-400 to-horror-pink-500">
                Meet Your Team
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Each agent is a specialist in their field, ready to build
                production-ready code with their unique personality.
              </p>
            </div>
          </BlurFade>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <BlurFade key={agent.id} delay={0.2 + index * 0.1} inView>
                <div className="h-[450px]">
                  <GradientCard
                    title={agent.name}
                    role={agent.role}
                    description={agent.description}
                    icon={
                      <div className="relative w-12 h-12">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          fill
                          className="object-contain"
                          sizes="48px"
                          unoptimized
                        />
                      </div>
                    }
                    skills={agent.specialties}
                  />
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
    </section>
  )
}
