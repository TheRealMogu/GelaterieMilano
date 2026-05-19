# Changelog — Gelaterie Milano

## [Unreleased] — sessione corrente

### Fix mobile UI/UX
- **FilterBar mobile**: sostituiti 2 righe fissi con sistema a tab Zona/Tipo — risparmia ~40px di altezza
  - Tab attivo in verde pistachio; dot indicatore sulla tab inattiva quando c'è filtro attivo
  - Riepilogo filtri attivi visibile nella riga tab
  - Bottone geo: solo icona su mobile, label completa su desktop
- **Bottom sheet**: aggiunto comportamento peek/open con animazione CSS `transform` 300ms
  - Default: modalità peek (116px), mostra handle + count gelaterie + chevron
  - Tap handle → slide up a 62vh con chevron che ruota 180°
  - Torna in peek automaticamente al cambio filtro
- **Map offset**: quando si seleziona una card su mobile, il pin non finisce più sotto la sheet
  — calcolo preciso con Leaflet `project`/`unproject` che sposta il centro geografico di `sheet_height/2` px verso sud

### Fix UI/UX generali
- `<GelatoCard>`: sostituito `<button>` con `<div role="button">` — elimina HTML invalido di `<a>` dentro `<button>`
- Animazione stagger: delay cappato a `min(index, 10) × 45ms` (max 0.45s invece di 2.4s con 55 card)
- Container card con `key` che cambia al filtro → le card si remontano e le animazioni si ri-triggerano
- `activeId` si azzera al cambio zona/tipo: il pin sulla mappa non resta evidenziato per gelaterie non più visibili
- FilterBar: `cursor-pointer` sui pill; "Tutti i tipi" → "Tutti" per coerenza
- Separatore mappa/lista: `border-stone-200` (era quasi invisibile `stone-100`)
- Rimosse definizioni `animation`/`keyframes` duplicate da `tailwind.config.ts` (vivono solo in `index.css`)

---

## Redesign completo — ispirato a TheFork

### Nuove card TheFork-style
- Header con gradiente colorato per tipo (verde artigianale, ambra cremeria, blu granite, rosa yogurt)
- Emoji decorativa grande + badge tipo e zona sovrapposti sull'header
- Rating stelle (★★★★½ 4.8) con valore numerico
- Pill "Da provare" in verde pistachio
- Footer con link instagram/sito + pulsanti **Naviga** (blu) e **Recensioni** (ambra)
- Hover lift: `translateY(-3px)` + shadow con transizione CSS

### Animazioni
- `fadeSlideUp` con stagger per le card al caricamento
- `popIn` per i badge zona attiva sulla desktop list
- Emoji marker Leaflet con hover scale e glow sull'attivo

### FilterBar
- Pill più grandi e moderni, hover verde pistachio
- Badge count arrotondato
- Desktop: divider visivo tra filtri tipo e bottone geo

### Popup mappa
- Header colorato per tipo con rating in evidenza
- Pulsanti Naviga/Recensioni affiancati
- Border-radius e shadow aggiornati

### Dati — 55 gelaterie
- Aggiunto campo `rating` (4.1–4.9) a tutte le voci
- Nuove gelaterie: Umberto, Grom, Amorino, Marisa, Il Gelato del Duomo, Officina del Gelato, Venini, Panna e Cioccolato, San Marco, dei Giardini, Cenisio, Isola dei Colori, Il Gelato di Giovanni, Arco della Pace, dei Filosofi, Gelato e Basta, Naviglio Grande, Tortona, Ripamonti, Pasteur, Cremeria Bovisa, Argonne, Brenta
- Nuove zone: Porta Genova, Cenisio, Bovisa
- Zone gestite dinamicamente da `ZONE_ORDER` in `App.tsx`

---

## Fix coordinate + pulsanti navigazione

### Coordinate corrette
- **Ciacco** (ID 9): era puntato vicino a Stazione Centrale → corretto a Via Felice Casati (Porta Venezia); zona corretta da "Isola" a "Porta Venezia"
- **La Romana** (ID 10): coordinate a sud di Loreto → corretto a NE di Loreto (Viale Monza reale)
- **Bacio di Latte** (ID 16): troppo a nord → corretto all'area Piazza Oberdan
- **Gelateria Buonarroti** (ID 21): ~700m troppo a nord → corretto a Piazza Wagner/Pagano
- **Gelateria della Musica** (ID 1): ~350m a sud-ovest → corretto a Via Pestalozzi reale

### Nuovi pulsanti
- **Naviga**: apre Google Maps in modalità navigazione verso le coordinate esatte
- **Recensioni**: apre Google Maps search per nome + indirizzo
- Presenti sia nelle card che nel popup mappa

### 8 nuove gelaterie (→ 32 totali)
BrioGelato NOLO, Gelateria Lambrate, Sarpi Gelato, Gelateria Porta Nuova (Garibaldi), Gelateria Golgi (Città Studi), Gelateria Lodi (Porta Romana), Gelateria del Pavese (Navigli Pavese), Gelateria della Moscova (Brera)

---

## Layout e spaziatura

- Padding lista aumentato su desktop (`px-5 py-5`)
- Gap tra card: `space-y-3` → `space-y-4`
- Padding interno card: `p-4` → `p-5`, border-radius `rounded-xl` → `rounded-2xl`
- Separatore mappa/lista: `border-l-2` più visibile
- Bottom sheet mobile: `max-h-[58vh]` → `52vh` per mostrare più mappa

---

## App iniziale (v1)

- 24 gelaterie con mappa Leaflet + lista filtrata
- Filtri zona e tipo con pill
- Geolocalizzazione "Vicino a me" con ordinamento per distanza
- Design con palette pistachio/crema/nocciola, font Satoshi
- Deploy su Vercel con SPA rewrite
