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
    // Timeout de seguridad — nunca se queda cargando más de 5 segundos
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout)
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '')
      }
      setIsLoading(false)
    }).catch(() => {
      clearTimeout(timeout)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setUser({
          id: userId,
          name: data.name || email,
          email: data.email || email,
          role: data.role || 'cliente',
          verified: data.verified || false,
          phone: data.phone,
          cuit: data.cuit,
        })
      } else {
        // Si no hay perfil, crear uno básico para no quedar trabado
        setUser({
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: 'cliente',
          verified: false,
        })
      }
    } catch {
      // En caso de error, setear usuario básico igual
      setUser({
        id: userId,
        name: email.split('@')[0],
        email: email,
        role: 'cliente',
        verified: false,
      })
    }
  }

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { ok: false, error: 'Email o contraseña incorrectos.' }

      // Verificar rol si existe perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile && profile.role && profile.role !== role) {
        await supabase.auth.signOut()
        return { ok: false, error: `Esta cuenta es de ${profile.role}, no de ${role}.` }
      }

      // Si no tiene perfil o el rol coincide, actualizar rol
      if (!profile || !profile.role) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: email.split('@')[0],
          email: email,
          role: role,
          verified: false,
          created_at: new Date().toISOString(),
        })
      }

      return { ok: true }
    } catch {
      return { ok: false, error: 'Error de conexión. Intentá de nuevo.' }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) return { ok: false, error: 'No se pudo crear la cuenta. Probá con otro email.' }
      if (!authData.user) return { ok: false, error: 'Error al crear la cuenta.' }

      // Guardar perfil
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || null,
        cuit: data.cuit || null,
        verified: false,
        created_at: new Date().toISOString(),
      })

      return { ok: true }
    } catch {
      return { ok: false, error: 'Error de conexión. Intentá de nuevo.' }
    }
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
