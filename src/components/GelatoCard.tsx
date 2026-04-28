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
      className={`w-full text-left rounded-xl p-4 min-h-[80px] transition-all duration-150 border border-stone-100 shadow-sm bg-white ${
        isActive ? 'ring-2 ring-pistachio shadow-md' : 'hover:shadow-md'
      }`}
    >
      {/* Row 1: name + type badge */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-sm text-stone-800 leading-tight truncate">{g.name}</h3>
        <TypeBadge type={g.type} />
      </div>

      {/* Row 2: zone · distance · address */}
      <p className="text-xs text-muted mt-1 truncate">
        {g.zone}
        {distance !== null && <> · {formatDistance(distance)}</>}
        {' · '}{g.address}
      </p>

      {/* Row 3: must-try with pistachio dot */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-pistachio flex-shrink-0" />
        <span className="text-xs text-stone-600">
          <span className="font-medium">Da provare:</span> {g.mustTry}
        </span>
      </div>

      {/* Row 4: links */}
      {(g.instagram || g.website) && (
        <div className="mt-2 pt-2 border-t border-stone-100 flex gap-3">
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
        </div>
      )}
    </button>
  )
}
