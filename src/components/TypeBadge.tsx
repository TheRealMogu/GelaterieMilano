import type { Gelateria } from '../App'

const CONFIG: Record<Gelateria['type'], { label: string; className: string }> = {
  artigianale: { label: 'Artigianale', className: 'bg-pistachio-light text-pistachio-dark' },
  cremeria: { label: 'Cremeria', className: 'bg-fragola-light text-fragola' },
  granite: { label: 'Granite', className: 'bg-nocciola-light text-nocciola' },
  yogurt: { label: 'Yogurt', className: 'bg-stone-100 text-stone-600' },
}

export default function TypeBadge({ type }: { type: Gelateria['type'] }) {
  const { label, className } = CONFIG[type]
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${className}`}>
      {label}
    </span>
  )
}
