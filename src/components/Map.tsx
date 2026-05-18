import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import type { Gelateria, UserLocation } from '../App'

const MILAN_CENTER: [number, number] = [45.4654, 9.1866]

const HEADER_COLORS: Record<Gelateria['type'], string> = {
  artigianale: '#5B7B5A',
  cremeria:    '#C4883A',
  granite:     '#3A7BC8',
  yogurt:      '#D95F6A',
}

function makeEmojiIcon(active: boolean) {
  return L.divIcon({
    html: `<div class="emoji-marker${active ? ' emoji-marker-active' : ''}">🍦</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 36],
    popupAnchor: [0, -38],
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
              radius={24}
              pathOptions={{ color: '#3b82f6', weight: 1, fillColor: '#3b82f6', fillOpacity: 0.1 }}
              interactive={false}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 1, color: '#ffffff', weight: 2.5 }}
            >
              <Popup>
                <div className="p-3">
                  <p className="font-bold text-stone-800 text-sm">📍 La tua posizione</p>
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
              <div>
                {/* Popup color header */}
                <div
                  className="h-10 flex items-center px-3 gap-2"
                  style={{ background: HEADER_COLORS[g.type] }}
                >
                  <span className="text-white/80 text-lg">🍦</span>
                  <span className="text-white text-[10px] font-bold uppercase tracking-wide">
                    {g.zone}
                  </span>
                  <span className="ml-auto text-amber-300 text-xs font-bold">★ {g.rating.toFixed(1)}</span>
                </div>

                {/* Popup body */}
                <div className="p-3">
                  <p className="font-bold text-stone-800 text-sm leading-tight">{g.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{g.address}</p>
                  <p className="text-xs text-stone-600 mt-2">
                    <span className="font-semibold text-pistachio-dark">✦ Da provare:</span> {g.mustTry}
                  </p>

                  {/* Action links */}
                  <div className="flex gap-1.5 mt-2.5">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${g.lat},${g.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold transition-colors"
                    >
                      📍 Naviga
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.name + ' ' + g.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-bold transition-colors"
                    >
                      ⭐ Recensioni
                    </a>
                  </div>

                  {g.website && (
                    <a
                      href={g.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs text-pistachio hover:underline mt-1.5 font-medium"
                    >
                      Visita il sito ↗
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
