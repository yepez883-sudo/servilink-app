'use client'
import { useState } from 'react'
import { useAuth, UserRole } from '../../lib/AuthContext'

interface AuthGateProps {
  requiredRole: UserRole
  children: React.ReactNode
}

const ROLE_INFO = {
  cliente:   { icon: '🏠', label: 'Cliente',             desc: 'Buscá y contratá técnicos verificados' },
  tecnico:   { icon: '🔧', label: 'Técnico / Instalador', desc: 'Ofrecé tus servicios profesionales' },
  proveedor: { icon: '📦', label: 'Proveedor',            desc: 'Ofertá productos a técnicos de la red' },
}

export default function AuthGate({ requiredRole, children }: AuthGateProps) {
  const { user, login, register, isLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCuit, setRegCuit] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A2B4A' }}>
        <div className="text-white text-sm">Cargando...</div>
      </div>
    )
  }

  if (user && user.role === requiredRole) return <>{children}</>

  if (user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#1A2B4A' }}>
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-bold text-xl mb-2" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>Acceso restringido</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Tu cuenta es de <strong>{user.role}</strong>. Esta sección es solo para <strong>{requiredRole}</strong>.
          </p>
          <a href={`/${user.role}`} className="btn-primary no-underline inline-flex">Ir a mi panel →</a>
        </div>
      </div>
    )
  }

  const roleInfo = ROLE_INFO[requiredRole!]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const result = await login(email, password, requiredRole)
    setLoading(false)
    if (!result.ok) setError(result.error || 'Error al iniciar sesión.')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    if (!regName || !regEmail || !regPassword) {
      setError('Completá todos los campos obligatorios.')
      setLoading(false)
      return
    }
    const result = await register({ name: regName, email: regEmail, password: regPassword, role: requiredRole, phone: regPhone, cuit: regCuit })
    setLoading(false)
    if (!result.ok) {
      setError(result.error || 'Error al registrarse.')
    } else {
      setSuccess('¡Cuenta creada! Revisá tu email para confirmar tu registro.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#1A2B4A' }}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6" style={{ background: '#1A2B4A' }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
            <span className="font-bold text-lg text-white" style={{ fontFamily: 'Syne, sans-serif' }}>ServiLink</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{roleInfo.icon}</span>
            <div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>{roleInfo.label}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{roleInfo.desc}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #E8E5DE' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
              className="flex-1 py-3 text-sm font-semibold transition-all"
              style={{
                background: mode === m ? '#fff' : '#F6F5F1',
                color: mode === m ? '#1A2B4A' : '#6B7280',
                border: 'none', cursor: 'pointer',
                borderBottom: mode === m ? '2px solid #1A2B4A' : '2px solid transparent',
              }}>
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse gratis'}
            </button>
          ))}
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="p-3 rounded-xl text-xs mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>{error}</div>
          )}
          {success && (
            <div className="p-3 rounded-xl text-xs mb-4" style={{ background: '#D1FAE5', color: '#065F46' }}>{success}</div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Email</label>
                  <input className="sl-input" type="email" placeholder="tu@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Contraseña</label>
                  <input className="sl-input" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar →'}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {mode === 'register' && !success && (
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>
                    {requiredRole === 'proveedor' ? 'Nombre / Razón social *' : 'Nombre completo *'}
                  </label>
                  <input className="sl-input" placeholder={requiredRole === 'proveedor' ? 'ElectroMax SRL' : 'Juan Pérez'}
                    value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Email *</label>
                  <input className="sl-input" type="email" placeholder="tu@email.com"
                    value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Teléfono / WhatsApp</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 rounded-xl text-sm"
                      style={{ background: '#F6F5F1', border: '1.5px solid #E8E5DE', color: '#6B7280', whiteSpace: 'nowrap' }}>
                      🇦🇷 +54
                    </span>
                    <input className="sl-input" placeholder="381 400-0000"
                      value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                  </div>
                </div>
                {(requiredRole === 'proveedor' || requiredRole === 'tecnico') && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>
                      {requiredRole === 'proveedor' ? 'CUIT' : 'CUIL'}
                    </label>
                    <input className="sl-input" placeholder="20-12345678-9"
                      value={regCuit} onChange={e => setRegCuit(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Contraseña *</label>
                  <input className="sl-input" type="password" placeholder="Mínimo 6 caracteres"
                    value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
              </div>
              <div className="p-3 rounded-xl text-xs mb-4" style={{ background: '#FEF3C7', color: '#92400E' }}>
                Al registrarte aceptás que el acuerdo económico es directo entre las partes. ServiLink no interviene en pagos ni contratos.
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
              </button>
            </form>
          )}

          <p className="text-center text-xs mt-4" style={{ color: '#6B7280' }}>
            <a href="/" className="font-semibold no-underline" style={{ color: '#1A2B4A' }}>← Volver al inicio</a>
          </p>
        </div>
      </div>
    </div>
  )
}
