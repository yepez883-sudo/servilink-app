'use client'
import { useState } from 'react'

interface SidebarItem {
  icon: string
  label: string
  badge?: number
}

interface SidebarProps {
  items: SidebarItem[]
}

export default function Sidebar({ items }: SidebarProps) {
  const [active, setActive] = useState(0)

  return (
    <aside className="w-52 flex-shrink-0 bg-white rounded-xl border p-3 flex flex-col gap-1 self-start sticky top-20"
      style={{ borderColor: '#E8E5DE' }}>
      <p className="text-xs font-semibold uppercase tracking-widest px-2 py-2" style={{ color: '#6B7280' }}>Menú</p>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left w-full"
          style={{
            background: active === i ? '#EEF2FF' : 'transparent',
            color: active === i ? '#1A2B4A' : '#6B7280',
            fontWeight: active === i ? 500 : 400,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span className="text-base w-5 text-center">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#F4A026', color: '#1A2B4A' }}>
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </aside>
  )
}
