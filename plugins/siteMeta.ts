import type { Plugin } from 'vite'
import { projects } from '../src/content/site.ts'
import {
  abs,
  notFoundHead,
  pageHead,
  projectHead,
  sitemapPaths,
  type PagePath,
} from '../src/lib/seo.ts'

/** /work/<slug>/ → the project, for case-study URLs. */
const projectAt = (url: string) => {
  const slug = url.match(/^\/work\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1]
  return projects.find((p) => p.slug === slug)
}

/**
 * Fills the `<!-- site-meta -->` placeholder in each HTML page from
 * src/content/site.ts, and emits robots.txt + sitemap.xml at build time.
 *
 * project.html is the template for every case study. In dev, /work/<slug>/ is
 * served from it with that project's tags; in a build its placeholder is left
 * for scripts/prerender.mjs, which writes one page per project.
 */
export function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && projectAt(req.url)) req.url = '/project.html'
        next()
      })
    },
    transformIndexHtml(html, ctx) {
      let tags: string
      if (ctx.path.endsWith('/404.html')) tags = notFoundHead()
      else if (ctx.path.endsWith('/project.html')) {
        const project = ctx.originalUrl && projectAt(ctx.originalUrl)
        if (!project) return html // build: filled per project by the prerender
        tags = projectHead(project)
      } else tags = pageHead(ctx.path.includes('/work/') ? '/work/' : ('/' as PagePath))
      return html.replace('<!-- site-meta -->', tags)
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = sitemapPaths()
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
