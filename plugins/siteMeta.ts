import type { Plugin } from 'vite'
import { seo, site, socials } from '../src/content/site.ts'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const abs = (path: string) => new URL(path, site.url).toString()

type PagePath = keyof typeof seo.pages

function pagePath(htmlPath: string): PagePath {
  return htmlPath.includes('/work/') ? '/work/' : '/'
}

function notFoundTags() {
  return [
    `<title>${esc(seo.notFound.title)}</title>`,
    `<meta name="description" content="${esc(seo.notFound.description)}" />`,
    `<meta name="robots" content="noindex" />`,
  ].join('\n    ')
}

function headTags(path: PagePath) {
  const page = seo.pages[path]
  const url = abs(path)
  const image = abs(seo.ogImage)
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: seo.jobTitle,
    url: abs('/'),
    image,
    address: { '@type': 'PostalAddress', addressLocality: site.location },
    sameAs: socials.map((s) => s.href),
  }

  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(seo.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
  ].join('\n    ')
}

/**
 * Fills the `<!-- site-meta -->` placeholder in each HTML page from
 * src/content/site.ts, and emits robots.txt + sitemap.xml at build time.
 */
export function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml(html, ctx) {
      const tags = ctx.path.endsWith('/404.html') ? notFoundTags() : headTags(pagePath(ctx.path))
      return html.replace('<!-- site-meta -->', tags)
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = (Object.keys(seo.pages) as PagePath[])
        .map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`,
      })
    },
  }
}
