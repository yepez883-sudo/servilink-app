'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '../../../lib/data'

const ROLES = [
  { id: 'cliente',   icon: '🏠', label: 'Cliente',             desc: 'Busco técnicos para contratar' },
  { id: 'tecnico',   icon: '🔧', label: 'Técnico / Instalador', desc: 'Ofrezco mis servicios profesionales' },
  { id: 'proveedor', icon: '📦', label: 'Proveedor',            desc: 'Vendo productos a técnicos' },
]

const STEPS = ['Rol', 'Datos', 'KYC', 'Servicios', 'Listo']

export default function RegistroPage() {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', cuil: '', tel: '', password: '' })
  const [kycStep, setKycStep] = useState(0)
  const [services, setServices] = useState<string[]>([])

  const next = () => setStep(s => Math.min(s + 1, 4))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const toggleService = (id: string) => {
    setServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const finish = () => { window.location.href = `/${role || 'cliente'}` }

  return (
    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="px-8 py-5 border-b" style={{ borderColor: '#E8E5DE' }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4A026', display: 'inline-block' }} />
          <span className="font-syne font-bold text-lg" style={{ color: '#1A2B4A' }}>ServiLink</span>
        </div>
        {/* Step indicators */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: i < step ? '#10B981' : i === step ? '#1A2B4A' : '#E8E5DE',
                    color: i <= step ? '#fff' : '#6B7280',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs hidden sm:inline" style={{ color: i === step ? '#1A2B4A' : '#6B7280', fontWeight: i === step ? 600 : 400 }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2" style={{ background: i < step ? '#10B981' : '#E8E5DE' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Step 0: Role */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-syne font-bold text-xl mb-1" style={{ color: '#1A2B4A' }}>¿Cómo vas a usar ServiLink?</h2>
            <p className="text-sm mb-5" style={{ color: '#6B7280' }}>Elegí tu rol para personalizar tu experiencia</p>
            <div className="flex flex-col gap-3 mb-6">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all text-left"
                  style={{
                    border: role === r.id ? '2px solid #1A2B4A' : '1.5px solid #E8E5DE',
                    background: role === r.id ? '#F6F5F1' : '#fff',
                  }}>
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1A2B4A' }}>{r.label}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{r.desc}</p>
                  </div>
                  {role === r.id && <span className="ml-auto text-lg">✓</span>}
                </button>
              ))}
            </div>
            <button className="btn-primary w-full justify-center" disabled={!role} onClick={next}
              style={{ opacity: role ? 1 : 0.4 }}>
              Continuar →
            </button>
          </div>
        )}

        {/* Step 1: Personal data */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-syne font-bold text-xl mb-1" style={{ color: '#1A2B4A' }}>Tus datos personales</h2>
            <p className="text-sm mb-5" style={{ color: '#6B7280' }}>Información básica para tu cuenta</p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { key: 'nombre', label: 'Nombre completo', placeholder: 'Juan Pérez', type: 'text' },
                { key: 'email',  label: 'Email',           placeholder: 'juan@correo.com', type: 'email' },
                { key: 'cuil',   label: 'CUIL',            placeholder: '20-12345678-9', type: 'text' },
                { key: 'tel',    label: 'Teléfono',        placeholder: '+54 381 000-0000', type: 'tel' },
                { key: 'password', label: 'Contraseña',   placeholder: '••••••••', type: 'password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1A2B4A' }}>{f.label}</label>
                  <input className="sl-input" type={f.type} placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-outline flex-1" onClick={prev}>← Atrás</button>
              <button className="btn-primary flex-1 justify-center" onClick={next}>Continuar →</button>
            </div>
          </div>
        )}

        {/* Step 2: KYC */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-syne font-bold text-xl mb-1" style={{ color: '#1A2B4A' }}>Verificación de identidad (KYC)</h2>
            <p className="text-sm mb-5" style={{ color: '#6B7280' }}>Requerido para todos los usuarios. Garantiza la seguridad de la comunidad.</p>

            {[
              { step: 0, icon: '🪪', title: 'Foto de DNI (frente y dorso)', desc: 'Subí una foto clara de tu documento nacional de identidad.', btn: 'Subir DNI' },
              { step: 1, icon: '🤳', title: 'Selfie con DNI', desc: 'Una foto tuya sosteniendo el DNI para confirmar tu identidad.', btn: 'Tomar selfie' },
              { step: 2, icon: '📋', title: 'Certificación de oficio (técnicos)', desc: 'Matrícula, habilitación o certificado de oficio. Opcional para clientes.', btn: 'Subir certificación' },
            ].map((k, i) => (
              <div key={k.step} className="flex gap-3 p-4 rounded-xl mb-3"
                style={{ border: kycStep > i ? '1.5px solid #10B981' : kycStep === i ? '1.5px solid #1A2B4A' : '1.5px solid #E8E5DE', background: kycStep > i ? '#F0FDF4' : '#fff' }}>
                <div className="kyc-step-num flex-shrink-0"
                  style={{ background: kycStep > i ? '#10B981' : kycStep === i ? '#1A2B4A' : '#E8E5DE', color: kycStep >= i ? '#fff' : '#6B7280' }}>
                  {kycStep > i ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: '#1A2B4A' }}>{k.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{k.desc}</p>
                  {kycStep === i && (
                    <button className="btn-primary text-xs py-2 px-4 mt-3"
                      onClick={() => setKycStep(k.step + 1)}>
                      {k.btn} →
                    </button>
                  )}
                  {kycStep > i && <p className="text-xs mt-1 font-semibold" style={{ color: '#10B981' }}>✓ Enviado correctamente</p>}
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-4">
              <button className="btn-outline flex-1" onClick={prev}>← Atrás</button>
              <button className="btn-primary flex-1 justify-center" onClick={next}
                disabled={kycStep < 2} style={{ opacity: kycStep >= 2 ? 1 : 0.4 }}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Services (only for tecnico) */}
        {step === 3 && (
          <div className="animate-fade-in">
            {role === 'tecnico' ? (
              <>
                <h2 className="font-syne font-bold text-xl mb-1" style={{ color: '#1A2B4A' }}>¿Qué servicios ofrecés?</h2>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Seleccioná todos los servicios que brindás. Podés editarlos después.</p>
                <div className="grid grid-cols-2 gap-2 mb-5 max-h-72 overflow-y-auto pr-1">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => toggleService(cat.id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl text-sm text-left transition-all"
                      style={{
                        border: services.includes(cat.id) ? '1.5px solid #1A2B4A' : '1.5px solid #E8E5DE',
                        background: services.includes(cat.id) ? '#EEF2FF' : '#fff',
                        color: services.includes(cat.id) ? '#1A2B4A' : '#6B7280',
                        fontWeight: services.includes(cat.id) ? 600 : 400,
                      }}>
                      <span>{cat.emoji}</span>
                      <span className="text-xs">{cat.name}</span>
                      {services.includes(cat.id) && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                </div>
                <p className="text-xs mb-4" style={{ color: '#6B7280' }}>{services.length} servicio{services.length !== 1 ? 's' : ''} seleccionado{services.length !== 1 ? 's' : ''}</p>
              </>
            ) : (
              <>
                <h2 className="font-syne font-bold text-xl mb-1" style={{ color: '#1A2B4A' }}>¡Casi listo!</h2>
                <p className="text-sm mb-5" style={{ color: '#6B7280' }}>Tu perfil está configurado y listo para usar.</p>
                <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1.5px solid #10B981' }}>
                  <p className="text-sm font-semibold" style={{ color: '#065F46' }}>✓ Tu cuenta está siendo verificada</p>
                  <p className="text-xs mt-1" style={{ color: '#065F46', opacity: 0.8 }}>La verificación KYC toma 24-48 hs hábiles.</p>
                </div>
              </>
            )}
            <div className="flex gap-3 mt-4">
              <button className="btn-outline flex-1" onClick={prev}>← Atrás</button>
              <button className="btn-primary flex-1 justify-center" onClick={next}>Finalizar →</button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="animate-fade-in text-center py-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-syne font-bold text-2xl mb-2" style={{ color: '#1A2B4A' }}>¡Bienvenido a ServiLink!</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280', lineHeight: 1.7 }}>
              Tu cuenta fue creada exitosamente. Tu verificación KYC está en proceso y recibirás un email cuando esté aprobada.
            </p>
            <button className="btn-accent w-full justify-center py-3 text-base" onClick={finish}>
              Ir a mi panel →
            </button>
          </div>
        )}

        {step < 4 && (
          <p className="text-center text-xs mt-4" style={{ color: '#6B7280' }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" className="font-semibold no-underline" style={{ color: '#1A2B4A' }}>Iniciá sesión</Link>
          </p>
        )}
      </div>
    </div>
  )
}
