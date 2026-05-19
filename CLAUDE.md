# Gelaterie Milano — CLAUDE.md

Documentazione per sessioni Claude future su questo progetto.

## Stack tecnico

- **React 18 + TypeScript** via Vite 6
- **Tailwind CSS 3** per lo styling
- **Leaflet + react-leaflet** per la mappa (OpenStreetMap)
- **Vercel** per il deploy (vercel.json con SPA rewrite)

## Struttura del progetto

```
src/
├── App.tsx               # Root: stato globale, layout, logica filtri/geo
├── main.tsx              # Entry point React
├── index.css             # CSS globale + animazioni keyframe
├── data/
│   └── gelaterie.json    # Dataset delle gelaterie (55 voci)
├── components/
│   ├── FilterBar.tsx     # Filtri zona/tipo + geolocalizzazione
│   ├── GelatoCard.tsx    # Card singola stile TheFork
│   ├── Map.tsx           # Mappa Leaflet con marker emoji
│   └── TypeBadge.tsx     # Badge tipo (non più usato nelle card, potenzialmente rimuovibile)
└── utils/
    └── distance.ts       # Calcolo haversine + formattazione distanza
```

## Schema dati — gelaterie.json

```ts
interface Gelateria {
  id: number
  name: string
  address: string
  zone: string          // es. "Navigli", "Brera", "NOLO"...
  description: string
  type: 'artigianale' | 'cremeria' | 'granite' | 'yogurt'
  mustTry: string       // gusto consigliato
  rating: number        // 4.1–4.9
  lat: number           // coordinate WGS84 verificate
  lng: number
  instagram?: string
  website?: string
}
```

**Zone presenti:** Centro, Navigli, Brera, Isola, Porta Venezia, Sempione, Sarpi, Garibaldi, Porta Romana, Porta Genova, Città Studi, NOLO, Lambrate, Cenisio, Bovisa

L'ordine delle zone nella FilterBar è definito in `ZONE_ORDER` dentro `App.tsx`.

## Architettura dello stato (App.tsx)

| State | Tipo | Scopo |
|---|---|---|
| `selectedZone` | string | Filtro zona attivo |
| `selectedType` | string | Filtro tipo attivo |
| `activeId` | number \| null | Gelateria selezionata (card + marker) |
| `userLocation` | UserLocation \| null | Posizione GPS utente |
| `geoStatus` | enum | Stato geolocalizzazione |
| `sheetOpen` | boolean | Bottom sheet mobile aperta/peek |

## Comportamenti importanti

### Bottom sheet mobile
- Stato **peek** (116px): solo handle + count + chevron visibili
- Stato **open** (62vh): lista completa scrollabile
- Toggle: tap sull'handle; si chiude (peek) cambiando filtro
- La costante `SHEET_OPEN_VH = 0.62` è usata sia per il CSS che per il calcolo offset mappa

### Map offset su mobile
Quando si seleziona una card su mobile con sheet aperta, il centro mappa viene shiftato verso sud di `(sheetHeight / 2)` pixel in coordinate geografiche, così il pin appare nel centro dell'area visibile sopra la sheet. Usa `map.project` / `map.unproject` di Leaflet.

### Animazioni card
- Classe CSS `.animate-fade-slide-up` in `index.css` (non da tailwind.config)
- Stagger capped a `min(index, 10) * 0.045s` → max 0.45s
- Il container card ha `key={selectedZone|selectedType}` per remontare tutte le card (e ri-triggerare le animazioni) ad ogni cambio filtro

### Card HTML
Le card usano `<div role="button">` invece di `<button>` perché contengono tag `<a>` (Naviga, Recensioni) — `<a>` dentro `<button>` è HTML invalido.

### FilterBar mobile
- Tab **Zona** / **Tipo** in riga compatta
- Un pallino verde nella tab non attiva indica filtro attivo
- Bottone geo: solo icona su mobile, testo completo su desktop

## Coordinate
Tutte le coordinate sono state verificate manualmente rispetto alla topografia di Milano. Riferimento:
- Duomo: 45.4641, 9.1919
- Stazione Centrale: 45.4855, 9.2045
- Piazzale Loreto: 45.4919, 9.2178

## Comandi

```bash
npm run dev      # dev server
npm run build    # build produzione (tsc + vite)
npm run preview  # preview del build
```

## Cose da NON fare
- Non usare `<button>` come wrapper di card che contengono link
- Non aggiungere più di `~0.5s` di delay alle animazioni stagger
- Non definire `@keyframes` sia in `index.css` che in `tailwind.config.ts` (duplicati)
- Non mettere coordinate approssimative: verificare sempre rispetto agli indirizzi reali
