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
  { icon: '👤', label: 'Mi perfil KYC' },
]

const ACTIVE_OFFERS = [
  { emoji: '📡', name: 'Antena Yagi MIMO 4G', price: '$8.500', cat: 'Redes / WiFi', passes: 3, badge: '🔥 Popular', badgeBg: '#FEE2E2', badgeColor: '#991B1B' },
  { emoji: '📷', name: 'Kit CCTV 8 canales 4K', price: '$185.000', cat: 'Instaladores CCTV', passes: 1, badge: 'Nuevo', badgeBg: '#D1FAE5', badgeColor: '#065F46' },
  { emoji: '🔌', name: 'Tablero bifásico 24 circuitos', price: '$62.000', cat: 'Electricistas', passes: 2, badge: 'Promo', badgeBg: '#EEF2FF', badgeColor: '#3730A3' },
]

// KYC steps for provider
const KYC_STEPS = ['Tipo', 'Datos', 'KYC', 'Listo']

export default function ProveedorPage() {
  // KYC / Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [kycStep, setKycStep] = useState(0)
  const [providerType, setProviderType] = useState<'empresa' | 'persona' | ''>('')

  // Profile data
  const [profile, setProfile] = useState({
    razonSocial: '',
    nombre: '',
    cuit: '',
    cuil: '',
    email: '',
    phone: '',
    password: '',
    rubro: '',
  })

  // KYC docs
  const [kycDocs, setKycDocs] = useState({ dni: false, selfie: false, constancia: false })

  // Dashboard state
  const [currentPlan, setCurrentPlan] = useState('starter')
  const [offerCount, setOfferCount] = useState(3)
  const [product, setProduct] = useState('')
  const [price, setPrice] = useState('')
  const [cat, setCat] = useState('')
  const [passes, setPasses] = useState('1')
  const [offers, setOffers] = useState(ACTIVE_OFFERS)
  const [toast, setToast] = useState('')

  const plan = PROVIDER_PLANS.find(p => p.id === currentPlan)!

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const publishOffer = () => {
    if (!product.trim()) return showToast('Ingresá el nombre del producto')
    if (offerCount >= plan.offers) return showToast(`Límite del plan ${plan.name} (${plan.offers} ofertas). Actualizá tu plan.`)
    setOffers(prev => [{
      emoji: '📦', name: product, price: price || 'Consultar',
      cat: cat || 'Todos los técnicos', passes: parseInt(passes),
      badge: 'Nuevo', badgeBg: '#D1FAE5', badgeColor: '#065F46'
    }, ...prev])
    setOfferCount(c => c + 1)
    setProduct(''); setPrice(''); setCat(''); setPasses('1')
    showToast('¡Oferta publicada! Llegará a todos los técnicos.')
  }

  const displayName = providerType === 'empresa' ? profile.razonSocial : profile.nombre

  // ============ KYC / REGISTRO FLOW ============
  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#1A2B4A' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">

            {/* Header */}
            <div className="px-8 py-5" style={{ background: '#1A2B4A' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
                <span className="font-bold text-lg text-white" style={{ fontFamily: 'Syne, sans-serif' }}>ServiLink · Proveedores</span>
              </div>
              {/* Step indicators */}
              <div className="flex items-center gap-0">
                {KYC_STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i < kycStep ? '#10B981' : i === kycStep ? '#F4A026' : 'rgba(255,255,255,0.2)',
                          color: i <= kycStep ? '#1A2B4A' : 'rgba(255,255,255,0.5)',
                          fontFamily: 'Syne, sans-serif',
                        }}>
                        {i < kycStep ? '✓' : i + 1}
                      </div>
                      <span className="text-xs hidden sm:inline" style={{ color: i === kycStep ? '#F4A026' : 'rgba(255,255,255,0.5)' }}>{s}</span>
                    </div>
                    {i < KYC_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2 mb-5"
                        style={{ background: i < kycStep ? '#10B981' : 'rgba(255,255,255,0.2)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-6">

              {/* Step 0: Tipo de proveedor */}
              {kycStep === 0 && (
                <div>
                  <h2 className="font-bold text-xl mb-1" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>¿Cómo vas a registrarte?</h2>
                  <p className="text-sm mb-5" style={{ color: '#6B7280' }}>Elegí si sos empresa o persona física</p>
                  <div className="flex flex-col gap-3 mb-6">
                    {[
                      { id: 'empresa', icon: '🏢', label: 'Empresa', desc: 'Razón social + CUIT' },
                      { id: 'persona', icon: '👤', label: 'Persona física', desc: 'Nombre completo + CUIL' },
                    ].map(t => (
                      <button key={t.id} type="button"
                        onClick={() => setProviderType(t.id as any)}
                        className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                        style={{
                          border: providerType === t.id ? '2px solid #1A2B4A' : '1.5px solid #E8E5DE',
                          background: providerType === t.id ? '#F6F5F1' : '#fff',
                        }}>
                        <span className="text-3xl">{t.icon}</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#1A2B4A' }}>{t.label}</p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>{t.desc}</p>
                        </div>
                        {providerType === t.id && <span className="ml-auto text-lg">✓</span>}
                      </button>
                    ))}
                  </div>
                  <button className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: providerType ? '#1A2B4A' : '#E8E5DE', color: providerType ? '#fff' : '#9CA3AF', border: 'none', cursor: providerType ? 'pointer' : 'not-allowed', fontFamily: 'Syne, sans-serif' }}
                    disabled={!providerType}
                    onClick={() => setKycStep(1)}>
                    Continuar →
                  </button>
                </div>
              )}

              {/* Step 1: Datos */}
              {kycStep === 1 && (
                <div>
                  <h2 className="font-bold text-xl mb-1" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>
                    {providerType === 'empresa' ? 'Datos de la empresa' : 'Tus datos personales'}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Completá todos los campos</p>
                  <div className="flex flex-col gap-3 mb-5">
                    {providerType === 'empresa' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Razón social</label>
                          <input className="sl-input" placeholder="Ej: ElectroMax SRL"
                            value={profile.razonSocial} onChange={e => setProfile(p => ({ ...p, razonSocial: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>CUIT</label>
                          <input className="sl-input" placeholder="30-12345678-9"
                            value={profile.cuit} onChange={e => setProfile(p => ({ ...p, cuit: e.target.value }))} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Nombre completo</label>
                          <input className="sl-input" placeholder="Juan Pérez"
                            value={profile.nombre} onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>CUIL</label>
                          <input className="sl-input" placeholder="20-12345678-9"
                            value={profile.cuil} onChange={e => setProfile(p => ({ ...p, cuil: e.target.value }))} />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Email</label>
                      <input className="sl-input" type="email" placeholder="contacto@empresa.com"
                        value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>
                        Teléfono / WhatsApp de contacto
                      </label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 rounded-xl text-sm font-medium"
                          style={{ background: '#F6F5F1', border: '1.5px solid #E8E5DE', color: '#6B7280', whiteSpace: 'nowrap' }}>
                          🇦🇷 +54
                        </span>
                        <input className="sl-input" placeholder="381 400-0000"
                          value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Los técnicos te contactarán por este número</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Rubro principal</label>
                      <select className="sl-select"
                        value={profile.rubro} onChange={e => setProfile(p => ({ ...p, rubro: e.target.value }))}>
                        <option value="">Seleccioná tu rubro</option>
                        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>Contraseña</label>
                      <input className="sl-input" type="password" placeholder="••••••••"
                        value={profile.password} onChange={e => setProfile(p => ({ ...p, password: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-outline flex-1" onClick={() => setKycStep(0)}>← Atrás</button>
                    <button className="btn-primary flex-1 justify-center" onClick={() => setKycStep(2)}>Continuar →</button>
                  </div>
                </div>
              )}

              {/* Step 2: KYC docs */}
              {kycStep === 2 && (
                <div>
                  <h2 className="font-bold text-xl mb-1" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>Verificación KYC</h2>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Requerido para publicar ofertas. Garantiza la confianza de los técnicos.</p>

                  {[
                    { key: 'dni', icon: '🪪', title: providerType === 'empresa' ? 'DNI del responsable legal' : 'Foto de DNI (frente y dorso)', desc: 'Documento claro y legible' },
                    { key: 'selfie', icon: '🤳', title: 'Selfie con DNI', desc: 'Una foto tuya sosteniendo el DNI' },
                    { key: 'constancia', icon: '📋', title: providerType === 'empresa' ? 'Constancia de inscripción AFIP' : 'Constancia de CUIL / monotributo', desc: 'Descargable desde afip.gob.ar' },
                  ].map((doc, i) => (
                    <div key={doc.key} className="flex gap-3 p-4 rounded-xl mb-3 transition-all"
                      style={{
                        border: kycDocs[doc.key as keyof typeof kycDocs] ? '1.5px solid #10B981' : '1.5px solid #E8E5DE',
                        background: kycDocs[doc.key as keyof typeof kycDocs] ? '#F0FDF4' : '#fff'
                      }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{
                          background: kycDocs[doc.key as keyof typeof kycDocs] ? '#10B981' : '#E8E5DE',
                          color: kycDocs[doc.key as keyof typeof kycDocs] ? '#fff' : '#6B7280',
                          fontFamily: 'Syne, sans-serif',
                        }}>
                        {kycDocs[doc.key as keyof typeof kycDocs] ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1A2B4A' }}>{doc.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{doc.desc}</p>
                        {!kycDocs[doc.key as keyof typeof kycDocs] && (
                          <button className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{ background: '#1A2B4A', color: '#fff', border: 'none', cursor: 'pointer' }}
                            onClick={() => setKycDocs(d => ({ ...d, [doc.key]: true }))}>
                            Subir archivo →
                          </button>
                        )}
                        {kycDocs[doc.key as keyof typeof kycDocs] && (
                          <p className="text-xs mt-1 font-semibold" style={{ color: '#10B981' }}>✓ Enviado correctamente</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 mt-4">
                    <button className="btn-outline flex-1" onClick={() => setKycStep(1)}>← Atrás</button>
                    <button className="btn-primary flex-1 justify-center"
                      onClick={() => setKycStep(3)}
                      disabled={!Object.values(kycDocs).every(Boolean)}
                      style={{ opacity: Object.values(kycDocs).every(Boolean) ? 1 : 0.4 }}>
                      Finalizar →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Done */}
              {kycStep === 3 && (
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="font-bold text-2xl mb-2" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>
                    ¡Bienvenido a ServiLink!
                  </h2>
                  <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                    {providerType === 'empresa' ? profile.razonSocial : profile.nombre}
                  </p>
                  <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                    📞 +54 {profile.phone}
                  </p>
                  <div className="p-3 rounded-xl mb-6 text-xs" style={{ background: '#FEF3C7', color: '#92400E' }}>
                    Tu verificación KYC está en revisión. En 24-48 hs hábiles quedás habilitado para publicar ofertas.
                  </div>
                  <button className="btn-accent w-full justify-center py-3 text-base"
                    onClick={() => setIsLoggedIn(true)}>
                    Ir a mi panel →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // ============ DASHBOARD PROVEEDOR ============
  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-5" style={{ background: '#F6F5F1', minHeight: 'calc(100vh - 56px)' }}>
        <Sidebar items={SIDEBAR_ITEMS} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Welcome bar */}
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: '#1A2B4A' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: '#F4A026', color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>
              {displayName?.charAt(0) || 'P'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{displayName}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {providerType === 'empresa' ? `CUIT: ${profile.cuit}` : `CUIL: ${profile.cuil}`} · 📞 +54 {profile.phone}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: '#D1FAE5', color: '#065F46' }}>
              ✓ KYC Verificado
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Ofertas publicadas" value={`${offerCount}/${plan.offers}`} change={`Plan ${plan.name}`} />
            <StatCard label="Alcance hoy" value="2.104" change="técnicos activos" />
            <StatCard label="Clicks en ofertas" value="347" change="↑ 12% vs ayer" />
            <StatCard label="Consultas recibidas" value="28" change="↑ vía WhatsApp" />
          </div>

          {/* Plans */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-bold text-base" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>Plan de suscripción</h2>
            </div>
            <div className="p-5 grid md:grid-cols-3 gap-4">
              {PROVIDER_PLANS.map(pl => (
                <div key={pl.id} className="rounded-2xl p-5 transition-all cursor-pointer"
                  style={{
                    border: currentPlan === pl.id ? '2px solid #1A2B4A' : pl.featured ? '2px solid #F4A026' : '1.5px solid #E8E5DE',
                    background: currentPlan === pl.id ? '#F6F5F1' : '#fff',
                  }}
                  onClick={() => setCurrentPlan(pl.id)}>
                  {pl.featured && currentPlan !== pl.id && <p className="text-xs font-bold mb-2" style={{ color: '#F4A026' }}>★ Más elegido</p>}
                  {currentPlan === pl.id && <p className="text-xs font-bold mb-2" style={{ color: '#10B981' }}>✓ Plan actual</p>}
                  <h3 className="font-bold text-lg" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>{pl.name}</h3>
                  <p className="font-black text-3xl mt-1" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>{pl.priceLabel}</p>
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
                    <button className="w-full mt-4 py-2 rounded-xl text-sm font-semibold"
                      style={{
                        background: pl.featured ? '#F4A026' : 'transparent',
                        color: '#1A2B4A',
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
              <h2 className="font-bold text-base" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>Publicar una oferta</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#6B7280' }}>{offerCount}/{plan.offers} usadas</span>
                <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#E8E5DE' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min((offerCount / plan.offers) * 100, 100)}%`, background: offerCount >= plan.offers ? '#EF4444' : '#F4A026' }} />
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
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>
                    Frecuencia diaria <span style={{ color: '#6B7280', fontWeight: 400 }}>(se cobra extra)</span>
                  </label>
                  <select className="sl-select" value={passes} onChange={e => setPasses(e.target.value)}>
                    <option value="1">1 vez/día (incluido)</option>
                    <option value="2">2 veces/día (+$2.500)</option>
                    <option value="5">5 veces/día (+$5.000)</option>
                    <option value="10">10 veces/día (+$9.000)</option>
                  </select>
                </div>
              </div>
              <div className="p-3 rounded-xl text-xs mb-4" style={{ background: '#EEF2FF', color: '#3730A3' }}>
                📞 Los técnicos te contactarán directamente al <strong>+54 {profile.phone}</strong>. ServiLink no interviene en el acuerdo comercial.
              </div>
              <button className="btn-primary" onClick={publishOffer}>Publicar oferta →</button>
            </div>
          </div>

          {/* Active offers */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-bold text-base" style={{ color: '#1A2B4A', fontFamily: 'Syne, sans-serif' }}>Ofertas activas</h2>
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl text-sm font-medium text-white shadow-xl"
          style={{ background: '#1A2B4A', transform: 'translateX(-50%)' }}>
          {toast}
        </div>
      )}
    </>
  )
}
