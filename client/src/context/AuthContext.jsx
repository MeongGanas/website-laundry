import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '@/services/api'
import {
  getAuthToken,
  setAuthToken,
  getAuthUser,
  setAuthUser,
  clearAuthCookies,
} from '@/lib/cookies'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken())
  const [user, setUser] = useState(() => getAuthUser())
  const [loading, setLoading] = useState(false)

  // Sync state if cookies change
  useEffect(() => {
    const currentToken = getAuthToken()
    const currentUser = getAuthUser()
    if (currentToken !== token) setToken(currentToken)
    if (currentUser && (!user || currentUser.id !== user.id)) setUser(currentUser)
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { token: receivedToken, user: receivedUser } = response.data
    
    // Save to cookies with 7-day expiration
    setAuthToken(receivedToken)
    setAuthUser(receivedUser)
    
    setToken(receivedToken)
    setUser(receivedUser)
    return receivedUser
  }

  const logout = async () => {
    try {
      const currentToken = token || getAuthToken()
      if (currentToken) {
        await api.post('/logout')
      }
    } catch (err) {
      console.warn('Logout error ignored:', err)
    } finally {
      clearAuthCookies()
      setToken(null)
      setUser(null)
    }
  }

  const isAuthenticated = Boolean(token || getAuthToken())

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
