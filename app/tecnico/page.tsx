'use client'
import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import StatCard from '../../components/ui/StatCard'
import OfferCarousel from '../../components/shared/OfferCarousel'
import AuthGate from '../../components/shared/AuthGate'
import { CATEGORIES, MOCK_REQUESTS, BOOST_OPTIONS } from '../../lib/data'

const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📋', label: 'Solicitudes', badge: 4 },
  { icon: '📢', label: 'Visibilidad' },
  { icon: '⭐', label: 'Mis reseñas' },
  { icon: '👤', label: 'Perfil KYC' },
  { icon: '⚙️', label: 'Configuración' },
]

const MY_SERVICES = ['electricidad', 'cctv', 'portones', 'alarma-robo', 'redes', 'videoportero']

const VIS_ROWS = [
  { service: 'Electricidad', zone: 'Zona centro', boost: '2x', views: 89, contacts: 7 },
  { service: 'CCTV / Cámaras', zone: 'Zona norte', boost: '1x', views: 41, contacts: 3 },
  { service: 'Automatización', zone: 'Gran Tucumán', boost: '5x', views: 117, contacts: 8 },
  { service: 'Alarmas', zone: 'Zona sur', boost: '1x', views: 22, contacts: 1 },
]

const BOOST_COLORS: Record<string, string> = {
  '1x': '#6B7280', '2x': '#92400E', '5x': '#991B1B', '10x': '#3730A3'
}
const BOOST_BG: Record<string, string> = {
  '1x': '#F1EFE8', '2x': '#FEF3C7', '5x': '#FEE2E2', '10x': '#EEF2FF'
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pendiente' },
  active:  { bg: '#D1FAE5', text: '#065F46', label: 'En curso' },
  done:    { bg: '#EEF2FF', text: '#3730A3', label: 'Completado' },
}

export default function TecnicoPage() {
  const [activeServices, setActiveServices] = useState<string[]>(MY_SERVICES)
  const [boostModal, setBoostModal] = useState<{ service: string } | null>(null)
  const [selectedBoost, setSelectedBoost] = useState<number | null>(null)
  const [boostedRows, setBoostedRows] = useState<Record<string, string>>({})

  const toggleService = (id: string) => {
    setActiveServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const applyBoost = () => {
    if (!boostModal || !selectedBoost) return
    const opt = BOOST_OPTIONS.find(o => o.x === selectedBoost)
    if (opt && opt.price > 0) {
      setBoostedRows(prev => ({ ...prev, [boostModal.service]: `${selectedBoost}x` }))
    }
    setBoostModal(null)
    setSelectedBoost(null)
  }

  return (
    <AuthGate requiredRole="tecnico">
    <>
      <Navbar />
      <div className="flex gap-5 p-5" style={{ background: '#F6F5F1', minHeight: 'calc(100vh - 56px)' }}>
        <Sidebar items={SIDEBAR_ITEMS} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Solicitudes este mes" value="47" change="↑ 18% vs mes anterior" />
            <StatCard label="Calificación" value="4.8 ⭐" change="32 reseñas verificadas" />
            <StatCard label="Perfil visto hoy" value="247" change="↑ boost 2x activo" />
            <StatCard label="Contactos hoy" value="18" change="↑ 34%" />
          </div>

          {/* Ofertas de proveedores — carrusel filtrado por rubros del técnico */}
          <OfferCarousel activeRubros={activeServices} />

          {/* Requests */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Solicitudes recientes</h2>
              <button className="text-sm" style={{ color: '#3B82F6', border: 'none', background: 'none', cursor: 'pointer' }}>Ver todas →</button>
            </div>
            {MOCK_REQUESTS.map(req => {
              const st = STATUS_STYLE[req.status]
              return (
                <div key={req.id} className="flex items-center gap-4 px-6 py-4 border-b cursor-pointer transition-colors"
                  style={{ borderColor: '#E8E5DE' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F6F5F1')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: req.iconBg }}>{req.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: '#1A2B4A' }}>{req.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{req.client} · {req.location} · hace {req.ago}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: st.bg, color: st.text }}>{st.label}</span>
                </div>
              )
            })}
          </div>

          {/* Visibility table */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Visibilidad en el buscador</h2>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Pagá por día para aparecer más veces cuando un cliente busca tu servicio. ServiLink no cobra comisión por trabajos.</p>
            </div>
            <div className="px-6 py-3" style={{ background: '#EEF2FF', borderBottom: '1px solid #E8E5DE' }}>
              <p className="text-xs" style={{ color: '#3730A3' }}>
                💡 El pago entre vos y tus clientes es directo y acordado entre las partes. ServiLink gana cuando aumentás tu visibilidad.
              </p>
            </div>
            {/* Header */}
            <div className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wide border-b"
              style={{ gridTemplateColumns: '1fr 80px 80px 100px 110px', borderColor: '#E8E5DE', color: '#6B7280' }}>
              <span>Servicio / Zona</span><span>Boost</span><span>Vistas</span><span>Contactos</span><span>Acción</span>
            </div>
            {VIS_ROWS.map((row, i) => {
              const boost = boostedRows[row.service] || row.boost
              return (
                <div key={i} className="grid px-6 py-4 border-b items-center text-sm transition-colors"
                  style={{ gridTemplateColumns: '1fr 80px 80px 100px 110px', borderColor: '#E8E5DE' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F6F5F1')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div>
                    <p className="font-medium" style={{ color: '#1A2B4A' }}>{row.service}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{row.zone}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg w-fit"
                    style={{ background: BOOST_BG[boost], color: BOOST_COLORS[boost] }}>{boost}</span>
                  <span style={{ color: '#1A2B4A' }}>{row.views}</span>
                  <span style={{ color: '#10B981', fontWeight: 500 }}>{row.contacts} contactos</span>
                  <button
                    className="text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                    style={{ background: '#F4A026', color: '#1A2B4A', border: 'none', cursor: 'pointer' }}
                    onClick={() => { setBoostModal({ service: row.service }); setSelectedBoost(null) }}>
                    Aumentar ↑
                  </button>
                </div>
              )
            })}
          </div>

          {/* My services */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Mis servicios activos</h2>
              <span className="text-xs" style={{ color: '#6B7280' }}>{activeServices.length} activos</span>
            </div>
            <div className="p-4 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {CATEGORIES.map(cat => {
                const on = activeServices.includes(cat.id)
                return (
                  <button key={cat.id} onClick={() => toggleService(cat.id)}
                    className="flex items-center gap-2 p-3 rounded-xl text-sm text-left transition-all"
                    style={{
                      border: on ? '1.5px solid #1A2B4A' : '1.5px solid #E8E5DE',
                      background: on ? '#EEF2FF' : '#F6F5F1',
                      color: on ? '#1A2B4A' : '#6B7280',
                      fontWeight: on ? 600 : 400,
                    }}>
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="flex-1 text-xs">{cat.name}</span>
                    {on && <span className="text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* KYC */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Estado de verificación KYC</h2>
            </div>
            <div className="p-6">
              <div className="flex gap-0 mb-4">
                {[
                  { label: 'DNI / CUIL', sub: 'Verificado', status: 'done' },
                  { label: 'Selfie', sub: 'Aprobado', status: 'done' },
                  { label: 'Certificación', sub: 'En revisión', status: 'current' },
                  { label: 'Habilitado', sub: 'Pendiente', status: 'pending' },
                ].map((k, i, arr) => (
                  <div key={k.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className="kyc-step-num"
                        style={{
                          background: k.status === 'done' ? '#10B981' : k.status === 'current' ? '#1A2B4A' : '#E8E5DE',
                          color: k.status !== 'pending' ? '#fff' : '#6B7280',
                        }}>
                        {k.status === 'done' ? '✓' : i + 1}
                      </div>
                      <p className="text-xs font-medium text-center" style={{ color: '#1A2B4A', whiteSpace: 'nowrap' }}>{k.label}</p>
                      <p className="text-xs text-center" style={{ color: '#6B7280' }}>{k.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2 mb-6"
                        style={{ background: k.status === 'done' ? '#10B981' : '#E8E5DE' }} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Tu certificación está en revisión. Tiempo estimado: 24-48 hs. hábiles. Recibirás un email cuando sea aprobada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Boost modal */}
      {boostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setBoostModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5" style={{ background: '#1A2B4A' }}>
              <h3 className="font-syne font-bold text-lg text-white">Aumentar visibilidad</h3>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {boostModal.service} · Elegí cuántas veces aparecés hoy
              </p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {BOOST_OPTIONS.map(opt => (
                <button key={opt.x}
                  onClick={() => setSelectedBoost(opt.x)}
                  className="flex items-center gap-4 p-4 rounded-xl text-left transition-all w-full"
                  style={{
                    border: selectedBoost === opt.x ? '2px solid #1A2B4A' : '1.5px solid #E8E5DE',
                    background: selectedBoost === opt.x ? '#F6F5F1' : '#fff',
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-syne font-bold text-lg flex-shrink-0"
                    style={{ background: BOOST_BG[`${opt.x}x`], color: BOOST_COLORS[`${opt.x}x`] }}>
                    {opt.x}x
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: '#1A2B4A' }}>{opt.label} — {opt.x} pase{opt.x > 1 ? 's' : ''}/día</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{opt.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>{opt.priceLabel}</p>
                    {opt.price > 0 && <p className="text-xs" style={{ color: '#6B7280' }}>por día</p>}
                  </div>
                </button>
              ))}
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button className="btn-outline flex-1" onClick={() => setBoostModal(null)}>Cancelar</button>
              <button className="btn-primary flex-1 justify-center"
                disabled={!selectedBoost}
                style={{ opacity: selectedBoost ? 1 : 0.4 }}
                onClick={applyBoost}>
                Confirmar y pagar →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    </AuthGate>
  )
}
