'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/cliente',    label: 'Cliente',             icon: '🏠' },
  { href: '/tecnico',    label: 'Técnico / Instalador', icon: '🔧' },
  { href: '/proveedor',  label: 'Proveedor',            icon: '📦' },
  { href: '/admin',      label: 'Plataforma',           icon: '📊' },
]

export default function Navbar() {
  const pathname = usePathname()

  const getInitials = () => {
    if (pathname.startsWith('/tecnico'))   return 'TQ'
    if (pathname.startsWith('/proveedor')) return 'PV'
    if (pathname.startsWith('/admin'))     return 'AD'
    return 'CL'
  }

  return (
    <nav style={{ background: '#1A2B4A' }} className="sticky top-0 z-50 flex items-center h-14 px-5 gap-2 shadow-lg">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-4 no-underline">
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
        <span className="font-syne font-bold text-xl text-white tracking-tight">ServiLink</span>
      </Link>

      {/* Nav tabs */}
      <div className="flex gap-1 flex-1">
        {NAV_LINKS.map(link => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline"
              style={{
                background: active ? '#F4A026' : 'transparent',
                color: active ? '#1A2B4A' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span>{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DD4BF', display: 'inline-block' }} />
          KYC Verificado
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full font-syne font-bold text-sm cursor-pointer"
          style={{ background: '#F4A026', color: '#1A2B4A' }}>
          {getInitials()}
        </div>
      </div>
    </nav>
  )
}
