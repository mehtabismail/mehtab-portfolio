import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import type { Project } from '../../content/site'
import { chipsFor, coverCategory, projectOrigin, projectTitle } from '../../lib/project'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'
import { SpecList } from './SpecList'

interface Props {
  project: Project
  index: number
  /** draw the cover figure right away (cards near the top of the page) */
  eager?: boolean
}

/** Compact project card for the /work index, with the full spec behind a toggle. */
export function ProjectCard({ project, index, eager = false }: Props) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = useId()
  const highlight = coverCategory(project, 'auto')

  return (
    <article aria-labelledby={`card-${project.slug}`} className="flex flex-col">
      <ProjectCover project={project} index={index} compact highlight={highlight} lazy={!eager} />
      <div className="mt-6 flex items-start justify-between gap-4">
        <h2
          id={`card-${project.slug}`}
          className="font-display text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-3xl"
        >
          {projectTitle(project)}
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
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group inline-flex items-center gap-2 label-mono text-ink transition-colors hover:text-accent"
        >
          {open ? 'Hide spec' : 'View spec'}
          <span className="grid size-7 place-items-center border border-line-strong transition-colors group-hover:border-accent">
            <Plus
              className={`size-3.5 transition-transform duration-500 ${open ? 'rotate-45' : ''}`}
              aria-hidden
            />
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <SpecList project={project} />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </article>
  )
}
