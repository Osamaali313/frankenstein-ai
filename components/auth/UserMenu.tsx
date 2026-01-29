'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, FolderOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AuthModal } from './AuthModal'

export function UserMenu() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleSignOut = async () => {
    await signOut()
  }

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => openAuth('signin')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            Sign In
          </Button>
          <Button
            onClick={() => openAuth('signup')}
            className="bg-gradient-to-r from-[#FA6D1B] to-[#F25C07] hover:from-[#F25C07] hover:to-[#FA6D1B] text-white"
          >
            Sign Up
          </Button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </>
    )
  }

  const initials = user.email
    ?.split('@')[0]
    .slice(0, 2)
    .toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8 border-2 border-[#FA6D1B]">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-[#FA6D1B] to-[#F25C07] text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-black/95 border-white/10 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="text-gray-300">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          My Projects
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
