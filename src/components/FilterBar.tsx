import type { UserLocation } from '../App'

const TYPE_OPTIONS = [
  { value: 'Tutti',       label: 'Tutti i tipi' },
  { value: 'artigianale', label: '🍦 Artigianale' },
  { value: 'cremeria',    label: '🍨 Cremeria' },
  { value: 'granite',     label: '🧊 Granite' },
  { value: 'yogurt',      label: '🫙 Yogurt' },
]

type GeoStatus = 'idle' | 'loading' | 'denied' | 'unavailable'

interface Props {
  zones: string[]
  selectedZone: string
  selectedType: string
  onZoneChange: (zone: string) => void
  onTypeChange: (type: string) => void
  count: number
  userLocation: UserLocation | null
  geoStatus: GeoStatus
  onRequestLocation: () => void
  onClearLocation: () => void
}

const pill = 'px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border select-none'
const pillOff = 'bg-white border-stone-200 text-stone-600 hover:border-pistachio/50 hover:text-pistachio active:scale-95'
const pillOn  = 'bg-pistachio border-pistachio text-white pill-active active:scale-95'

export default function FilterBar({
  zones,
  selectedZone,
  selectedType,
  onZoneChange,
  onTypeChange,
  count,
  userLocation,
  geoStatus,
  onRequestLocation,
  onClearLocation,
}: Props) {
  const geoActive   = !!userLocation
  const geoDisabled = geoStatus === 'loading'
  const geoLabel =
    geoStatus === 'loading'    ? '...'
    : geoStatus === 'denied'   ? 'Permesso negato'
    : geoStatus === 'unavailable' ? 'Non disponibile'
    : geoActive                ? 'Vicino a te ✕'
    : '📍 Vicino a me'

  return (
    <div className="px-4 py-2.5 space-y-2">
      {/* ── Row 1: Zone ── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-shrink-0 w-8">
          Zona
        </span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {['Tutti', ...zones].map((zone) => (
            <button
              key={zone}
              onClick={() => onZoneChange(zone)}
              className={`${pill} ${selectedZone === zone ? pillOn : pillOff}`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: Type + Geo + Count ── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-shrink-0 w-8">
          Tipo
        </span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 flex-1">
          {TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onTypeChange(value)}
              className={`${pill} ${selectedType === value ? pillOn : pillOff}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-stone-200 flex-shrink-0" />

        {/* Geo button */}
        <button
          onClick={geoActive ? onClearLocation : onRequestLocation}
          disabled={geoDisabled}
          className={`${pill} flex-shrink-0 ${geoActive ? pillOn : pillOff} ${geoDisabled ? 'opacity-50 cursor-wait' : ''}`}
        >
          {geoLabel}
        </button>

        {/* Count badge */}
        <span className="flex-shrink-0 bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1.5 rounded-full tabular-nums">
          {count}
        </span>
      </div>
    </div>
  )
}
