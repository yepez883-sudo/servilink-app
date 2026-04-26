'use client'
import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import ProCard from '../../components/shared/ProCard'
import ConformidadModal from '../../components/shared/ConformidadModal'
import RatingModal from '../../components/shared/RatingModal'
import FeaturedCarousel from '../../components/shared/FeaturedCarousel'
import { useGeolocation } from '../../lib/useGeolocation'
import { CATEGORIES, PROFESSIONALS } from '../../lib/data'

const SIDEBAR_ITEMS = [
  { icon: '🔍', label: 'Buscar técnicos' },
  { icon: '📋', label: 'Mis trabajos', badge: 3 },
  { icon: '💬', label: 'Mensajes', badge: 2 },
  { icon: '⭐', label: 'Favoritos' },
  { icon: '👤', label: 'Mi perfil KYC' },
]

const MY_JOBS = [
  { id: '1', icon: '⚡', iconBg: '#FEF3C7', title: 'Instalación eléctrica', tech: 'Ing. Diego Ferrara', date: '20/04', status: 'conform', service: 'Electricidad' },
  { id: '2', icon: '📷', iconBg: '#D1FAE5', title: 'CCTV 4 cámaras', tech: 'SegurTec SRL', date: '15/04', status: 'rate', service: 'CCTV / Cámaras' },
  { id: '3', icon: '🚪', iconBg: '#EEF2FF', title: 'Portón automático', tech: 'TechPuertas', date: '10/04', status: 'done', service: 'Portones' },
]

export default function ClientePage() {
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [conformModal, setConformModal] = useState<{ tech: string; service: string } | null>(null)
  const [rateModal, setRateModal] = useState<{ tech: string; service: string } | null>(null)
  const [tab, setTab] = useState<'search' | 'jobs'>('search')
  const [manualZoneInput, setManualZoneInput] = useState('')
  const { geo, requestGPS, setManualZone } = useGeolocation()

  const filtered = PROFESSIONALS.filter(p => {
    const q = query.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q))
    const matchCat = !selectedCat || p.services.some(s =>
      CATEGORIES.find(c => c.id === selectedCat)?.name.toLowerCase() === s.toLowerCase()
    )
    return matchQ && matchCat
  }).sort((a, b) => {
    if (geo.zone) {
      const zone = geo.zone.toLowerCase().split(',')[0]
      const aMatch = a.zone.toLowerCase().includes(zone) ? -1 : 0
      const bMatch = b.zone.toLowerCase().includes(zone) ? -1 : 0
      if (aMatch !== bMatch) return aMatch - bMatch
    }
    return parseInt(b.boost) - parseInt(a.boost)
  })

  const geoStatusLabel = () => {
    if (geo.status === 'loading') return '📡 Detectando tu ubicación...'
    if (geo.status === 'granted' || geo.status === 'manual') return `📍 ${geo.zone}`
    if (geo.status === 'denied') return '📍 Ubicación no disponible'
    return '📡 Detectando ubicación...'
  }

  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-5 min-h-screen" style={{ background: '#F6F5F1' }}>
        <Sidebar items={SIDEBAR_ITEMS} />

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-5">
            {[
              { id: 'search', label: '🔍 Buscar técnicos' },
              { id: 'jobs', label: '📋 Mis trabajos' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? '#1A2B4A' : '#fff',
                  color: tab === t.id ? '#fff' : '#6B7280',
                  border: tab === t.id ? '1.5px solid #1A2B4A' : '1.5px solid #E8E5DE',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'search' && (
            <>
              {/* Search hero */}
              <div className="rounded-2xl p-7 mb-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B6E 100%)' }}>
                <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10"
                  style={{ background: '#F4A026', transform: 'translate(30%, -30%)' }} />
                <h1 className="font-bold text-2xl text-white mb-2">Encontrá el profesional ideal</h1>

                {/* Geo status */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                    {geoStatusLabel()}
                  </span>
                  {geo.status === 'denied' && (
                    <button className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: '#F4A026', color: '#1A2B4A', border: 'none', cursor: 'pointer' }}
                      onClick={requestGPS}>
                      Activar GPS
                    </button>
                  )}
                </div>

                {/* Manual zone input */}
                {geo.status === 'denied' && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={manualZoneInput}
                      onChange={e => setManualZoneInput(e.target.value)}
                      placeholder="Escribí tu barrio o ciudad (ej: Yerba Buena)"
                      className="flex-1 h-9 rounded-xl px-3 text-sm outline-none"
                      style={{ border: 'none', background: 'rgba(255,255,255,0.9)', color: '#1A2B4A', fontFamily: 'DM Sans, sans-serif' }}
                    />
                    <button
                      className="px-4 rounded-xl text-sm font-semibold"
                      style={{ background: '#F4A026', color: '#1A2B4A', border: 'none', cursor: 'pointer' }}
                      onClick={() => manualZoneInput.trim() && setManualZone(manualZoneInput.trim())}
                    >
                      Buscar
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ej: electricista, plomero, CCTV..."
                    className="flex-1 h-11 rounded-xl px-4 text-sm outline-none"
                    style={{ border: 'none', background: 'rgba(255,255,255,0.95)', color: '#1A2B4A', fontFamily: 'DM Sans, sans-serif' }}
                  />
                  <button className="px-6 rounded-xl font-bold text-sm"
                    style={{ background: '#F4A026', color: '#1A2B4A', border: 'none', cursor: 'pointer' }}>
                    Buscar
                  </button>
                </div>
              </div>

              {/* Featured techs carousel */}
              <FeaturedCarousel userZone={geo.zone} />

              {/* Categories */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Categorías</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id}
                      onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all"
                      style={{
                        border: selectedCat === cat.id ? '1.5px solid #1A2B4A' : '1.5px solid #E8E5DE',
                        background: selectedCat === cat.id ? '#1A2B4A' : '#fff',
                        color: selectedCat === cat.id ? '#fff' : '#1A2B4A',
                      }}>
                      <span>{cat.emoji}</span><span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
                  {filtered.length} profesional{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                  {geo.zone ? ` cerca de ${geo.zone}` : ''}
                </p>
                {geo.zone && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: '#D1FAE5', color: '#065F46' }}>
                    📍 Ordenados por cercanía
                  </span>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">🔍</div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>No encontramos técnicos para esa búsqueda.</p>
                </div>
              ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                  {filtered.map(pro => (
                    <ProCard key={pro.id} pro={pro}
                      onContact={p => setConformModal({ tech: p.name, service: p.services[0] })} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'jobs' && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
                <h2 className="font-bold text-base" style={{ color: '#1A2B4A' }}>Mis trabajos contratados</h2>
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: '#EEF2FF', color: '#3730A3' }}>{MY_JOBS.length} trabajos</span>
              </div>
              {MY_JOBS.map(job => (
                <div key={job.id} className="flex items-center gap-4 px-6 py-4 border-b transition-colors cursor-pointer hover:bg-gray-50"
                  style={{ borderColor: '#E8E5DE' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: job.iconBg }}>{job.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: '#1A2B4A' }}>{job.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{job.tech} · {job.date}</p>
                  </div>
                  <div>
                    {job.status === 'conform' && (
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                        style={{ background: '#FEF3C7', color: '#92400E', border: 'none' }}
                        onClick={() => setConformModal({ tech: job.tech, service: job.service })}>
                        ✍️ Firmar conformidad
                      </button>
                    )}
                    {job.status === 'rate' && (
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
                        style={{ background: '#FEF3C7', color: '#92400E', border: 'none' }}
                        onClick={() => setRateModal({ tech: job.tech, service: job.service })}>
                        ⭐ Calificar
                      </button>
                    )}
                    {job.status === 'done' && (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: '#D1FAE5', color: '#065F46' }}>✓ Calificado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {conformModal && (
        <ConformidadModal techName={conformModal.tech} service={conformModal.service}
          onClose={() => setConformModal(null)} onSign={() => setConformModal(null)} />
      )}
      {rateModal && (
        <RatingModal techName={rateModal.tech} service={rateModal.service}
          onClose={() => setRateModal(null)} />
      )}
    </>
  )
}
