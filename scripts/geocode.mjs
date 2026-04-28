import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../src/data/gelaterie.json')

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=it`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GelaterieMilano/1.0 geocoding-script' },
  })
  const data = await res.json()
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  }
  return null
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const gelaterie = JSON.parse(await readFile(dataPath, 'utf-8'))
const results = []
const failed = []

for (const g of gelaterie) {
  process.stdout.write(`[${g.id}] ${g.name} — ${g.address} ... `)
  const coords = await geocode(g.address)
  if (coords) {
    console.log(`✅ ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
    results.push({ ...g, lat: coords.lat, lng: coords.lng })
  } else {
    console.log('❌ non trovato, coords originali mantenute')
    results.push(g)
    failed.push(`${g.name} (${g.address})`)
  }
  await sleep(1200) // Nominatim: max 1 req/sec
}

await writeFile(dataPath, JSON.stringify(results, null, 2))
console.log(`\n✅ Done! ${results.length - failed.length}/${results.length} geocodificate.`)
if (failed.length > 0) {
  console.log('\n⚠️  Controlla manualmente:')
  failed.forEach(f => console.log(`   • ${f}`))
}
