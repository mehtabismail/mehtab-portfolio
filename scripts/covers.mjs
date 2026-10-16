// Renders the project covers in scripts/covers/cover.html to public/work/<project>.jpg
// with headless Chrome (macOS path, like `npm run og`). Run: npm run covers
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const projects = ['bling', 'kave', 'liora', 'arca']
const tmp = mkdtempSync(join(tmpdir(), 'covers-'))
mkdirSync('public/work', { recursive: true })

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
  // sips ships with macOS: PNG → JPEG at a web-friendly quality
  execFileSync(
    'sips',
    ['-s', 'format', 'jpeg', '-s', 'formatOptions', '78', png, '--out', `public/work/${p}.jpg`],
    {
      stdio: 'ignore',
    },
  )
  console.log(`wrote public/work/${p}.jpg`)
}

rmSync(tmp, { recursive: true, force: true })
