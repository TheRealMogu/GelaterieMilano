import { useState, useRef, useCallback, useMemo } from 'react'
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

function IceCreamLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <div className="text-center py-12 text-stone-400">
      <div className="flex justify-center mb-3 opacity-30">
        <IceCreamLogo size={52} />
      </div>
      <p className="text-sm font-medium">Nessuna gelateria trovata</p>
      <p className="text-xs mt-1">Prova a cambiare i filtri</p>
    </div>
  )
}

export default function App() {
  const [selectedZone, setSelectedZone] = useState<string>('Tutti')
  const [selectedType, setSelectedType] = useState<string>('Tutti')
  const [activeId, setActiveId] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'denied' | 'unavailable'>('idle')
  const mapRef = useRef<LeafletMap | null>(null)

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

  const handleCardClick = useCallback((g: Gelateria) => {
    setActiveId(g.id)
    if (mapRef.current) {
      mapRef.current.setView([g.lat, g.lng], 16, { animate: true })
    }
  }, [])

  const handleMarkerClick = useCallback((id: number) => {
    setActiveId(id)
  }, [])

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('unavailable')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setGeoStatus('idle')
        if (mapRef.current) {
          mapRef.current.setView([loc.lat, loc.lng], 14, { animate: true })
        }
      },
      (err) => {
        console.warn('Geolocation error', err)
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
      {/* Header */}
      <header className="flex-shrink-0 bg-cream border-b border-cream-dark shadow-sm px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <IceCreamLogo size={36} />
          <div>
            <h1 className="text-lg font-bold text-stone-800 leading-tight">Gelaterie Milano</h1>
            <p className="text-xs text-muted hidden sm:block">Le migliori gelaterie artigianali della città</p>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex-shrink-0 bg-cream border-b border-cream-dark">
        <div className="max-w-screen-xl mx-auto">
          <FilterBar
            selectedZone={selectedZone}
            selectedType={selectedType}
            onZoneChange={setSelectedZone}
            onTypeChange={setSelectedType}
            count={filtered.length}
            userLocation={userLocation}
            geoStatus={geoStatus}
            onRequestLocation={requestLocation}
            onClearLocation={clearLocation}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="relative h-full md:flex md:max-w-screen-xl md:w-full md:mx-auto">
          {/* Map: fills screen on mobile, flex-[3] sidebar on desktop */}
          <div className="absolute inset-0 md:static md:flex-[3]">
            <Map
              gelaterie={filtered}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              mapRef={mapRef}
              userLocation={userLocation}
            />
          </div>

          {/* List: bottom sheet on mobile, right sidebar on desktop */}
          <div
            className={
              'absolute bottom-0 left-0 right-0 max-h-[65vh] overflow-y-auto bg-white rounded-t-2xl shadow-2xl ' +
              'md:static md:flex-[2] md:max-h-none md:rounded-none md:shadow-none md:border-l md:border-stone-200 ' +
              'gelato-list'
            }
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-stone-200 rounded-full" />
            </div>
            <p className="text-xs text-center text-muted pb-2 md:hidden">
              {filtered.length} gelaterie trovate
            </p>
            <div className="px-3 pb-6 md:p-3 space-y-2">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((g) => (
                  <GelatoCard
                    key={g.id}
                    gelateria={g}
                    isActive={g.id === activeId}
                    onClick={handleCardClick}
                    userLocation={userLocation}
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
