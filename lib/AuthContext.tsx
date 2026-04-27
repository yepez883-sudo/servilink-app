'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'cliente' | 'tecnico' | 'proveedor' | null

interface AuthUser {
  name: string
  email: string
  role: UserRole
  verified: boolean
  phone?: string
  cuit?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string, role: UserRole) => boolean
  register: (data: RegisterData) => boolean
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  cuit?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

// Usuarios demo para probar
const DEMO_USERS = [
  { email: 'cliente@demo.com', password: '123456', name: 'Juan Pérez', role: 'cliente' as UserRole, verified: true },
  { email: 'tecnico@demo.com', password: '123456', name: 'Ing. Diego Ferrara', role: 'tecnico' as UserRole, verified: true, phone: '3814000001' },
  { email: 'proveedor@demo.com', password: '123456', name: 'ElectroMax SRL', role: 'proveedor' as UserRole, verified: true, phone: '3814000002', cuit: '30-12345678-9' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Recuperar sesión guardada
    try {
      const saved = sessionStorage.getItem('servilink_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string, role: UserRole): boolean => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password && u.role === role)
    if (found) {
      const authUser: AuthUser = { name: found.name, email: found.email, role: found.role, verified: found.verified, phone: (found as any).phone, cuit: (found as any).cuit }
      setUser(authUser)
      sessionStorage.setItem('servilink_user', JSON.stringify(authUser))
      return true
    }
    return false
  }

  const register = (data: RegisterData): boolean => {
    const authUser: AuthUser = {
      name: data.name, email: data.email, role: data.role,
      verified: false, phone: data.phone, cuit: data.cuit
    }
    setUser(authUser)
    sessionStorage.setItem('servilink_user', JSON.stringify(authUser))
    return true
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('servilink_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
