import type { Gelateria, UserLocation } from '../App'
import { formatDistance, haversineDistance } from '../utils/distance'

const TYPE_LABELS: Record<string, string> = {
  artigianale: 'Artigianale',
  cremeria: 'Cremeria',
  granite: 'Granite',
  yogurt: 'Yogurt',
}

const TYPE_COLORS: Record<string, string> = {
  artigianale: 'bg-teal-50 text-teal-700 border border-teal-200',
  cremeria: 'bg-amber-50 text-amber-700 border border-amber-200',
  granite: 'bg-blue-50 text-blue-700 border border-blue-200',
  yogurt: 'bg-pink-50 text-pink-700 border border-pink-200',
}

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
      className={`w-full text-left rounded-xl p-3.5 transition-all border ${
        isActive
          ? 'bg-white border-[#00897b] shadow-md ring-1 ring-[#00897b]/30'
          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-stone-800 text-sm leading-tight truncate">
              {g.name}
            </h3>
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
              {g.zone}
            </span>
            {distance !== null && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                📍 {formatDistance(distance)}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5 truncate">{g.address}</p>
        </div>
        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${TYPE_COLORS[g.type]}`}>
          {TYPE_LABELS[g.type]}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-sm">✨</span>
        <span className="text-xs text-stone-600">
          <span className="font-medium text-stone-700">Da provare:</span> {g.mustTry}
        </span>
      </div>

      {(g.instagram || g.website) && (
        <div className="mt-1.5 flex gap-2">
          {g.instagram && (
            <span className="text-[10px] text-stone-400">{g.instagram}</span>
          )}
          {g.website && (
            <a
              href={g.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] text-[#00897b] hover:underline"
            >
              sito web ↗
            </a>
          )}
        </div>
      )}
    </button>
  )
}
