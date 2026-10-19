import { ArrowRight } from 'lucide-react'
import type { Project } from '../../content/site'
import {
  chipsFor,
  coverCategory,
  projectHref,
  projectOrigin,
  projectTitle,
} from '../../lib/project'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'

interface Props {
  project: Project
  index: number
  /** draw the cover figure right away (cards near the top of the page) */
  eager?: boolean
}

/** Compact project card for the /work index, linking to the full case study. */
export function ProjectCard({ project, index, eager = false }: Props) {
  const highlight = coverCategory(project, 'auto')
  const href = projectHref(project)

  return (
    <article aria-labelledby={`card-${project.slug}`} className="group/card flex flex-col">
      {/* The title link is the card's one tab stop; the cover repeats it for pointer users. */}
      <a href={href} tabIndex={-1} aria-hidden className="block">
        <ProjectCover project={project} index={index} compact highlight={highlight} lazy={!eager} />
      </a>
      <div className="mt-6 flex items-start justify-between gap-4">
        <h2
          id={`card-${project.slug}`}
          className="font-display text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-3xl"
        >
          <a href={href} className="transition-colors hover:text-accent">
            {projectTitle(project)}
          </a>
        </h2>
        {project.year && <span className="pt-2 label-mono text-faint">{project.year}</span>}
      </div>
      {projectOrigin(project) && (
        <p className={`mt-1 label-mono ${project.madeAt ? 'text-accent' : 'text-faint'}`}>
          {projectOrigin(project)}
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Categories">
        {chipsFor(project, highlight).map((c) => (
          <li
            key={c}
            className={`border px-2 py-0.5 label-mono text-[10px] ${c === highlight ? 'border-accent/60 text-accent' : 'border-line-strong text-muted'}`}
          >
            {c}
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <ProjectLinks project={project} />
        <CaseStudyLink project={project} />
      </div>
    </article>
  )
}

/** "Read case study" with the drafting-box arrow used across the site. */
export function CaseStudyLink({ project }: { project: Project }) {
  return (
    <a
      href={projectHref(project)}
      aria-label={`Read the ${projectTitle(project)} case study`}
      className="group inline-flex items-center gap-2 label-mono text-ink transition-colors hover:text-accent"
    >
      Read case study
      <span className="grid size-7 place-items-center border border-line-strong transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
        <ArrowRight
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </a>
  )
}
