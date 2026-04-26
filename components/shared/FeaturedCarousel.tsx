'use client'
import { useState, useEffect, useRef } from 'react'

interface FeaturedTech {
  id: string
  initials: string
  avatarBg: string
  avatarColor: string
  name: string
  type: string
  rating: number
  reviews: number
  services: string[]
  zone: string
  desde: string
  verified: boolean
  boost: number // pases/día pagados — determina orden y frecuencia
  badge?: string
  phone?: string
}

const FEATURED_TECHS: FeaturedTech[] = [
  {
    id: '1', initials: 'ST', avatarBg: '#EEF2FF', avatarColor: '#3730A3',
    name: 'SegurTec SRL', type: 'Empresa de seguridad',
    rating: 4.9, reviews: 95,
    services: ['CCTV', 'Alarmas', 'Videoportero'],
    zone: 'Tucumán y alrededores', desde: '$25.000',
    verified: true, boost: 10, badge: '⭐ Top empresa',
    phone: '3814000010',
  },
  {
    id: '2', initials: 'DF', avatarBg: '#FEF3C7', avatarColor: '#92400E',
    name: 'Ing. Diego Ferrara', type: 'Electricista matriculado',
    rating: 4.9, reviews: 48,
    services: ['Electricidad', 'Portones', 'Alarmas'],
    zone: 'Tucumán centro', desde: '$12.000',
    verified: true, boost: 10, badge: '🔥 Más contratado',
    phone: '3814000011',
  },
  {
    id: '3', initials: 'FC', avatarBg: '#EFF6FF', avatarColor: '#1E3A8A',
    name: 'FríoCalor HVAC', type: 'Climatización',
    rating: 4.8, reviews: 56,
    services: ['Aire Acond.', 'Refrigeración'],
    zone: 'Gran Tucumán', desde: '$18.000',
    verified: true, boost: 5, badge: '❄️ Especialista',
    phone: '3814000012',
  },
  {
    id: '4', initials: 'LM', avatarBg: '#F0FDF4', avatarColor: '#14532D',
    name: 'Arq. Laura Méndez', type: 'Arquitecta + Ing. Civil',
    rating: 5.0, reviews: 17,
    services: ['Arquitectura', 'Construcción'],
    zone: 'Tucumán capital', desde: '$50.000',
    verified: true, boost: 5, badge: '🏆 Mejor calificada',
    phone: '3814000013',
  },
]

interface FeaturedCarouselProps {
  userZone?: string | null
}

export default function FeaturedCarousel({ userZone }: FeaturedCarouselProps) {
  // Ordenar por boost descendente
  const techs = [...FEATURED_TECHS]
    .filter(t => !userZone || t.zone.toLowerCase().includes(userZone.toLowerCase()) || true)
    .sort((a, b) => b.boost - a.boost)

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (techs.length <= 1) return
    const tech = techs[current]
    const delay = Math.max(3000, tech.boost * 500)
    timerRef.current = setTimeout(() => {
      if (!paused) setCurrent(c => (c + 1) % techs.length)
    }, delay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, techs.length])

  if (techs.length === 0) return null
  const tech = techs[current]

  const boostColor = tech.boost >= 10 ? '#3730A3' : tech.boost >= 5 ? '#F4A026' : '#2DD4BF'

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
          ⭐ Técnicos destacados
        </p>
        <p className="text-xs" style={{ color: '#6B7280' }}>{current + 1} / {techs.length}</p>
      </div>

      <div
        className="rounded-2xl overflow-hidden cursor-pointer transition-all"
        style={{ border: '2px solid #F4A026', background: '#FFFBF2' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Barra superior dorada */}
        <div className="h-1 w-full" style={{ background: boostColor }} />

        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 relative"
            style={{ background: tech.avatarBg, color: tech.avatarColor }}>
            {tech.initials}
            {tech.verified && (
              <span className="absolute -bottom-1 -right-1 text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">✓</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="font-bold text-sm" style={{ color: '#1A2B4A' }}>{tech.name}</p>
              {tech.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#FEF3C7', color: '#92400E' }}>
                  {tech.badge}
                </span>
              )}
            </div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{tech.type} · 📍 {tech.zone}</p>
            <div className="flex items-center gap-2">
              <span style={{ color: '#F4A026', fontSize: 12 }}>{'★'.repeat(Math.round(tech.rating))}</span>
              <span className="text-xs font-bold" style={{ color: '#1A2B4A' }}>{tech.rating}</span>
              <span className="text-xs" style={{ color: '#6B7280' }}>({tech.reviews} reseñas)</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {tech.services.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-lg"
                  style={{ background: '#EEF2FF', color: '#3730A3', fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div className="text-right mb-1">
              <p className="text-xs" style={{ color: '#6B7280' }}>Desde</p>
              <p className="font-bold text-base" style={{ color: '#1A2B4A' }}>{tech.desde}</p>
            </div>
            <a
              href={`https://wa.me/54${tech.phone}?text=Hola ${tech.name}, te vi en ServiLink y quiero consultarte`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-4 py-2 rounded-xl text-center no-underline"
              style={{ background: '#25D366', color: '#fff' }}
            >
              📲 Contactar
            </a>
            <button
              className="text-xs font-medium px-4 py-1.5 rounded-xl"
              style={{ background: '#F6F5F1', color: '#6B7280', border: '1px solid #E8E5DE' }}
              onClick={() => setCurrent(c => (c + 1) % techs.length)}
            >
              Ver siguiente →
            </button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 pb-3">
          {techs.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 16 : 6, height: 6,
                background: i === current ? '#F4A026' : '#E8E5DE',
                border: 'none', cursor: 'pointer', padding: 0,
              }} />
          ))}
        </div>
      </div>
    </div>
  )
}
