'use client'
import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import StatCard from '../../components/ui/StatCard'
import { PROVIDER_PLANS, CATEGORIES } from '../../lib/data'

const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📢', label: 'Mis ofertas', badge: 3 },
  { icon: '📈', label: 'Estadísticas' },
  { icon: '💳', label: 'Suscripción' },
  { icon: '👤', label: 'Empresa KYC' },
]

const ACTIVE_OFFERS = [
  { emoji: '📡', name: 'Antena Yagi MIMO 4G', price: '$8.500', cat: 'Redes / WiFi', passes: 3, badge: '🔥 Popular', badgeBg: '#FEE2E2', badgeColor: '#991B1B' },
  { emoji: '📷', name: 'Kit CCTV 8 canales 4K', price: '$185.000', cat: 'Instaladores CCTV', passes: 1, badge: 'Nuevo', badgeBg: '#D1FAE5', badgeColor: '#065F46' },
  { emoji: '🔌', name: 'Tablero bifásico 24 circuitos', price: '$62.000', cat: 'Electricistas', passes: 2, badge: 'Promo', badgeBg: '#EEF2FF', badgeColor: '#3730A3' },
]

export default function ProveedorPage() {
  const [currentPlan, setCurrentPlan] = useState('starter')
  const [offerCount, setOfferCount] = useState(3)
  const [product, setProduct] = useState('')
  const [price, setPrice] = useState('')
  const [cat, setCat] = useState('')
  const [passes, setPasses] = useState('1')
  const [offers, setOffers] = useState(ACTIVE_OFFERS)
  const [toast, setToast] = useState('')

  const plan = PROVIDER_PLANS.find(p => p.id === currentPlan)!
  const maxOffers = plan.offers
  const passOptions = [
    { val: '1', label: '1 vez/día (incluido)', extra: 0 },
    { val: '2', label: '2 veces/día (+$2.500)', extra: 2500 },
    { val: '5', label: '5 veces/día (+$5.000)', extra: 5000 },
    { val: '10', label: '10 veces/día (+$9.000)', extra: 9000 },
  ]

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const publishOffer = () => {
    if (!product.trim()) return showToast('Ingresá el nombre del producto')
    if (offerCount >= maxOffers) return showToast(`Límite del plan ${plan.name} (${maxOffers} ofertas). Actualizá tu plan.`)
    setOffers(prev => [{
      emoji: '📦', name: product, price: price || 'Consultar',
      cat: cat || 'Todos los técnicos', passes: parseInt(passes),
      badge: 'Nuevo', badgeBg: '#D1FAE5', badgeColor: '#065F46'
    }, ...prev])
    setOfferCount(c => c + 1)
    setProduct(''); setPrice(''); setCat(''); setPasses('1')
    showToast('¡Oferta publicada! Llegará a todos los técnicos de la categoría.')
  }

  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-5" style={{ background: '#F6F5F1', minHeight: 'calc(100vh - 56px)' }}>
        <Sidebar items={SIDEBAR_ITEMS} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Ofertas publicadas" value={`${offerCount}/${maxOffers}`} change={`Plan ${plan.name}`} />
            <StatCard label="Alcance hoy" value="2.104" change="técnicos activos" />
            <StatCard label="Clicks en ofertas" value="347" change="↑ 12% vs ayer" />
            <StatCard label="Conversiones" value="28" change="consultas recibidas" />
          </div>

          {/* Plans */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Plan de suscripción</h2>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Más ofertas = más técnicos ven tus productos. Cambiá de plan cuando quieras.</p>
            </div>
            <div className="p-5 grid md:grid-cols-3 gap-4">
              {PROVIDER_PLANS.map(pl => (
                <div key={pl.id}
                  className="rounded-2xl p-5 transition-all cursor-pointer"
                  style={{
                    border: currentPlan === pl.id ? '2px solid #1A2B4A' : pl.featured ? '2px solid #F4A026' : '1.5px solid #E8E5DE',
                    background: currentPlan === pl.id ? '#F6F5F1' : '#fff',
                  }}
                  onClick={() => setCurrentPlan(pl.id)}>
                  {pl.featured && currentPlan !== pl.id && (
                    <p className="text-xs font-bold mb-2" style={{ color: '#F4A026' }}>★ Más elegido</p>
                  )}
                  {currentPlan === pl.id && (
                    <p className="text-xs font-bold mb-2" style={{ color: '#10B981' }}>✓ Plan actual</p>
                  )}
                  <h3 className="font-syne font-bold text-lg" style={{ color: '#1A2B4A' }}>{pl.name}</h3>
                  <p className="font-syne font-black text-3xl mt-1" style={{ color: '#1A2B4A' }}>{pl.priceLabel}</p>
                  <p className="text-xs mb-4" style={{ color: '#6B7280' }}>/mes · {pl.period}</p>
                  <div className="flex flex-col gap-2">
                    {pl.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: f.ok ? '#1A2B4A' : '#9CA3AF' }}>
                        <span style={{ color: f.ok ? '#10B981' : '#EF4444', flexShrink: 0 }}>{f.ok ? '✓' : '✗'}</span>
                        {f.text}
                      </div>
                    ))}
                  </div>
                  {currentPlan !== pl.id && (
                    <button className="w-full mt-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: pl.featured ? '#F4A026' : 'transparent',
                        color: pl.featured ? '#1A2B4A' : '#1A2B4A',
                        border: pl.featured ? 'none' : '1.5px solid #1A2B4A',
                        cursor: 'pointer',
                      }}
                      onClick={e => { e.stopPropagation(); setCurrentPlan(pl.id); showToast(`Plan ${pl.name} activado`) }}>
                      {pl.price === 0 ? 'Usar gratis' : 'Contratar'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publish offer */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Publicar una oferta</h2>
              <div className="flex items-center gap-3">
                <div className="text-xs" style={{ color: '#6B7280' }}>{offerCount}/{maxOffers} ofertas usadas</div>
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#E8E5DE' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((offerCount / maxOffers) * 100, 100)}%`, background: offerCount >= maxOffers ? '#EF4444' : '#F4A026' }} />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Producto / Servicio</label>
                  <input className="sl-input" placeholder="Ej: Cámara IP Dahua 4MP" value={product} onChange={e => setProduct(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Precio de oferta</label>
                  <input className="sl-input" placeholder="$25.000" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Categoría de técnico</label>
                  <select className="sl-select" value={cat} onChange={e => setCat(e.target.value)}>
                    <option value="">Todos los técnicos</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Frecuencia diaria <span style={{ color: '#6B7280', fontWeight: 400 }}>(se cobra extra)</span></label>
                  <select className="sl-select" value={passes} onChange={e => setPasses(e.target.value)}>
                    {passOptions.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={publishOffer}>Publicar oferta →</button>
            </div>
          </div>

          {/* Active offers */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Ofertas activas</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {offers.map((offer, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: '#F6F5F1', border: '1px solid #E8E5DE' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-white"
                    style={{ border: '1px solid #E8E5DE' }}>{offer.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#1A2B4A' }}>{offer.name} — {offer.price}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Para {offer.cat} · {offer.passes} pase{offer.passes > 1 ? 's' : ''}/día</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ background: offer.badgeBg, color: offer.badgeColor }}>{offer.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium text-white shadow-xl animate-fade-in"
          style={{ background: '#1A2B4A' }}>
          {toast}
        </div>
      )}
    </>
  )
}
