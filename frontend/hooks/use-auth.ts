"use client"

import { useState, useEffect } from 'react'
import { checkAuthStatus, getCurrentUser, logout } from '@/lib/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkAuthStatus()
        setIsAuthenticated(isLoggedIn)
        
        if (isLoggedIn) {
          // getCurrentUser now uses the cached data from checkAuthStatus
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    logout: handleLogout,
    refreshAuth: async () => {
      setIsLoading(true)
      const isLoggedIn = await checkAuthStatus()
      setIsAuthenticated(isLoggedIn)
      if (isLoggedIn) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  }
}
