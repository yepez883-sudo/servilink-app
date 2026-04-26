interface StatCardProps {
  label: string
  value: string
  change?: string
  positive?: boolean
}

export default function StatCard({ label, value, change, positive = true }: StatCardProps) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#F6F5F1', border: '1px solid #E8E5DE' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>{label}</p>
      <p className="font-syne text-2xl font-bold" style={{ color: '#1A2B4A' }}>{value}</p>
      {change && (
        <p className="text-xs mt-1" style={{ color: positive ? '#10B981' : '#EF4444' }}>{change}</p>
      )}
    </div>
  )
}
