import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import type { Gelateria, UserLocation } from '../App'

const MILAN_CENTER: [number, number] = [45.4654, 9.1866]

function makeEmojiIcon(active: boolean) {
  return L.divIcon({
    html: `<div class="emoji-marker${active ? ' emoji-marker-active' : ''}">🍦</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    popupAnchor: [0, -36],
  })
}

function MapController({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

interface Props {
  gelaterie: Gelateria[]
  activeId: number | null
  onMarkerClick: (id: number) => void
  mapRef: React.MutableRefObject<LeafletMap | null>
  userLocation: UserLocation | null
}

export default function Map({ gelaterie, activeId, onMarkerClick, mapRef, userLocation }: Props) {
  const markerRefs = useRef<Record<number, L.Marker>>({})

  useEffect(() => {
    if (activeId !== null) {
      markerRefs.current[activeId]?.openPopup()
    }
  }, [activeId])

  return (
    <div className="relative w-full h-full flex-1" style={{ minHeight: 0 }}>
      <MapContainer
        center={MILAN_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapController mapRef={mapRef} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {userLocation && (
          <>
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={22}
              pathOptions={{ color: '#3b82f6', weight: 1, fillColor: '#3b82f6', fillOpacity: 0.13 }}
              interactive={false}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 1, color: '#ffffff', weight: 2.5 }}
            >
              <Popup>
                <div className="p-3">
                  <p className="font-semibold text-stone-800 text-sm">📍 La tua posizione</p>
                  <p className="text-xs text-stone-500 mt-0.5">Lista ordinata per distanza</p>
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {gelaterie.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
            icon={makeEmojiIcon(g.id === activeId)}
            ref={(marker) => { if (marker) markerRefs.current[g.id] = marker }}
            eventHandlers={{ click: () => onMarkerClick(g.id) }}
          >
            <Popup>
              <div className="p-3">
                <p className="font-semibold text-stone-800 text-sm">{g.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{g.address}</p>
                <p className="text-xs text-stone-600 mt-2">
                  <span className="font-medium">✨ Da provare:</span> {g.mustTry}
                </p>
                {g.website && (
                  <a
                    href={g.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00897b] hover:underline mt-1.5 block"
                  >
                    Visita il sito ↗
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
