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
    <div className="flex flex-col h-screen bg-[#faf9f5] font-sans">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-stone-200 shadow-sm px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🍦</span>
          <div>
            <h1 className="text-lg font-bold text-stone-800 leading-tight">
              Gelaterie Milano
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block">
              Le migliori gelaterie artigianali della città
            </p>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex-shrink-0 bg-white border-b border-stone-200 px-4 py-2">
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
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-screen-xl w-full mx-auto">
        {/* Map panel */}
        <div className="h-[40vh] md:h-auto md:flex-[3] relative">
          <Map
            gelaterie={filtered}
            activeId={activeId}
            onMarkerClick={handleMarkerClick}
            mapRef={mapRef}
            userLocation={userLocation}
          />
        </div>

        {/* List panel */}
        <div className="flex-1 md:flex-[2] overflow-y-auto gelato-list border-t md:border-t-0 md:border-l border-stone-200">
          <div className="p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <span className="text-4xl block mb-2">🍦</span>
                <p className="text-sm">Nessuna gelateria trovata</p>
                <p className="text-xs mt-1">Prova a cambiare i filtri</p>
              </div>
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
  )
}
