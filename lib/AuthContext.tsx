'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'

export type UserRole = 'cliente' | 'tecnico' | 'proveedor' | null

interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  verified: boolean
  phone?: string
  cuit?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string, role: UserRole) => Promise<{ ok: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await loadUserProfile(session.user.id)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await loadUserProfile(session.user.id)
      else setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setUser({ id: userId, name: data.name, email: data.email, role: data.role, verified: data.verified || false, phone: data.phone, cuit: data.cuit })
    }
  }

  const login = async (email: string, password: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: 'Email o contraseña incorrectos.' }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile && profile.role !== role) {
      await supabase.auth.signOut()
      return { ok: false, error: `Esta cuenta es de ${profile.role}, no de ${role}.` }
    }
    return { ok: true }
  }

  const register = async (data: RegisterData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: data.email, password: data.password })
    if (authError) return { ok: false, error: 'No se pudo crear la cuenta. Probá con otro email.' }
    if (!authData.user) return { ok: false, error: 'Error al crear la cuenta.' }
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id, name: data.name, email: data.email, role: data.role,
      phone: data.phone || null, cuit: data.cuit || null, verified: false, created_at: new Date().toISOString(),
    })
    if (profileError) return { ok: false, error: 'Error al guardar el perfil.' }
    return { ok: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
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
