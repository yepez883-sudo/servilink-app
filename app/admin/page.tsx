'use client'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import StatCard from '../../components/ui/StatCard'

const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Ingresos' },
  { icon: '👥', label: 'Usuarios' },
  { icon: '🔍', label: 'KYC pendientes', badge: 7 },
  { icon: '⭐', label: 'Reseñas' },
  { icon: '📢', label: 'Proveedores' },
  { icon: '⚙️', label: 'Configuración' },
]

const BOOST_ROWS = [
  { service: 'Electricidad', techs: 312, avgBoost: '5x', revenue: '$78.400', trend: '+14%' },
  { service: 'CCTV / Cámaras', techs: 198, avgBoost: '2x', revenue: '$42.000', trend: '+8%' },
  { service: 'Aire acondicionado', techs: 145, avgBoost: '10x', revenue: '$38.600', trend: '+22%' },
  { service: 'Alarmas', techs: 89, avgBoost: '2x', revenue: '$21.000', trend: '+5%' },
  { service: 'Redes / WiFi', techs: 67, avgBoost: '1x', revenue: '$0', trend: '—' },
]

const BOOST_BG: Record<string, string> = {
  '1x': '#F1EFE8', '2x': '#FEF3C7', '5x': '#FEE2E2', '10x': '#EEF2FF'
}
const BOOST_COLOR: Record<string, string> = {
  '1x': '#6B7280', '2x': '#92400E', '5x': '#991B1B', '10x': '#3730A3'
}

const REVENUE_SOURCES = [
  { label: 'Boosts de visibilidad (técnicos)', value: '$198.000', note: '143 boosts activos hoy · promedio $1.385/boost', pct: 70, color: '#F4A026' },
  { label: 'Suscripciones de proveedores', value: '$86.000', note: 'Pro + Enterprise · 47 proveedores activos', pct: 30, color: '#2DD4BF' },
  { label: 'Frecuencia extra (proveedores)', value: '$12.400', note: 'Pases extra por día · 18 activos', pct: 10, color: '#3B82F6' },
]

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <div className="flex gap-5 p-5" style={{ background: '#F6F5F1', minHeight: 'calc(100vh - 56px)' }}>
        <Sidebar items={SIDEBAR_ITEMS} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Ingresos hoy" value="$296.400" change="↑ 22% vs ayer" />
            <StatCard label="Boosts activos" value="143" change="↑ 18 nuevos hoy" />
            <StatCard label="Técnicos activos" value="1.204" change="KYC verificados" />
            <StatCard label="Calificación promedio" value="4.76 ⭐" change="plataforma completa" />
          </div>

          {/* Model de negocio */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Modelo de ingresos</h2>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>ServiLink no cobra comisión por servicios. Los pagos son directos entre cliente y técnico.</p>
            </div>
            <div className="p-5 grid md:grid-cols-3 gap-4">
              {REVENUE_SOURCES.map(src => (
                <div key={src.label} className="rounded-xl p-4" style={{ background: '#F6F5F1', border: '1px solid #E8E5DE' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>{src.label}</p>
                  <p className="font-syne font-bold text-2xl mb-1" style={{ color: '#1A2B4A' }}>{src.value}</p>
                  <p className="text-xs mb-3" style={{ color: '#6B7280' }}>{src.note}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E8E5DE' }}>
                    <div className="h-full rounded-full" style={{ width: `${src.pct}%`, background: src.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 0% comision highlight */}
            <div className="mx-5 mb-5 p-4 rounded-xl flex items-center gap-4"
              style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE' }}>
              <span className="text-2xl">🚫</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#3730A3' }}>0% de comisión sobre servicios contratados</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  Los pagos entre clientes y técnicos son directos. ServiLink no intermedia ni es responsable de los contratos entre las partes.
                </p>
              </div>
            </div>
          </div>

          {/* Top boosts table */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Top servicios por ingresos de boost — hoy</h2>
            </div>
            <div className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wide border-b"
              style={{ gridTemplateColumns: '1fr 100px 100px 120px 80px', borderColor: '#E8E5DE', color: '#6B7280' }}>
              <span>Servicio</span><span>Técnicos</span><span>Boost prom.</span><span>Ingresos</span><span>Tendencia</span>
            </div>
            {BOOST_ROWS.map((row, i) => (
              <div key={i} className="grid px-6 py-4 border-b items-center text-sm"
                style={{ gridTemplateColumns: '1fr 100px 100px 120px 80px', borderColor: '#E8E5DE' }}>
                <p className="font-medium" style={{ color: '#1A2B4A' }}>{row.service}</p>
                <p style={{ color: '#6B7280' }}>{row.techs}</p>
                <span className="text-xs font-bold px-2 py-1 rounded-lg w-fit"
                  style={{ background: BOOST_BG[row.avgBoost], color: BOOST_COLOR[row.avgBoost] }}>
                  {row.avgBoost}
                </span>
                <p className="font-semibold" style={{ color: '#1A2B4A' }}>{row.revenue}</p>
                <p className="text-xs font-semibold" style={{ color: row.trend === '—' ? '#9CA3AF' : '#10B981' }}>{row.trend}</p>
              </div>
            ))}
          </div>

          {/* KYC pending */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E5DE' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
              <h2 className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>Verificaciones KYC pendientes</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>7 pendientes</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                { name: 'Roberto Soria', type: 'Técnico electricista', submitted: 'hace 2 horas', step: 'Certificación' },
                { name: 'Laura Giménez', type: 'Arquitecta', submitted: 'hace 5 horas', step: 'Selfie + DNI' },
                { name: 'ElectroParts SA', type: 'Proveedor', submitted: 'hace 1 día', step: 'Datos empresa' },
                { name: 'Martín Álvarez', type: 'Plomero gasista', submitted: 'hace 1 día', step: 'Certificación' },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ background: '#F6F5F1', border: '1px solid #E8E5DE' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm flex-shrink-0"
                    style={{ background: '#FEF3C7', color: '#92400E' }}>
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: '#1A2B4A' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{user.type} · {user.submitted}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E' }}>{user.step}</span>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#D1FAE5', color: '#065F46', border: 'none', cursor: 'pointer' }}>
                      ✓ Aprobar
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                      style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer' }}>
                      ✗ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
