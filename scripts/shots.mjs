// Gallery images for the case-study pages. Takes the screens in
// scripts/covers/shots and writes public/work/shots/<name>.avif plus a .jpg
// fallback, sized for the gallery, and records each image's size in
// src/content/shots.json so the page can reserve space before it loads.
// Run: npm run shots
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const src = 'scripts/covers/shots'
const out = 'public/work/shots'
mkdirSync(out, { recursive: true })

// Phone screens show ~280 CSS px wide, web screens ~900; both at 2x.
const PHONE_W = 560
const WEB_W = 1600

const size = (file) => {
  const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString()
  return {
    w: Number(info.match(/pixelWidth: (\d+)/)[1]),
    h: Number(info.match(/pixelHeight: (\d+)/)[1]),
  }
}

const manifest = {}
for (const file of readdirSync(src).sort()) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const name = basename(file, extname(file))
  const input = join(src, file)
  const { w, h } = size(input)
  const kind = w > h ? 'web' : 'mobile'
  // Even sizes only: Chrome draws a blank AVIF when either side is odd.
  const even = (n) => Math.floor(n / 2) * 2
  const width = even(Math.min(w, kind === 'web' ? WEB_W : PHONE_W))
  const height = even((h * width) / w)
  for (const [format, ext, quality] of [
    ['avif', 'avif', 70],
    ['jpeg', 'jpg', 80],
  ]) {
    execFileSync(
      'sips',
      ['-s', 'format', format, '-s', 'formatOptions', String(quality)].concat([
        '--resampleHeightWidth',
        String(height),
        String(width),
        input,
        '--out',
        join(out, `${name}.${ext}`),
      ]),
      { stdio: 'ignore' },
    )
  }
  manifest[name] = { w: width, h: height, kind }
  console.log(`wrote ${out}/${name} (${width}w, ${kind})`)
}

writeFileSync('src/content/shots.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(`wrote src/content/shots.json (${Object.keys(manifest).length} screens)`)
