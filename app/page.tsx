import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#1A2B4A' }}>
      {/* Navbar */}
      <nav className="flex items-center px-8 py-5">
        <div className="flex items-center gap-2">
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
          <span className="font-syne font-bold text-2xl text-white">ServiLink</span>
        </div>
        <div className="ml-auto flex gap-3">
          <Link href="/auth/login" className="btn-outline text-white border-white/30 no-underline text-sm py-2 px-5"
            style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)', background: 'transparent' }}>
            Iniciar sesión
          </Link>
          <Link href="/auth/registro" className="btn-accent no-underline text-sm py-2 px-5">
            Registrarse gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
          style={{ background: 'rgba(244,160,38,0.15)', color: '#F4A026', border: '1px solid rgba(244,160,38,0.3)' }}>
          ✓ Todos los técnicos verificados con KYC
        </div>

        <h1 className="font-syne font-black text-5xl md:text-6xl text-white mb-6 leading-tight">
          Conectamos clientes<br />
          con <span style={{ color: '#F4A026' }}>técnicos verificados</span>
        </h1>

        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
          Electricistas, plomeros, CCTV, alarmas, aire acondicionado y 18 servicios más. 
          Encontrá al profesional ideal en minutos.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/cliente" className="btn-accent text-base py-3 px-8 no-underline">
            Buscar un técnico →
          </Link>
          <Link href="/auth/registro" className="btn-outline text-base py-3 px-8 no-underline"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'transparent' }}>
            Soy técnico / instalador
          </Link>
        </div>
      </section>

      {/* Role cards */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🏠', role: 'Cliente', color: '#F4A026',
              desc: 'Buscá técnicos verificados, leé reseñas reales y contactalos directamente. El pago lo acordás con ellos.',
              cta: 'Buscar técnico', href: '/cliente',
            },
            {
              icon: '🔧', role: 'Técnico / Instalador', color: '#2DD4BF',
              desc: 'Creá tu perfil con KYC, listá todos tus servicios y aumentá tu visibilidad para aparecer más veces en el buscador.',
              cta: 'Registrarse como técnico', href: '/tecnico',
            },
            {
              icon: '📦', role: 'Proveedor', color: '#818CF8',
              desc: 'Ofertá tus productos a toda la red de técnicos e instaladores. Hasta 5 ofertas gratis por mes.',
              cta: 'Empezar a ofertar', href: '/proveedor',
            },
          ].map(card => (
            <div key={card.role} className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">{card.role}</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{card.desc}</p>
              <Link href={card.href}
                className="text-sm font-semibold no-underline"
                style={{ color: card.color }}>
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Key features */}
      <section className="px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-syne font-bold text-3xl text-white text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '🔒', title: 'Verificación KYC', desc: 'Todos los técnicos verifican su identidad con DNI/CUIL y selfie antes de publicar su perfil.' },
              { icon: '⭐', title: 'Calificaciones reales', desc: 'Solo los clientes que contrataron el servicio pueden calificar. Sin reseñas falsas.' },
              { icon: '💼', title: 'Sin intermediación económica', desc: 'El acuerdo de pago es directo entre vos y el técnico. ServiLink no cobra comisión.' },
              { icon: '📢', title: 'Visibilidad paga para técnicos', desc: 'Los técnicos pueden pagar para aparecer más veces en el buscador. Más visibilidad, más contactos.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h4 className="font-syne font-bold text-white mb-1">{f.title}</h4>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 py-8 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2025 ServiLink · Tucumán, Argentina · Todos los derechos reservados
        </p>
      </footer>
    </main>
  )
}
