import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import type { Gelateria } from '../App'

const MILAN_CENTER: [number, number] = [45.4654, 9.1866]

function makeEmojiIcon(active: boolean) {
  return L.divIcon({
    html: `<div class="emoji-marker${active ? ' emoji-marker-active' : ''}">🍦</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -28],
  })
}

interface MapControllerProps {
  mapRef: React.MutableRefObject<LeafletMap | null>
}

function MapController({ mapRef }: MapControllerProps) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
  }, [map, mapRef])
  return null
}

interface Props {
  gelaterie: Gelateria[]
  activeId: number | null
  onMarkerClick: (id: number) => void
  mapRef: React.MutableRefObject<LeafletMap | null>
}

export default function Map({ gelaterie, activeId, onMarkerClick, mapRef }: Props) {
  const markerRefs = useRef<Record<number, L.Marker>>({})

  useEffect(() => {
    const activeMarker = activeId !== null ? markerRefs.current[activeId] : null
    if (activeMarker) {
      activeMarker.openPopup()
    }
  }, [activeId])

  return (
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
      {gelaterie.map((g) => (
        <Marker
          key={g.id}
          position={[g.lat, g.lng]}
          icon={makeEmojiIcon(g.id === activeId)}
          ref={(marker) => {
            if (marker) markerRefs.current[g.id] = marker
          }}
          eventHandlers={{
            click: () => onMarkerClick(g.id),
          }}
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
  )
}
