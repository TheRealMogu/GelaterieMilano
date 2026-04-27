const ZONES = ['Tutti', 'Centro', 'Navigli', 'Brera', 'Isola', 'Porta Romana', 'Città Studi']
const TYPES = ['Tutti', 'Artigianale', 'Cremeria', 'Granite']

interface Props {
  selectedZone: string
  selectedType: string
  onZoneChange: (zone: string) => void
  onTypeChange: (type: string) => void
  count: number
}

export default function FilterBar({ selectedZone, selectedType, onZoneChange, onTypeChange, count }: Props) {
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

      {/* Count */}
      <div className="sm:ml-auto text-xs text-stone-500 font-medium whitespace-nowrap">
        <span className="text-[#00897b] font-bold">{count}</span> gelaterie trovate
      </div>
    </div>
  )
}
