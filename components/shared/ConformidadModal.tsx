'use client'
import { useState } from 'react'

interface ConformidadModalProps {
  techName: string
  service: string
  onClose: () => void
  onSign: () => void
}

export default function ConformidadModal({ techName, service, onClose, onSign }: ConformidadModalProps) {
  const [checked, setChecked] = useState(false)
  const [signed, setSigned] = useState(false)

  const handleSign = () => {
    setSigned(true)
    setTimeout(() => { onSign(); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5" style={{ background: '#1A2B4A' }}>
          <p className="font-syne font-bold text-base text-white">ServiLink · Firma de conformidad</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {service} — {techName}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="font-syne font-semibold text-sm mb-4" style={{ color: '#1A2B4A' }}>
            Términos del acuerdo entre partes
          </p>

          {[
            { icon: '💼', text: 'El acuerdo económico (monto, forma y plazo de pago) es pactado exclusivamente entre el cliente y el técnico/instalador. ServiLink no interviene ni es parte de dicho acuerdo.' },
            { icon: '🚫', text: 'ServiLink no es responsable por el incumplimiento de contratos, calidad del trabajo, daños materiales ni disputas económicas entre las partes.' },
            { icon: '🔒', text: 'ServiLink actúa únicamente como plataforma de conexión y verificación de identidad (KYC). La relación contractual es directa entre cliente y prestador.' },
            { icon: '⭐', text: 'Una vez finalizado el trabajo, el cliente podrá calificar al técnico dentro de la plataforma. Las calificaciones son públicas y verificadas.' },
            { icon: '📄', text: 'Esta firma electrónica tiene valor declarativo. Para contratos con valor legal pleno, las partes deberán instrumentar acuerdos por fuera de la plataforma.' },
          ].map((clause, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl mb-2"
              style={{ background: '#F6F5F1' }}>
              <span className="text-base flex-shrink-0 mt-0.5">{clause.icon}</span>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{clause.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-4" style={{ borderTop: '1px solid #E8E5DE', paddingTop: 16 }}>
          <label className="flex items-center gap-3 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: '#1A2B4A' }}
              disabled={signed}
            />
            <span className="text-xs" style={{ color: '#6B7280', lineHeight: 1.5 }}>
              Leí y acepto los términos. Entiendo que el pago y el contrato son entre las partes.
            </span>
          </label>

          {signed ? (
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#10B981', whiteSpace: 'nowrap' }}>
              ✓ Firmado
            </div>
          ) : (
            <button
              className="btn-primary text-sm py-2 px-5 flex-shrink-0"
              disabled={!checked}
              onClick={handleSign}
              style={{ opacity: checked ? 1 : 0.35, cursor: checked ? 'pointer' : 'not-allowed' }}
            >
              Firmar ✍️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
