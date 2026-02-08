export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
}

export const authKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
} as const

export const setAuthData = (data: AuthResponse) => {
  localStorage.setItem(authKeys.accessToken, data.accessToken)
  localStorage.setItem(authKeys.refreshToken, data.refreshToken)
  localStorage.setItem(authKeys.user, JSON.stringify(data.user))
}

export const getAuthData = () => {
  const accessToken = localStorage.getItem(authKeys.accessToken)
  const refreshToken = localStorage.getItem(authKeys.refreshToken)
  const userStr = localStorage.getItem(authKeys.user)
  
  return {
    accessToken,
    refreshToken,
    user: userStr ? JSON.parse(userStr) as User : null,
  }
}

export const clearAuthData = () => {
  localStorage.removeItem(authKeys.accessToken)
  localStorage.removeItem(authKeys.refreshToken)
  localStorage.removeItem(authKeys.user)
}

export const isAuthenticated = () => {
  const { accessToken } = getAuthData()
  return !!accessToken
}

export const isAdmin = () => {
  const { user } = getAuthData()
  return user?.role === 'ADMIN'
}
