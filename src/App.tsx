import { useState, useRef, useCallback, useMemo } from 'react'
import L from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import gelaterie from './data/gelaterie.json'
import FilterBar from './components/FilterBar'
import GelatoCard from './components/GelatoCard'
import Map from './components/Map'
import { haversineDistance } from './utils/distance'

export interface Gelateria {
  id: number
  name: string
  address: string
  zone: string
  description: string
  type: 'artigianale' | 'cremeria' | 'granite' | 'yogurt'
  mustTry: string
  rating: number
  lat: number
  lng: number
  instagram?: string
  website?: string
}

export interface UserLocation {
  lat: number
  lng: number
}

const data = gelaterie as Gelateria[]

// Height of the open bottom sheet in vh (keep in sync with CSS)
const SHEET_OPEN_VH = 0.62

function IceCreamLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="13" r="12" fill="#5B7B5A" />
      <circle cx="11" cy="9" r="3" fill="#D4E8D3" opacity="0.55" />
      <path d="M5 21 L16 38 L27 21 Z" fill="#9C6B3C" />
      <line x1="8" y1="25" x2="24" y2="25" stroke="#FAF7F0" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="30" x2="22" y2="30" stroke="#FAF7F0" strokeWidth="1" strokeLinecap="round" />
      <line x1="13" y1="35" x2="19" y2="35" stroke="#FAF7F0" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-stone-400">
      <div className="flex justify-center mb-4 opacity-25">
        <IceCreamLogo size={56} />
      </div>
      <p className="text-sm font-bold text-stone-500">Nessuna gelateria trovata</p>
      <p className="text-xs mt-1 text-stone-400">Prova a cambiare i filtri</p>
    </div>
  )
}

const ZONE_ORDER = [
  'Centro', 'Navigli', 'Brera', 'Isola', 'Porta Venezia',
  'Sempione', 'Sarpi', 'Garibaldi', 'Porta Romana', 'Porta Genova',
  'Città Studi', 'NOLO', 'Lambrate', 'Cenisio', 'Bovisa',
]

export default function App() {
  const [selectedZone, setSelectedZone] = useState<string>('Tutti')
  const [selectedType, setSelectedType] = useState<string>('Tutti')
  const [activeId, setActiveId]         = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [geoStatus, setGeoStatus]       = useState<'idle' | 'loading' | 'denied' | 'unavailable'>('idle')
  const [sheetOpen, setSheetOpen]       = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)

  const zones = useMemo(() => {
    const inData = new Set(data.map((g) => g.zone))
    return ZONE_ORDER.filter((z) => inData.has(z))
  }, [])

  const filtered = useMemo(() => {
    const list = data.filter((g) => {
      const zoneMatch = selectedZone === 'Tutti' || g.zone === selectedZone
      const typeMatch = selectedType === 'Tutti' || g.type === selectedType
      return zoneMatch && typeMatch
    })
    if (userLocation) {
      return [...list].sort((a, b) => {
        const dA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng)
        const dB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        return dA - dB
      })
    }
    return list
  }, [selectedZone, selectedType, userLocation])

  const panToGelateria = useCallback((g: Gelateria, openSheet: boolean) => {
    const map = mapRef.current
    if (!map) return
    const zoom = 16
    const isMobile = window.innerWidth < 768

    if (isMobile && openSheet) {
      // Shift the map center so the pin is visible above the open bottom sheet.
      // setView centers on the given latLng; we offset the center southward by
      // half the sheet height so the pin ends up in the upper visible area.
      const sheetPx = window.innerHeight * SHEET_OPEN_VH
      const yOffsetPx = sheetPx / 2
      const pinPoint = map.project(L.latLng(g.lat, g.lng), zoom)
      const adjustedPoint = pinPoint.add([0, yOffsetPx])
      const adjustedCenter = map.unproject(adjustedPoint, zoom)
      map.setView(adjustedCenter, zoom, { animate: true })
    } else {
      map.setView([g.lat, g.lng], zoom, { animate: true })
    }
  }, [])

  const handleCardClick = useCallback((g: Gelateria) => {
    setActiveId(g.id)
    setSheetOpen(true)
    panToGelateria(g, true)
  }, [panToGelateria])

  const handleMarkerClick = useCallback((id: number) => {
    setActiveId(id)
    const g = data.find((x) => x.id === id)
    if (g) panToGelateria(g, sheetOpen)
  }, [panToGelateria, sheetOpen])

  const handleZoneChange = useCallback((zone: string) => {
    setSelectedZone(zone)
    setActiveId(null)
    setSheetOpen(false)
  }, [])

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type)
    setActiveId(null)
    setSheetOpen(false)
  }, [])

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) { setGeoStatus('unavailable'); return }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setGeoStatus('idle')
        if (mapRef.current) mapRef.current.setView([loc.lat, loc.lng], 14, { animate: true })
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const clearLocation = useCallback(() => {
    setUserLocation(null)
    setGeoStatus('idle')
  }, [])

  return (
    <div className="flex flex-col bg-cream font-sans" style={{ height: '100dvh', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <header className="flex-shrink-0 app-header border-b border-cream-dark shadow-sm px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-pistachio rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <IceCreamLogo size={22} className="brightness-[5]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-stone-800 leading-tight tracking-tight">
              Gelaterie Milano
            </h1>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Le migliori gelaterie artigianali della città
            </p>
          </div>
          <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 bg-pistachio-light px-3 py-1.5 rounded-full">
            <span className="text-pistachio-dark text-xs font-bold">{data.length}</span>
            <span className="text-pistachio text-xs">gelaterie</span>
          </div>
        </div>
      </header>

      {/* ── Filter bar ── */}
      <div className="flex-shrink-0 bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto">
          <FilterBar
            zones={zones}
            selectedZone={selectedZone}
            selectedType={selectedType}
            onZoneChange={handleZoneChange}
            onTypeChange={handleTypeChange}
            count={filtered.length}
            userLocation={userLocation}
            geoStatus={geoStatus}
            onRequestLocation={requestLocation}
            onClearLocation={clearLocation}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="relative h-full md:flex md:max-w-screen-xl md:w-full md:mx-auto">

          {/* Map — full screen on mobile, left panel on desktop */}
          <div className="absolute inset-0 md:static md:flex-[3]">
            <Map
              gelaterie={filtered}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              mapRef={mapRef}
              userLocation={userLocation}
            />
          </div>

          {/* ── Bottom sheet (mobile) / Right sidebar (desktop) ── */}
          <div
            className={[
              // Mobile: absolute bottom sheet with slide animation
              'absolute bottom-0 left-0 right-0',
              'h-[62vh] bg-white rounded-t-2xl shadow-2xl gelato-list',
              'transition-transform duration-300 ease-out will-change-transform',
              sheetOpen ? 'translate-y-0 overflow-y-auto' : 'translate-y-[calc(62vh-116px)] overflow-hidden',
              // Desktop: static sidebar
              'md:static md:translate-y-0 md:h-auto md:max-h-none md:overflow-y-auto',
              'md:rounded-none md:shadow-none md:border-l md:border-stone-200 md:flex-[2]',
            ].join(' ')}
          >
            {/* ── Mobile handle (tap to toggle) ── */}
            <button
              className="md:hidden w-full flex flex-col items-center pt-2.5 pb-1 flex-shrink-0 focus:outline-none"
              onClick={() => setSheetOpen((v) => !v)}
              aria-label={sheetOpen ? 'Chiudi lista' : 'Apri lista'}
            >
              <div className="w-10 h-1 bg-stone-300 rounded-full" />
              <div className="flex items-center gap-2 mt-2 mb-0.5">
                <span className="text-xs font-semibold text-stone-600">
                  {filtered.length} gelaterie
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-300 ${sheetOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {/* Desktop header */}
            <div className="hidden md:flex items-center justify-between px-5 pt-4 pb-2">
              <p className="text-sm font-bold text-stone-700">{filtered.length} gelaterie</p>
              {selectedZone !== 'Tutti' && (
                <span className="text-xs bg-pistachio-light text-pistachio-dark font-semibold px-2.5 py-1 rounded-full animate-pop-in">
                  {selectedZone}
                </span>
              )}
            </div>

            {/* Card list */}
            <div key={`${selectedZone}|${selectedType}`} className="px-4 pb-10 md:px-5 md:pb-8 space-y-4">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((g, i) => (
                  <GelatoCard
                    key={g.id}
                    gelateria={g}
                    isActive={g.id === activeId}
                    onClick={handleCardClick}
                    userLocation={userLocation}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
