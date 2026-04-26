'use client'
import { useState } from 'react'

interface RatingModalProps {
  techName: string
  service: string
  onClose: () => void
}

const RATING_CATS = [
  { id: 'puntualidad', label: 'Puntualidad' },
  { id: 'calidad',     label: 'Calidad del trabajo' },
  { id: 'prolijidad',  label: 'Prolijidad' },
  { id: 'trato',       label: 'Trato profesional' },
]

export default function RatingModal({ techName, service, onClose }: RatingModalProps) {
  const [mainStars, setMainStars] = useState(0)
  const [hoverMain, setHoverMain] = useState(0)
  const [catStars, setCatStars] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (mainStars === 0) return
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-syne font-bold text-lg mb-2" style={{ color: '#1A2B4A' }}>¡Gracias por calificar!</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Tu calificación es pública y ayuda a otros clientes a elegir mejor.
            </p>
            <button className="btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5" style={{ background: '#1A2B4A' }}>
              <p className="font-syne font-bold text-base text-white">Calificar trabajo</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {service} — {techName}
              </p>
            </div>

            <div className="p-6">
              {/* Disclaimer */}
              <div className="p-3 rounded-xl text-xs mb-5 leading-relaxed"
                style={{ background: '#EEF2FF', color: '#3730A3' }}>
                El pago fue acordado directamente con el técnico. Tu calificación ayuda a otros clientes a elegir mejor.
              </div>

              {/* Main stars */}
              <p className="text-sm font-semibold mb-3" style={{ color: '#1A2B4A' }}>Calificación general</p>
              <div className="flex gap-2 mb-5">
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    className="star-btn"
                    style={{ color: (hoverMain || mainStars) >= n ? '#F4A026' : '#E8E5DE' }}
                    onMouseEnter={() => setHoverMain(n)}
                    onMouseLeave={() => setHoverMain(0)}
                    onClick={() => setMainStars(n)}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Category stars */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {RATING_CATS.map(cat => (
                  <div key={cat.id}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{cat.label}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          className="text-base cursor-pointer transition-colors"
                          style={{ color: (catStars[cat.id] || 0) >= n ? '#F4A026' : '#E8E5DE', border: 'none', background: 'none', padding: 0 }}
                          onClick={() => setCatStars(prev => ({ ...prev, [cat.id]: n }))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Comentario público (opcional)..."
                rows={3}
                className="w-full rounded-xl p-3 text-sm resize-none outline-none"
                style={{ border: '1.5px solid #E8E5DE', fontFamily: 'DM Sans, sans-serif', color: '#1A2B4A' }}
                onFocus={e => e.target.style.borderColor = '#1A2B4A'}
                onBlur={e => e.target.style.borderColor = '#E8E5DE'}
              />

              <div className="flex gap-3 mt-4">
                <button className="btn-outline flex-1" onClick={onClose}>Cancelar</button>
                <button
                  className="btn-accent flex-1"
                  onClick={handleSubmit}
                  style={{ opacity: mainStars > 0 ? 1 : 0.4, cursor: mainStars > 0 ? 'pointer' : 'not-allowed' }}
                  disabled={mainStars === 0}
                >
                  Publicar calificación ★
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
