"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { checkAuthStatus } from '@/lib/auth'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkAuthStatus()
        
        if (isLoggedIn) {
          setIsAuthenticated(true)
        } else {
          router.push('/landing')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/landing')
      } finally {
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure cookie is available after login redirect
    const timeoutId = setTimeout(() => {
      checkAuth()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting...</div>
      </div>
    )
  }

  return <>{children}</>
}
