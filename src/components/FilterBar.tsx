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
      {/* Zone row — horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide flex-shrink-0 select-none">
          Zona
        </span>
        <div className="flex gap-1.5">
          {ZONES.map((zone) => (
            <button
              key={zone}
              onClick={() => onZoneChange(zone)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[32px] ${
                selectedZone === zone
                  ? 'bg-[#00897b] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Type + geo + count row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide flex-shrink-0 select-none">
          Tipo
        </span>
        <div className="flex gap-1.5 flex-shrink-0">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type === 'Tutti' ? 'Tutti' : type.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[32px] ${
                (type === 'Tutti' ? 'Tutti' : type.toLowerCase()) === selectedType
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 active:bg-stone-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-1">
          <button
            onClick={geoActive ? onClearLocation : onRequestLocation}
            disabled={geoDisabled}
            title={geoActive ? 'Rimuovi posizione' : 'Ordina per distanza'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium min-h-[32px] whitespace-nowrap transition-colors ${
              geoActive
                ? 'bg-rose-500 text-white shadow-sm hover:bg-rose-600 active:bg-rose-700'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300'
            } ${geoDisabled ? 'opacity-60 cursor-wait' : ''}`}
          >
            <span>📍</span>
            <span>{geoLabel}</span>
          </button>
          <span className="text-xs text-stone-500 whitespace-nowrap">
            <span className="font-bold text-[#00897b]">{count}</span>{' '}
            <span className="hidden sm:inline">trovate</span>
          </span>
        </div>
      </div>
    </div>
  )
}
