import type { UserLocation } from '../App'

const ZONES = ['Tutti', 'Centro', 'Navigli', 'Brera', 'Isola', 'Porta Venezia', 'Porta Romana', 'Città Studi', 'Sempione']
const TYPES = ['Tutti', 'Artigianale', 'Cremeria', 'Granite']

type GeoStatus = 'idle' | 'loading' | 'denied' | 'unavailable'

interface Props {
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

const pillBase = 'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] border'
const pillInactive = 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100'
const pillActive = 'bg-pistachio text-white border-pistachio shadow-sm'

export default function FilterBar({
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
  const geoActive = !!userLocation
  const geoDisabled = geoStatus === 'loading'
  const geoLabel =
    geoStatus === 'loading'
      ? 'Localizzazione...'
      : geoStatus === 'denied'
        ? 'Permesso negato'
        : geoStatus === 'unavailable'
          ? 'Non disponibile'
          : geoActive
            ? 'Vicino a te ✕'
            : 'Vicino a me'

  return (
    <div className="px-3 py-2 space-y-1.5">
      {/* Zone row — label fixed, pills scroll */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex-shrink-0 w-10 select-none">
          Zona
        </span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 flex-1">
          {ZONES.map((zone) => (
            <button
              key={zone}
              onClick={() => onZoneChange(zone)}
              className={`${pillBase} ${selectedZone === zone ? pillActive : pillInactive}`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Type row — label fixed, pills scroll, geo + count fixed right */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex-shrink-0 w-10 select-none">
          Tipo
        </span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 flex-1">
          {TYPES.map((type) => {
            const val = type === 'Tutti' ? 'Tutti' : type.toLowerCase()
            return (
              <button
                key={type}
                onClick={() => onTypeChange(val)}
                className={`${pillBase} ${val === selectedType ? pillActive : pillInactive}`}
              >
                {type}
              </button>
            )
          })}
        </div>
        <button
          onClick={geoActive ? onClearLocation : onRequestLocation}
          disabled={geoDisabled}
          className={`${pillBase} flex-shrink-0 ${geoActive ? pillActive : pillInactive} ${geoDisabled ? 'opacity-60 cursor-wait' : ''}`}
        >
          📍 {geoLabel}
        </button>
        <span className="text-xs text-muted whitespace-nowrap flex-shrink-0">
          <span className="font-bold text-pistachio">{count}</span>
          <span className="hidden sm:inline"> trovate</span>
        </span>
      </div>
    </div>
  )
}
