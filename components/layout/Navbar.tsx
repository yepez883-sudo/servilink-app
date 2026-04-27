'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../lib/AuthContext'

const NAV_LINKS = [
  { href: '/cliente',   label: 'Cliente',             icon: '🏠' },
  { href: '/tecnico',   label: 'Técnico / Instalador', icon: '🔧' },
  { href: '/proveedor', label: 'Proveedor',            icon: '📦' },
  { href: '/admin',     label: 'Plataforma',           icon: '📊' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav style={{ background: '#1A2B4A' }} className="sticky top-0 z-50 flex items-center h-14 px-5 gap-2 shadow-lg">
      <Link href="/" className="flex items-center gap-2 mr-4 no-underline">
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
        <span className="font-syne font-bold text-xl text-white tracking-tight">ServiLink</span>
      </Link>

      <div className="flex gap-1 flex-1">
        {NAV_LINKS.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline"
              style={{
                background: active ? '#F4A026' : 'transparent',
                color: active ? '#1A2B4A' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 600 : 400,
              }}>
              <span>{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {user.verified ? '✓ KYC verificado' : 'Verificación pendiente'}
              </p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full font-syne font-bold text-sm"
              style={{ background: '#F4A026', color: '#1A2B4A' }}>
              {initials}
            </div>
            <button onClick={logout}
              className="hidden md:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer' }}>
              Salir
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
            No conectado
          </div>
        )}
      </div>
    </nav>
  )
}
