// Runs after `vite build` and `vite build --ssr`: writes each page's rendered
// HTML into the built index.html files, then removes the temporary SSR bundle.
import { access, readFile, rm, writeFile } from 'node:fs/promises'

const { render } = await import('../dist-ssr/entry-server.js')

const pages = [
  ['home', 'dist/index.html'],
  ['work', 'dist/work/index.html'],
]

for (const [page, file] of pages) {
  const html = await readFile(file, 'utf8')
  const out = html.replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`)
  if (out === html) throw new Error(`Couldn't find the empty #root in ${file}`)
  await writeFile(file, out)
  console.log(`prerendered ${file} (${Math.round(out.length / 1024)} KB)`)
}

await rm('dist-ssr', { recursive: true, force: true })

// The "Resume" links point at /resume.pdf; warn (don't fail) until it exists.
await access('dist/resume.pdf').catch(() =>
  console.warn('⚠ public/resume.pdf is missing — the Resume links will 404 until you add it.'),
)
