// Runs after `vite build` and `vite build --ssr`: writes each page's rendered
// HTML into the built index.html files, then removes the temporary SSR bundle.
// Case studies share one built template (dist/project.html); each gets its own
// dist/work/<slug>/index.html with its own <head>, and the template is removed.
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const { render, caseStudyPages } = await import('../dist-ssr/entry-server.js')

const fill = (html, body, file) => {
  const out = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (out === html) throw new Error(`Couldn't find the empty #root in ${file}`)
  return out
}

const pages = [
  ['home', 'dist/index.html'],
  ['work', 'dist/work/index.html'],
  ['notfound', 'dist/404.html'],
]

for (const [page, file] of pages) {
  const out = fill(await readFile(file, 'utf8'), render(page), file)
  await writeFile(file, out)
  console.log(`prerendered ${file} (${Math.round(out.length / 1024)} KB)`)
}

const template = await readFile('dist/project.html', 'utf8')
if (!template.includes('<!-- site-meta -->'))
  throw new Error('project.html lost its site-meta placeholder')
const studies = caseStudyPages()
for (const { slug, head, html } of studies) {
  const file = `dist/work/${slug}/index.html`
  const out = fill(template.replace('<!-- site-meta -->', head), html, file)
  await mkdir(`dist/work/${slug}`, { recursive: true })
  await writeFile(file, out)
}
console.log(`prerendered ${studies.length} case studies in dist/work/<slug>/`)
await rm('dist/project.html')

await rm('dist-ssr', { recursive: true, force: true })

// The "Resume" links point at /resume.pdf; warn (don't fail) until it exists.
await access('dist/resume.pdf').catch(() =>
  console.warn('⚠ public/resume.pdf is missing — the Resume links will 404 until you add it.'),
)
