import type { UserLocation } from '../App'

const ZONES = ['Tutti', 'Centro', 'Navigli', 'Brera', 'Isola', 'Porta Romana', 'Città Studi']
const TYPES = ['Tutti', 'Artigianale', 'Cremeria', 'Granite', 'Yogurt']

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
  const geoLabel =
    geoStatus === 'loading'
      ? 'Localizzazione...'
      : geoStatus === 'denied'
        ? 'Permesso negato'
        : geoStatus === 'unavailable'
          ? 'Non disponibile'
          : userLocation
            ? 'Ordinato per distanza'
            : 'Vicino a me'

  const geoActive = !!userLocation
  const geoDisabled = geoStatus === 'loading'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      {/* Zone filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-stone-500 mr-0.5">Zona:</span>
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => onZoneChange(zone)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedZone === zone
                ? 'bg-[#00897b] text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-6 bg-stone-200" />

      {/* Type filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-stone-500 mr-0.5">Tipo:</span>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type === 'Tutti' ? 'Tutti' : type.toLowerCase())}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              (type === 'Tutti' ? 'Tutti' : type.toLowerCase()) === selectedType
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Geolocation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={geoActive ? onClearLocation : onRequestLocation}
          disabled={geoDisabled}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            geoActive
              ? 'bg-rose-500 text-white shadow-sm hover:bg-rose-600'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          } ${geoDisabled ? 'opacity-60 cursor-wait' : ''}`}
          title={geoActive ? 'Rimuovi la mia posizione' : 'Trova le gelaterie più vicine'}
        >
          <span>📍</span>
          <span>{geoLabel}</span>
          {geoActive && <span className="ml-0.5 opacity-80">✕</span>}
        </button>
      </div>

      {/* Count */}
      <div className="sm:ml-auto text-xs text-stone-500 font-medium whitespace-nowrap">
        <span className="text-[#00897b] font-bold">{count}</span> gelaterie trovate
      </div>
    </div>
  )
}
