import Cookies from 'js-cookie'

const TOKEN_KEY = 'laundry_token'
const USER_KEY = 'laundry_user'

/**
 * Default Cookie options:
 * - 7 days lifetime
 * - Root path '/'
 * - SameSite 'lax' for security
 * - Secure flag enabled when on HTTPS
 */
const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'lax',
  secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
}

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY) || null
}

export const setAuthToken = (token) => {
  if (token) {
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS)
  }
}

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: '/' })
}

export const getAuthUser = () => {
  const raw = Cookies.get(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setAuthUser = (user) => {
  if (user) {
    Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS)
  }
}

export const removeAuthUser = () => {
  Cookies.remove(USER_KEY, { path: '/' })
}

export const clearAuthCookies = () => {
  removeAuthToken()
  removeAuthUser()
  // Clean up any legacy localStorage tokens if present
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (_) {}
}

