'use client'
import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  { id: 'cliente',   icon: '🏠', label: 'Cliente' },
  { id: 'tecnico',   icon: '🔧', label: 'Técnico' },
  { id: 'proveedor', icon: '📦', label: 'Proveedor' },
]

export default function LoginPage() {
  const [role, setRole] = useState('cliente')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/${role}`
  }

  return (
    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-up">
      <div className="px-8 py-6 border-b" style={{ borderColor: '#E8E5DE' }}>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
          <span className="font-syne font-bold text-lg" style={{ color: '#1A2B4A' }}>ServiLink</span>
        </div>
        <h1 className="font-syne font-bold text-2xl" style={{ color: '#1A2B4A' }}>Iniciar sesión</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Ingresá a tu cuenta verificada</p>
      </div>

      <form className="px-8 py-6" onSubmit={handleLogin}>
        {/* Role selector */}
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Soy un…</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {ROLES.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className="py-2 px-3 rounded-xl text-sm font-medium transition-all"
              style={{
                border: role === r.id ? '2px solid #1A2B4A' : '1.5px solid #E8E5DE',
                background: role === r.id ? '#1A2B4A' : '#fff',
                color: role === r.id ? '#fff' : '#6B7280',
              }}
            >
              <div className="text-xl mb-1">{r.icon}</div>
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Email o CUIL</label>
            <input className="sl-input" type="text" placeholder="ejemplo@correo.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Contraseña</label>
            <input className="sl-input" type="password" placeholder="••••••••"
              value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3">
            Ingresar →
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: '#6B7280' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/auth/registro" className="font-semibold no-underline" style={{ color: '#1A2B4A' }}>
            Registrate gratis
          </Link>
        </p>
      </form>
    </div>
  )
}
