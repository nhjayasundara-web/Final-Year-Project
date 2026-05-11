// ============================================================
// HOPE — useAuth Hook
// Save to: frontend/src/hooks/useAuth.ts
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { authAPI } from '../lib/api'
import type { User, LoginCredentials, RegisterData, AuthState } from '../types'

const TOKEN_KEY = 'hope_token'
const USER_KEY  = 'hope_user'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user:            null,
    token:           localStorage.getItem(TOKEN_KEY),
    isAuthenticated: false,
    isLoading:       true,
  })

  // On mount: verify token with server
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState(s => ({ ...s, isLoading: false }))
      return
    }
    authAPI.me()
      .then(res => {
        setState({
          user:            res.data.data,
          token,
          isAuthenticated: true,
          isLoading:       false,
        })
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
      })
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await authAPI.login(credentials)
    const { token, user } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ user, token, isAuthenticated: true, isLoading: false })
    return user as User
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const res = await authAPI.register(data)
    const { token, user } = res.data.data
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ user, token, isAuthenticated: true, isLoading: false })
    return user as User
  }, [])

  const logout = useCallback(async () => {
    try { await authAPI.logout() } catch {}
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(s => ({
      ...s,
      user: s.user ? { ...s.user, ...updates } : null
    }))
  }, [])

  return { ...state, login, register, logout, updateUser }
}
