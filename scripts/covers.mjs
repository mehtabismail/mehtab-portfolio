// Renders the project covers in scripts/covers/cover.html with headless Chrome
// (macOS path, like `npm run og`), then writes public/work/<project>-800.avif,
// <project>-1200.avif and a 1200w <project>.jpg fallback.
// Run: npm run covers  (or npm run covers -- <project> … for a few)
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const all = [
  'bling',
  'kave',
  'liora',
  'arca',
  'safetycheck',
  'isqroll',
  'mish',
  'locumbridge',
  'mybenefits',
  'ponataki',
  'safesigns',
  'whou',
  'aawhina',
  'devtinder',
]
// `npm run covers -- mish whou` renders just those; no arguments renders all.
const projects = process.argv.length > 2 ? process.argv.slice(2) : all
const unknown = projects.filter((p) => !all.includes(p))
if (unknown.length) throw new Error(`no cover layout for: ${unknown.join(', ')}`)
// Widths for srcset in ProjectCover.tsx; cards display at ~380–460 CSS px.
const widths = [800, 1200]
const tmp = mkdtempSync(join(tmpdir(), 'covers-'))
mkdirSync('public/work', { recursive: true })

// sips ships with macOS (AVIF needs macOS 13+). Below q80 the cover's faint grid smears.
function sips(png, format, quality, width, out) {
  execFileSync(
    'sips',
    ['-s', 'format', format, '-s', 'formatOptions', String(quality)].concat([
      '--resampleWidth',
      String(width),
      png,
      '--out',
      out,
    ]),
    { stdio: 'ignore' },
  )
  console.log(`wrote ${out}`)
}

for (const p of projects) {
  const png = join(tmp, `${p}.png`)
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1500,1200',
      '--allow-file-access-from-files',
      '--virtual-time-budget=3000',
      `--screenshot=${png}`,
      `file://${resolve('scripts/covers/cover.html')}?p=${p}`,
    ],
    { stdio: 'ignore' },
  )
  for (const w of widths) sips(png, 'avif', 80, w, `public/work/${p}-${w}.avif`)
  // fallback for browsers without AVIF
  sips(png, 'jpeg', 78, widths.at(-1), `public/work/${p}.jpg`)
}

rmSync(tmp, { recursive: true, force: true })
