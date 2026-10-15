import { ArrowUpRight, Lock } from 'lucide-react'
import type { Project } from '../../content/site'
import { projectLinks } from '../../lib/project'

export function ProjectLinks({ project }: { project: Project }) {
  const links = projectLinks(project)

  if (links.length === 0) {
    return (
      <p className="flex items-center gap-2 label-mono text-faint">
        <Lock className="size-3.5" aria-hidden />
        Details on request
      </p>
    )
  }

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 label-mono text-ink transition-colors hover:text-accent"
          >
            {l.label}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
