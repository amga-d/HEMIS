"use client"

import type React from "react"
import { Bell, User, LogOut } from "lucide-react"
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/landing')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to landing page even if logout fails
      router.push('/landing')
    }
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl glass hover:bg-white/20 transition-colors">
            <Bell className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-3 glass-card py-2">
            <div className="p-2 rounded-full bg-white/20">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-medium">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl glass hover:bg-white/20 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
