import type { Gelateria, UserLocation } from '../App'
import { formatDistance, haversineDistance } from '../utils/distance'
import TypeBadge from './TypeBadge'

interface Props {
  gelateria: Gelateria
  isActive: boolean
  onClick: (g: Gelateria) => void
  userLocation: UserLocation | null
}

export default function GelatoCard({ gelateria: g, isActive, onClick, userLocation }: Props) {
  const distance = userLocation
    ? haversineDistance(userLocation.lat, userLocation.lng, g.lat, g.lng)
    : null

  return (
    <button
      onClick={() => onClick(g)}
      className={`w-full text-left rounded-2xl p-5 transition-all duration-150 border border-stone-100 shadow-sm bg-white ${
        isActive ? 'ring-2 ring-pistachio shadow-md' : 'hover:shadow-md'
      }`}
    >
      {/* Row 1: name + type badge */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-sm text-stone-800 leading-tight truncate">{g.name}</h3>
        <TypeBadge type={g.type} />
      </div>

      {/* Row 2: zone · distance · address */}
      <p className="text-xs text-muted mt-1.5 truncate">
        {g.zone}
        {distance !== null && <> · {formatDistance(distance)}</>}
        {' · '}{g.address}
      </p>

      {/* Row 3: must-try with pistachio dot */}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-pistachio flex-shrink-0" />
        <span className="text-xs text-stone-600">
          <span className="font-medium">Da provare:</span> {g.mustTry}
        </span>
      </div>

      {/* Row 4: links + action buttons */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-3 flex-wrap">
        {g.instagram && (
          <span className="text-[10px] text-muted">{g.instagram}</span>
        )}
        {g.website && (
          <a
            href={g.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-muted hover:text-pistachio transition-colors"
          >
            sito web ↗
          </a>
        )}
        <div className="ml-auto flex gap-1.5">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${g.lat},${g.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Apri navigazione in Google Maps"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            Naviga
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.name + ' ' + g.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Vedi recensioni su Google"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            Recensioni
          </a>
        </div>
      </div>
    </button>
  )
}
