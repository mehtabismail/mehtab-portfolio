// Turns the raw Firestore export (data/firestore-export.json) into a clean, flat
// data/projects.json matching FirestoreProject in src/content/firestoreProject.ts.
// Offline — it never touches Firebase. Run after export-firestore.js:
//   node scripts/build-projects-json.js
import { readFileSync, writeFileSync } from 'node:fs'

const raw = JSON.parse(readFileSync('data/firestore-export.json', 'utf8'))
const source = raw.collections.projects.my_projects.data.projects

// One spelling per technology. Combined entries ("JavaScript, React & Vite") are
// split first; anything not listed here is kept as written.
const techNames = {
  'Async-Storage': 'AsyncStorage',
  'RTK-Query': 'RTK Query',
  Tailwind: 'Tailwind CSS',
  NodeJs: 'Node.js',
  Node: 'Node.js',
  "CarJam Api's": 'CarJam APIs',
  'Google Calender API': 'Google Calendar API',
  'Outlook Calender API': 'Outlook Calendar API',
  'Daisy UI': 'daisyUI',
  'AR-Kit': 'ARKit',
}

function cleanTech(list) {
  const out = list
    .flatMap((t) => t.split(/,|&/))
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => techNames[t] ?? t)
  return [...new Set(out)]
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const unique = (list) => [...new Set(list)]

const projects = source
  .map((p) => ({
    id: p.id,
    slug: slugify(p.name),
    name: p.name.trim(),
    type: p.type,
    status: p.status,
    live: p.live,
    company: p.company,
    role: p.role,
    description: p.description.trim(),
    features: p.features ?? [],
    tech: cleanTech(p.tech),
    thumbnail: p.thumbnail,
    // the thumbnail also appears in some galleries; keep it only as `thumbnail`
    images: unique(p.images).filter((url) => url !== p.thumbnail),
    links: Object.fromEntries(
      Object.entries({
        web: p.web_app_link,
        ios: p.ios_app_link,
        android: p.android_app_link,
        github: p.github_link,
      }).filter(([, url]) => url),
    ),
  }))
  .sort((a, b) => Number(a.id) - Number(b.id))

// Fail loudly if a new Firestore field shows up that this script drops.
const known = new Set([
  'id',
  'name',
  'type',
  'status',
  'live',
  'company',
  'role',
  'description',
  'features',
  'tech',
  'thumbnail',
  'images',
  'web_app_link',
  'ios_app_link',
  'android_app_link',
  'github_link',
])
const unknown = unique(source.flatMap((p) => Object.keys(p)).filter((k) => !known.has(k)))
if (unknown.length) throw new Error(`unmapped Firestore fields: ${unknown.join(', ')}`)

writeFileSync('data/projects.json', JSON.stringify(projects, null, 2) + '\n')
console.log(`wrote data/projects.json (${projects.length} projects)`)
