// Exports every Firestore collection, document and subcollection from the old
// Firebase project to data/firestore-export.json. READ-ONLY: it only calls
// listCollections, listDocuments and getAll — nothing is ever written to Firestore.
// Needs serviceAccountKey.json in the project root (gitignored). Run:
//   node scripts/export-firestore.js
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cert, initializeApp } from 'firebase-admin/app'
import { DocumentReference, GeoPoint, Timestamp, getFirestore } from 'firebase-admin/firestore'

const keyPath = new URL('../serviceAccountKey.json', import.meta.url)
const out = 'data/firestore-export.json'

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf8'))) })
const db = getFirestore()

// Firestore value → plain JSON
function plain(value) {
  if (value === null || value === undefined) return null
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (value instanceof GeoPoint) return { lat: value.latitude, lng: value.longitude }
  if (value instanceof DocumentReference) return value.path
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return { $bytes: Buffer.from(value).toString('base64') }
  }
  if (Array.isArray(value)) return value.map(plain)
  if (typeof value === 'object') {
    // e.g. VectorValue, or anything else non-plain
    if (typeof value.toArray === 'function') return value.toArray()
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]))
  }
  return value
}

let docCount = 0

async function exportCollection(ref) {
  // listDocuments also returns "missing" parent docs that only hold subcollections
  const refs = await ref.listDocuments()
  const snaps = refs.length ? await db.getAll(...refs) : []
  const docs = {}
  for (const snap of snaps) {
    docCount++
    const subs = await snap.ref.listCollections()
    const entry = { exists: snap.exists, data: snap.exists ? plain(snap.data()) : null }
    if (subs.length) {
      entry.subcollections = {}
      for (const sub of subs) entry.subcollections[sub.id] = await exportCollection(sub)
    }
    docs[snap.id] = entry
  }
  return docs
}

const result = { exportedAt: new Date().toISOString(), collections: {} }
for (const col of await db.listCollections()) {
  result.collections[col.id] = await exportCollection(col)
  console.log(`${col.id}: ${Object.keys(result.collections[col.id]).length} documents`)
}

mkdirSync('data', { recursive: true })
writeFileSync(out, JSON.stringify(result, null, 2) + '\n')
console.log(`wrote ${out} (${docCount} documents in total)`)
