import type { Project, ProjectCategory } from '../content/site'

/** The title it is safe to show publicly. */
export const projectTitle = (p: Project) => (p.showName ? p.name : p.alias)

/** Links are hidden while a client name is withheld, since URLs would reveal it. */
export function projectLinks(p: Project) {
  if (!p.showName) return []
  const { live, appStore, googlePlay, caseStudy, repo } = p.links
  return [
    live && { label: 'Live', href: live },
    appStore && { label: 'App Store', href: appStore },
    googlePlay && { label: 'Google Play', href: googlePlay },
    caseStudy && { label: 'Case study', href: caseStudy },
    repo && { label: 'Repo', href: repo },
  ].filter((l): l is { label: string; href: string } => Boolean(l))
}

export const pad = (n: number) => String(n).padStart(2, '0')

/** "Built at ZAPTA Technologies" / "Own project", or null when not specified. */
export const projectOrigin = (p: Project) =>
  p.madeAt ? `Built at ${p.madeAt}` : p.own ? 'Own project' : null

/** What a cover draws: the screenshots when there are any, or the system figure. */
export type CoverArt = 'auto' | 'figure'

/**
 * The highlighted chip says what the cover shows: Architecture for the system
 * figure, Mobile or Web for screenshots.
 */
export function coverCategory(p: Project, art: CoverArt): ProjectCategory {
  if (art === 'figure' || !p.cover || !p.figure) return p.figure ? 'Architecture' : p.category
  return p.coverKind === 'web' ? 'Web' : 'Mobile'
}

/** Highlighted chip first, then the project's other categories. */
export const chipsFor = (p: Project, highlight: ProjectCategory) => [
  highlight,
  ...p.categories.filter((c) => c !== highlight),
]
