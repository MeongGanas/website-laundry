import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('laundry_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('laundry_user')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { token: receivedToken, user: receivedUser } = response.data
    
    // Save to localStorage synchronously
    localStorage.setItem('laundry_token', receivedToken)
    localStorage.setItem('laundry_user', JSON.stringify(receivedUser))
    
    setToken(receivedToken)
    setUser(receivedUser)
    return receivedUser
  }

  const logout = async () => {
    try {
      const currentToken = token || localStorage.getItem('laundry_token')
      if (currentToken) {
        await api.post('/logout')
      }
    } catch (err) {
      console.warn('Logout error ignored:', err)
    } finally {
      localStorage.removeItem('laundry_token')
      localStorage.removeItem('laundry_user')
      setToken(null)
      setUser(null)
    }
  }

  const isAuthenticated = Boolean(token || localStorage.getItem('laundry_token'))

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
