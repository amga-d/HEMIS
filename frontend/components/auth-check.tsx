"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { checkAuthStatus } from '@/lib/auth'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkAuthStatus()
        if (!isLoggedIn) {
          router.push('/landing')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/landing')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, isMounted])

  // Don't render anything until the component is mounted on the client
  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
