'use client'
import { useState, useEffect, useRef } from 'react'

interface Offer {
  id: string
  emoji: string
  brand: string
  product: string
  price: string
  discount?: string
  rubros: string[]
  passes: number // pases por día — determina el orden y frecuencia
  badge?: string
  badgeBg?: string
  badgeColor?: string
  phone?: string
}

// Ofertas de proveedores con sus rubros y pases/día
const ALL_OFFERS: Offer[] = [
  {
    id: '1', emoji: '⚡', brand: 'ElectroMax',
    product: 'Cable unipolar 2.5mm x 100m', price: '$28.500', discount: '$35.000',
    rubros: ['electricidad', 'alarma-robo', 'alarma-incendio', 'portones'],
    passes: 10, badge: '🔥 Más vendido', badgeBg: '#FEE2E2', badgeColor: '#991B1B',
    phone: '3814000001',
  },
  {
    id: '2', emoji: '📷', brand: 'SegurStock',
    product: 'Kit CCTV 8 canales 4K Hikvision', price: '$185.000', discount: '$220.000',
    rubros: ['cctv', 'alarma-robo', 'videoportero', 'portero'],
    passes: 10, badge: '⚡ Oferta hoy', badgeBg: '#FEF3C7', badgeColor: '#92400E',
    phone: '3814000002',
  },
  {
    id: '3', emoji: '🌐', brand: 'NetPro',
    product: 'Switch 24 puertos gigabit TP-Link', price: '$42.000',
    rubros: ['redes', 'telefonia', 'computacion'],
    passes: 5, badge: 'Nuevo', badgeBg: '#D1FAE5', badgeColor: '#065F46',
    phone: '3814000003',
  },
  {
    id: '4', emoji: '❄️', brand: 'FríoTec',
    product: 'Gas R32 botella 10kg', price: '$38.000', discount: '$45.000',
    rubros: ['aire-acond', 'refrigeracion'],
    passes: 5, badge: '❄️ Temporada', badgeBg: '#EFF6FF', badgeColor: '#1E3A8A',
    phone: '3814000004',
  },
  {
    id: '5', emoji: '🚨', brand: 'AlarmStore',
    product: 'Central DSC Power 1832 + teclado', price: '$95.000',
    rubros: ['alarma-robo', 'alarma-incendio', 'cctv'],
    passes: 5, badge: 'Promo', badgeBg: '#EEF2FF', badgeColor: '#3730A3',
    phone: '3814000005',
  },
  {
    id: '6', emoji: '🔧', brand: 'PlomStock',
    product: 'Cañería PPR 20mm x 4m (pack x10)', price: '$18.500',
    rubros: ['plomeria', 'gasista'],
    passes: 2, badge: 'Stock', badgeBg: '#F0FDF4', badgeColor: '#14532D',
    phone: '3814000006',
  },
  {
    id: '7', emoji: '🚪', brand: 'MotorPuertas',
    product: 'Motor CAME BXV 400kg portón corredizo', price: '$125.000', discount: '$148.000',
    rubros: ['portones', 'herreria', 'automatizacion'],
    passes: 2, badge: '🚪 Top ventas', badgeBg: '#FFF7ED', badgeColor: '#9A3412',
    phone: '3814000007',
  },
  {
    id: '8', emoji: '🧱', brand: 'ConstruMax',
    product: 'Placa Durlock 12.5mm (pack x10)', price: '$55.000',
    rubros: ['durlock', 'albanileria', 'construccion'],
    passes: 2,
    phone: '3814000008',
  },
  {
    id: '9', emoji: '💻', brand: 'TechParts',
    product: 'SSD 1TB Samsung 870 EVO', price: '$68.000', discount: '$82.000',
    rubros: ['computacion', 'electronica'],
    passes: 1,
    phone: '3814000009',
  },
  {
    id: '10', emoji: '🔔', brand: 'VideoPortero SA',
    product: 'Videoportero IP color 7" Bticino', price: '$78.000',
    rubros: ['videoportero', 'portero', 'cctv'],
    passes: 1,
    phone: '3814000010',
  },
]

interface OfferCarouselProps {
  activeRubros?: string[] // rubros del técnico logueado
}

export default function OfferCarousel({ activeRubros }: OfferCarouselProps) {
  // Filtrar por rubro y ordenar por pases (boost) descendente
  const rubros = activeRubros && activeRubros.length > 0 ? activeRubros : null
  const filtered = ALL_OFFERS
    .filter(o => !rubros || o.rubros.some(r => rubros.includes(r)))
    .sort((a, b) => b.passes - a.passes)

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-rotate según pases: más pases = más tiempo visible (proporcional)
  useEffect(() => {
    if (filtered.length <= 1) return
    const offer = filtered[current]
    const delay = Math.max(2500, offer.passes * 600) // 10x = 6s, 1x = 2.5s

    intervalRef.current = setTimeout(() => {
      if (!paused) setCurrent(c => (c + 1) % filtered.length)
    }, delay)

    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [current, paused, filtered.length])

  if (filtered.length === 0) return null

  const offer = filtered[current]

  const passLabel = (p: number) => {
    if (p >= 10) return { label: '10x', bg: '#EEF2FF', color: '#3730A3' }
    if (p >= 5)  return { label: '5x',  bg: '#FEE2E2', color: '#991B1B' }
    if (p >= 2)  return { label: '2x',  bg: '#FEF3C7', color: '#92400E' }
    return              { label: '1x',  bg: '#F1EFE8', color: '#5F5E5A' }
  }

  const pl = passLabel(offer.passes)

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
          📢 Ofertas para vos — proveedores
        </p>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          {current + 1} / {filtered.length}
        </p>
      </div>

      {/* Carrusel */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
        style={{ border: '1.5px solid #E8E5DE', background: '#fff' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Barra de boost top */}
        <div className="h-1 w-full" style={{ background: offer.passes >= 10 ? '#3730A3' : offer.passes >= 5 ? '#F4A026' : offer.passes >= 2 ? '#2DD4BF' : '#E8E5DE' }} />

        <div className="flex items-center gap-4 p-4">
          {/* Emoji */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: '#F6F5F1', border: '1px solid #E8E5DE' }}>
            {offer.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>{offer.brand}</p>
              {offer.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: offer.badgeBg || '#F6F5F1', color: offer.badgeColor || '#6B7280' }}>
                  {offer.badge}
                </span>
              )}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto"
                style={{ background: pl.bg, color: pl.color }}>
                {pl.label} hoy
              </span>
            </div>
            <p className="font-syne font-bold text-sm mb-1" style={{ color: '#1A2B4A' }}>{offer.product}</p>
            <div className="flex items-center gap-2">
              <p className="font-syne font-bold text-lg" style={{ color: '#1A2B4A' }}>{offer.price}</p>
              {offer.discount && (
                <p className="text-sm line-through" style={{ color: '#9CA3AF' }}>{offer.discount}</p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/54${offer.phone}?text=Hola, vi tu oferta de "${offer.product}" en ServiLink`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-4 py-2 rounded-xl text-center no-underline"
              style={{ background: '#25D366', color: '#fff' }}
              onClick={e => e.stopPropagation()}
            >
              📲 Consultar
            </a>
            <button
              className="text-xs font-medium px-4 py-1.5 rounded-xl"
              style={{ background: '#F6F5F1', color: '#6B7280', border: '1px solid #E8E5DE' }}
              onClick={() => setCurrent(c => (c + 1) % filtered.length)}
            >
              Ver siguiente →
            </button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 pb-3">
          {filtered.slice(0, 8).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                background: i === current ? '#1A2B4A' : '#E8E5DE',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
          {filtered.length > 8 && (
            <span className="text-xs" style={{ color: '#9CA3AF' }}>+{filtered.length - 8}</span>
          )}
        </div>
      </div>
    </div>
  )
}
