import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ServiLink — Conectamos clientes con técnicos verificados',
  description: 'Plataforma de servicios técnicos: electricistas, plomeros, CCTV, alarmas, redes y más. Todos verificados con KYC.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
