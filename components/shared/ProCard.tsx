'use client'
import { useState } from 'react'

interface Pro {
  id: string
  name: string
  type: string
  initials: string
  avatarBg: string
  avatarColor: string
  rating: number
  reviews: number
  services: string[]
  desde: string
  verified: boolean
  zone: string
  boost: string
  description: string
}

interface ProCardProps {
  pro: Pro
  onContact: (pro: Pro) => void
}

export default function ProCard({ pro, onContact }: ProCardProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="sl-card cursor-pointer overflow-hidden" onClick={() => setShowModal(true)}>
        {/* Boost indicator */}
        {pro.boost !== '1x' && (
          <div className="h-1 w-full" style={{ background: pro.boost === '10x' ? '#3730A3' : pro.boost === '5x' ? '#F4A026' : '#2DD4BF' }} />
        )}

        <div className="p-4 border-b" style={{ borderColor: '#E8E5DE' }}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-syne font-bold text-lg flex-shrink-0"
              style={{ background: pro.avatarBg, color: pro.avatarColor }}>
              {pro.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-bold text-sm" style={{ color: '#1A2B4A' }}>{pro.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{pro.type}</p>
              <div className="flex items-center gap-1 mt-1">
                <span style={{ color: '#F4A026', fontSize: 12 }}>{'★'.repeat(Math.round(pro.rating))}</span>
                <span className="text-xs font-semibold" style={{ color: '#1A2B4A' }}>{pro.rating}</span>
                <span className="text-xs" style={{ color: '#6B7280' }}>({pro.reviews})</span>
              </div>
              {pro.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
                  style={{ background: '#D1FAE5', color: '#065F46' }}>
                  ✓ KYC Verificado
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs mb-2" style={{ color: '#6B7280' }}>📍 {pro.zone}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {pro.services.slice(0, 3).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-lg"
                style={{ background: '#F6F5F1', border: '1px solid #E8E5DE', color: '#1A2B4A' }}>
                {s}
              </span>
            ))}
            {pro.services.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: '#F6F5F1', color: '#6B7280' }}>
                +{pro.services.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: '#F6F5F1', borderTop: '1px solid #E8E5DE' }}>
          <div>
            <span className="text-xs" style={{ color: '#6B7280' }}>Desde </span>
            <span className="font-syne font-bold text-base" style={{ color: '#1A2B4A' }}>{pro.desde}</span>
          </div>
          <button
            className="btn-primary text-sm py-2 px-4"
            onClick={e => { e.stopPropagation(); onContact(pro) }}
          >
            Contactar
          </button>
        </div>
      </div>

      {/* Profile modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}>
            <div className="p-6" style={{ background: '#1A2B4A' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne font-bold text-2xl"
                  style={{ background: pro.avatarBg, color: pro.avatarColor }}>
                  {pro.initials}
                </div>
                <div>
                  <h2 className="font-syne font-bold text-xl text-white">{pro.name}</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{pro.type}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span style={{ color: '#F4A026' }}>{'★'.repeat(Math.round(pro.rating))}</span>
                    <span className="text-sm font-semibold text-white">{pro.rating}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>({pro.reviews} reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm mb-4" style={{ color: '#6B7280', lineHeight: 1.6 }}>{pro.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {pro.services.map(s => (
                  <span key={s} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: '#EEF2FF', color: '#3730A3', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6B7280' }}>
                <span>📍</span><span>{pro.zone}</span>
                {pro.verified && <><span>·</span><span style={{ color: '#10B981', fontWeight: 600 }}>✓ Verificado</span></>}
              </div>
              <div className="p-3 rounded-xl text-xs mb-4" style={{ background: '#FEF3C7', color: '#92400E' }}>
                El acuerdo económico y de pago es directo entre vos y el técnico. ServiLink no interviene en cobros ni contratos.
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex-1" onClick={() => setShowModal(false)}>Cerrar</button>
                <button className="btn-primary flex-1" onClick={() => { setShowModal(false); onContact(pro) }}>
                  📞 Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
