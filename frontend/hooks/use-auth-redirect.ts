"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      if (!isLoggedIn) {
        router.push('/landing')
      }
    }
  }, [router])
}
