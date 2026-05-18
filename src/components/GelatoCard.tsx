import type { Gelateria, UserLocation } from '../App'
import { formatDistance, haversineDistance } from '../utils/distance'

interface Props {
  gelateria: Gelateria
  isActive: boolean
  onClick: (g: Gelateria) => void
  userLocation: UserLocation | null
  index: number
}

const HEADER_GRADIENTS: Record<Gelateria['type'], string> = {
  artigianale: 'linear-gradient(135deg, #5B7B5A 0%, #2D4D2C 100%)',
  cremeria:    'linear-gradient(135deg, #C4883A 0%, #7A4F1A 100%)',
  granite:     'linear-gradient(135deg, #3A7BC8 0%, #1A4D85 100%)',
  yogurt:      'linear-gradient(135deg, #D95F6A 0%, #A03348 100%)',
}

const TYPE_LABELS: Record<Gelateria['type'], string> = {
  artigianale: 'Artigianale',
  cremeria:    'Cremeria',
  granite:     'Granite',
  yogurt:      'Yogurt',
}

const TYPE_EMOJIS: Record<Gelateria['type'], string> = {
  artigianale: '🍦',
  cremeria:    '🍨',
  granite:     '🧊',
  yogurt:      '🫙',
}

function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-amber-400 text-xs tracking-tight leading-none">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
      <span className="text-xs font-bold text-stone-700">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function GelatoCard({ gelateria: g, isActive, onClick, userLocation, index }: Props) {
  const distance = userLocation
    ? haversineDistance(userLocation.lat, userLocation.lng, g.lat, g.lng)
    : null

  const mapsUrl   = `https://www.google.com/maps/dir/?api=1&destination=${g.lat},${g.lng}`
  const reviewUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.name + ' ' + g.address)}`

  return (
    <button
      onClick={() => onClick(g)}
      className={`gelato-card w-full text-left rounded-2xl overflow-hidden bg-white border transition-colors duration-150 animate-fade-slide-up ${
        isActive
          ? 'border-pistachio ring-2 ring-pistachio/25 shadow-lg'
          : 'border-stone-100 shadow-sm hover:border-stone-200'
      }`}
      style={{ animationDelay: `${index * 0.045}s` }}
    >
      {/* ── Gradient header ── */}
      <div
        className="relative h-[72px] flex-shrink-0 overflow-hidden"
        style={{ background: HEADER_GRADIENTS[g.type] }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-black/10" />

        {/* Type + Zone badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
            {TYPE_LABELS[g.type]}
          </span>
          <span className="text-[10px] font-medium bg-black/20 text-white/90 px-2.5 py-1 rounded-full">
            {g.zone}
          </span>
        </div>

        {/* Large emoji */}
        <div className="absolute bottom-1.5 right-3 text-4xl opacity-75 select-none">
          {TYPE_EMOJIS[g.type]}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Name + rating */}
        <h3 className="font-bold text-[15px] text-stone-800 leading-tight">{g.name}</h3>
        <StarRating rating={g.rating} />

        {/* Address + distance */}
        <p className="text-xs text-stone-500 mt-1.5 truncate">
          {g.address}
          {distance !== null && (
            <>
              {' · '}
              <span className="font-semibold text-pistachio">{formatDistance(distance)}</span>
            </>
          )}
        </p>

        {/* Must-try pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-pistachio-light px-3 py-1.5 rounded-full max-w-full">
          <span className="text-pistachio text-[10px] font-bold flex-shrink-0">✦</span>
          <span className="text-[11px] text-pistachio-dark font-medium truncate">
            Da provare: {g.mustTry}
          </span>
        </div>

        {/* ── Footer ── */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 flex-wrap">
          {/* Links */}
          <div className="flex gap-2 flex-1 min-w-0">
            {g.instagram && (
              <span className="text-[10px] text-stone-400 truncate">{g.instagram}</span>
            )}
            {g.website && (
              <a
                href={g.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-pistachio hover:underline font-medium flex-shrink-0"
              >
                sito ↗
              </a>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-1.5 flex-shrink-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-600 text-[10px] font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              Naviga
            </a>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-600 text-[10px] font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              Recensioni
            </a>
          </div>
        </div>
      </div>
    </button>
  )
}
