'use client'

import { BlurFade } from '@/components/magicui/blur-fade'
import { GradientCard } from '@/components/ui/gradient-card'
import { FloatingDecorations } from '@/components/ui/floating-decorations'
import Image from 'next/image'

const agents = [
  {
    id: 'annabelle',
    name: 'Annabelle',
    role: 'Frontend Specialist',
    image: '/halloween-assets/new1-img.png',
    description: 'Crafts beautiful React components with elegant, creepy precision.',
    specialties: ['React', 'TypeScript', 'CSS', 'UI/UX'],
    color: 'from-[var(--color-horror-purple-600)]/20 to-[var(--color-horror-purple-900)]/20'
  },
  {
    id: 'chucky',
    name: 'Chucky',
    role: 'Backend Specialist',
    image: '/halloween-assets/new2-img.png',
    description: 'Brutally efficient with APIs, databases, and server-side logic.',
    specialties: ['FastAPI', 'Python', 'Databases', 'APIs'],
    color: 'from-[var(--color-horror-red-600)]/20 to-[var(--color-horror-red-900)]/20'
  },
  {
    id: 'freddy',
    name: 'Freddy',
    role: 'Fullstack Nightmare',
    image: '/halloween-assets/new3-img.png',
    description: 'Masters both frontend and backend, creating complete solutions.',
    specialties: ['Full-stack', 'Architecture', 'Integrations'],
    color: 'from-green-600/20 to-green-900/20'
  },
  {
    id: 'jason',
    name: 'Jason',
    role: 'DevOps Slasher',
    image: '/halloween-assets/new4-img.png',
    description: 'Silent but deadly efficient with Docker, CI/CD, and deployments.',
    specialties: ['Docker', 'CI/CD', 'AWS', 'Kubernetes'],
    color: 'from-blue-600/20 to-blue-900/20'
  },
  {
    id: 'pennywise',
    name: 'Pennywise',
    role: 'Testing Clown',
    image: '/halloween-assets/new5-img.png',
    description: 'Finds bugs hiding in dark corners with playful precision.',
    specialties: ['Jest', 'Cypress', 'QA', 'Testing'],
    color: 'from-orange-600/20 to-orange-900/20'
  },
  {
    id: 'ghostface',
    name: 'Ghostface',
    role: 'Security Expert',
    image: '/halloween-assets/new6-img.png',
    description: 'Paranoid about security, hunts vulnerabilities relentlessly.',
    specialties: ['Auth', 'Encryption', 'Security', 'Audits'],
    color: 'from-gray-600/20 to-gray-900/20'
  },
  {
    id: 'valak',
    name: 'Valak',
    role: 'Project Manager',
    image: '/halloween-assets/trick-treat1-img.png',
    description: 'Ancient demon nun who commands the development team perfectly.',
    specialties: ['Coordination', 'Planning', 'Leadership'],
    color: 'from-[var(--color-horror-purple-600)]/20 to-[var(--color-horror-pink-600)]/20'
  },
  {
    id: 'pinhead',
    name: 'Pinhead',
    role: 'CTO',
    image: '/halloween-assets/trick-treat2-img.png',
    description: 'Philosophical cenobite obsessed with perfect architecture.',
    specialties: ['Architecture', 'Strategy', 'Review'],
    color: 'from-[var(--color-horror-pink-600)]/20 to-[var(--color-horror-red-600)]/20'
  },
  {
    id: 'jason-analyst',
    name: 'Jason (Analyst)',
    role: 'Business Analyst',
    image: '/halloween-assets/trick-treat3-img.png',
    description: 'Asks critical questions to understand exact requirements.',
    specialties: ['Requirements', 'Analysis', 'Planning'],
    color: 'from-[var(--color-horror-purple-600)]/20 to-blue-600/20'
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
