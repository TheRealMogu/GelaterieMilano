import { useState } from 'react'
import type { UserLocation } from '../App'

const TYPE_OPTIONS = [
  { value: 'Tutti',       label: 'Tutti',       short: 'Tutti' },
  { value: 'artigianale', label: '🍦 Artigianale', short: 'Artigianale' },
  { value: 'cremeria',    label: '🍨 Cremeria',    short: 'Cremeria' },
  { value: 'granite',     label: '🧊 Granite',     short: 'Granite' },
  { value: 'yogurt',      label: '🫙 Yogurt',      short: 'Yogurt' },
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

const pill    = 'cursor-pointer px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border select-none active:scale-95'
const pillOff = 'bg-white border-stone-200 text-stone-600 hover:border-pistachio/50 hover:text-pistachio'
const pillOn  = 'bg-pistachio border-pistachio text-white pill-active'

export default function FilterBar({
  zones, selectedZone, selectedType,
  onZoneChange, onTypeChange,
  count, userLocation, geoStatus, onRequestLocation, onClearLocation,
}: Props) {
  const [mobileTab, setMobileTab] = useState<'zone' | 'type'>('zone')

  const geoActive   = !!userLocation
  const geoDisabled = geoStatus === 'loading'
  const geoLabel    =
    geoStatus === 'loading'       ? '...'
    : geoStatus === 'denied'      ? 'Negato'
    : geoStatus === 'unavailable' ? 'N/D'
    : geoActive                   ? 'Vicino a te ✕'
    : '📍 Vicino a me'

  const activeTypeName = TYPE_OPTIONS.find(t => t.value === selectedType)?.short ?? ''

  /* ── Mobile: zone or type pills based on active tab ── */
  const mobilePills = mobileTab === 'zone'
    ? ['Tutti', ...zones].map(z => ({
        key: z, label: z, active: selectedZone === z, onClick: () => onZoneChange(z),
      }))
    : TYPE_OPTIONS.map(t => ({
        key: t.value, label: t.label, active: selectedType === t.value, onClick: () => onTypeChange(t.value),
      }))

  return (
    <>
      {/* ═══════════════════════════════
          MOBILE LAYOUT
          Two compact rows: [tabs + geo + count] / [scrollable pills]
          ═══════════════════════════════ */}
      <div className="md:hidden">
        {/* Row 1: tab toggle + geo + count */}
        <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-1.5">
          <button
            onClick={() => setMobileTab('zone')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              mobileTab === 'zone'
                ? 'bg-pistachio text-white border-pistachio shadow-sm'
                : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            Zona
            {selectedZone !== 'Tutti' && (
              <span className={`w-1.5 h-1.5 rounded-full ${mobileTab === 'zone' ? 'bg-white/70' : 'bg-pistachio'}`} />
            )}
          </button>
          <button
            onClick={() => setMobileTab('type')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              mobileTab === 'type'
                ? 'bg-pistachio text-white border-pistachio shadow-sm'
                : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            Tipo
            {selectedType !== 'Tutti' && (
              <span className={`w-1.5 h-1.5 rounded-full ${mobileTab === 'type' ? 'bg-white/70' : 'bg-pistachio'}`} />
            )}
          </button>

          {/* Active filter summary */}
          {(selectedZone !== 'Tutti' || selectedType !== 'Tutti') && (
            <span className="text-[10px] text-stone-400 truncate flex-1 min-w-0">
              {[selectedZone !== 'Tutti' ? selectedZone : null, selectedType !== 'Tutti' ? activeTypeName : null]
                .filter(Boolean).join(' · ')}
            </span>
          )}

          <div className="flex-1" />

          {/* Geo icon button */}
          <button
            onClick={geoActive ? onClearLocation : onRequestLocation}
            disabled={geoDisabled}
            className={`p-2 rounded-full border transition-all flex-shrink-0 ${
              geoActive
                ? 'bg-pistachio text-white border-pistachio'
                : 'bg-white text-stone-600 border-stone-200'
            } ${geoDisabled ? 'opacity-50' : ''}`}
            title={geoLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Count badge */}
          <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1.5 rounded-full tabular-nums flex-shrink-0">
            {count}
          </span>
        </div>

        {/* Row 2: scrollable pills for active tab */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-4 pb-2.5">
          {mobilePills.map(({ key, label, active, onClick }) => (
            <button
              key={key}
              onClick={onClick}
              className={`${pill} ${active ? pillOn : pillOff}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════
          DESKTOP LAYOUT — two rows
          ═══════════════════════════════ */}
      <div className="hidden md:block px-4 py-2.5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-shrink-0 w-9">
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

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-shrink-0 w-9">
            Tipo
          </span>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5 flex-1 min-w-0">
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
          <div className="w-px h-5 bg-stone-200 flex-shrink-0" />
          <button
            onClick={geoActive ? onClearLocation : onRequestLocation}
            disabled={geoDisabled}
            className={`${pill} flex-shrink-0 ${geoActive ? pillOn : pillOff} ${geoDisabled ? 'opacity-50 cursor-wait' : ''}`}
          >
            {geoLabel}
          </button>
          <span className="flex-shrink-0 bg-stone-100 text-stone-600 text-[10px] font-bold px-2.5 py-1.5 rounded-full tabular-nums min-w-[28px] text-center">
            {count}
          </span>
        </div>
      </div>
    </>
  )
}
