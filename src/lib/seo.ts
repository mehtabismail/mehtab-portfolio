// <head> tags for every page. Used at build time by plugins/siteMeta.ts (home,
// /work, 404) and by src/entry-server.tsx for each /work/<slug>/ case study.
import { caseStudies } from '../content/caseStudies.ts'
import { projects, seo, site, socials, type Project } from '../content/site.ts'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const abs = (path: string) => new URL(path, site.url).toString()

export type PagePath = keyof typeof seo.pages

export const projectPath = (p: Project) => `/work/${p.slug}/`

// Kept here rather than in lib/project.ts so the vite config never loads React code.
const title = (p: Project) => (p.showName ? p.name : p.alias)

const person = () => ({
  '@type': 'Person',
  name: site.name,
  jobTitle: seo.jobTitle,
  url: abs('/'),
  sameAs: socials.map((s) => s.href),
})

interface Meta {
  title: string
  description: string
  path: string
  image?: { url: string; width: number; height: number; alt: string }
  type?: 'website' | 'article'
  jsonLd: object[]
}

function tags(meta: Meta) {
  const url = abs(meta.path)
  const image = meta.image ?? {
    url: abs(seo.ogImage),
    width: 1200,
    height: 630,
    alt: seo.ogImageAlt,
  }
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image.url}" />`,
    `<meta property="og:image:width" content="${image.width}" />`,
    `<meta property="og:image:height" content="${image.height}" />`,
    `<meta property="og:image:alt" content="${esc(image.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image.url}" />`,
    // `<` is escaped so text can never close the script tag early.
    ...meta.jsonLd.map(
      (d) =>
        `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...d }).replace(/</g, '\\u003c')}</script>`,
    ),
  ].join('\n    ')
}

export function pageHead(path: PagePath) {
  const page = seo.pages[path]
  return tags({
    ...page,
    path,
    jsonLd: [
      {
        ...person(),
        image: abs(seo.ogImage),
        address: { '@type': 'PostalAddress', addressLocality: site.location },
      },
    ],
  })
}

export function notFoundHead() {
  return [
    `<title>${esc(seo.notFound.title)}</title>`,
    `<meta name="description" content="${esc(seo.notFound.description)}" />`,
    `<meta name="robots" content="noindex" />`,
  ].join('\n    ')
}

/** Search text for one case study: the headline when it has one, else the summary. */
export function projectDescription(p: Project) {
  return caseStudies[p.slug]?.headline ?? p.summary
}

export function projectHead(p: Project) {
  const name = title(p)
  const path = projectPath(p)
  const description = projectDescription(p)
  return tags({
    title: `${name} — case study by ${site.name}`,
    description,
    path,
    type: 'article',
    // Covers are 1200×960; share cards crop them to fit.
    image: p.cover
      ? { url: abs(`${p.cover}.jpg`), width: 1200, height: 960, alt: `${name} — screenshots` }
      : undefined,
    jsonLd: [
      {
        '@type': 'CreativeWork',
        name,
        headline: `${name} — case study`,
        description,
        url: abs(path),
        ...(p.year && { dateCreated: p.year.slice(0, 4) }),
        ...(p.cover && { image: abs(`${p.cover}.jpg`) }),
        keywords: [...p.categories, ...p.stack].join(', '),
        author: person(),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: 'Work', item: abs('/work/') },
          { '@type': 'ListItem', position: 3, name, item: abs(path) },
        ],
      },
    ],
  })
}

/** Every indexable URL, for sitemap.xml. */
export const sitemapPaths = () => [
  ...(Object.keys(seo.pages) as PagePath[]),
  ...projects.map(projectPath),
]
