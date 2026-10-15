import type { Project } from '../content/site'

/** The title it is safe to show publicly. */
export const projectTitle = (p: Project) => (p.showName ? p.name : p.alias)

/** Links are hidden while a client name is withheld, since URLs would reveal it. */
export function projectLinks(p: Project) {
  if (!p.showName) return []
  const { live, caseStudy, repo } = p.links
  return [
    live && { label: 'Live', href: live },
    caseStudy && { label: 'Case study', href: caseStudy },
    repo && { label: 'Repo', href: repo },
  ].filter((l): l is { label: string; href: string } => Boolean(l))
}

export const pad = (n: number) => String(n).padStart(2, '0')
