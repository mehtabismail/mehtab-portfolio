import type { Project } from '../../content/site'
import { pad, projectTitle } from '../../lib/project'
import { SystemFigureView } from '../figure/SystemFigureView'

interface Props {
  project: Project
  index: number
  /** smaller type for grid cards */
  compact?: boolean
}

/** Typographic cover for projects with neither a screenshot nor a system figure. */
function SpecSheet({ project, title, index }: { project: Project; title: string; index: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-6 flex flex-col justify-between transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.03] sm:inset-10"
    >
      <span className="label-mono text-[10px] text-faint">
        PRJ-{pad(index + 1)}
        {project.year && ` · ${project.year}`}
      </span>
      <span className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-ink">
        {title}
        <span className="text-accent">.</span>
      </span>
      <span className="flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="border border-line-strong bg-bg/60 px-2 py-0.5 font-mono text-[10px] text-muted"
          >
            {s}
          </span>
        ))}
      </span>
    </div>
  )
}

/**
 * Cover framed like a drawing sheet. Uses the project's image when provided;
 * otherwise the project's system figure becomes the artwork, and failing that a
 * typographic spec sheet. With an image, the figure is an inset "Detail A" callout.
 */
export function ProjectCover({ project, index, compact = false }: Props) {
  const title = projectTitle(project)

  return (
    <figure className="group/cover relative overflow-hidden border border-line bg-surface">
      <div className="relative aspect-[5/4]">
        {project.cover ? (
          <img
            src={project.cover}
            alt={`${title} — screenshot`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 blueprint-grid">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 60% at 50% 45%, var(--color-accent-dim), transparent 70%)',
              }}
            />
            {project.figure ? (
              <div className="absolute inset-6 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.03] sm:inset-8">
                <SystemFigureView figure={project.figure} className="size-full" />
              </div>
            ) : (
              <SpecSheet project={project} title={title} index={index} />
            )}
          </div>
        )}

        {/* inner drawing frame */}
        <span aria-hidden className="pointer-events-none absolute inset-3 border border-line" />

        {project.cover && project.figure && (
          // Smaller on phones so it doesn't hide the screenshot it sits on.
          <div className="absolute right-4 bottom-4 w-[30%] max-w-[220px] border border-line-strong bg-bg/85 backdrop-blur sm:right-5 sm:bottom-5 sm:w-[38%]">
            <SystemFigureView figure={project.figure} className="h-auto w-full p-1.5 sm:p-2" />
            <span className="block truncate border-t border-line px-2 py-1 label-mono text-[9px] text-faint">
              Detail A<span className="hidden sm:inline"> — architecture</span>
            </span>
          </div>
        )}
      </div>

      {/* title block */}
      <figcaption
        className={`grid grid-cols-[1fr_auto_auto] border-t border-line label-mono text-faint ${compact ? 'text-[9px]' : 'text-[10px]'}`}
      >
        <span className="truncate px-4 py-2.5 text-muted">{title}</span>
        <span className="border-l border-line px-4 py-2.5">PRJ-{pad(index + 1)}</span>
        <span className="border-l border-line px-4 py-2.5 text-accent">{project.category}</span>
      </figcaption>
    </figure>
  )
}
