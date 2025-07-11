"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { checkAuthStatus } from '@/lib/auth'

export function useAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkAuthStatus()
        if (!isLoggedIn) {
          router.push('/landing')
        }
      } catch (error) {
        console.error('Auth redirect check failed:', error)
        router.push('/landing')
      }
    }

    checkAuth()
  }, [router])
}
