import type { Project, ProjectCategory } from '../../content/site'
import { pad, projectTitle, type CoverArt } from '../../lib/project'
import { SystemFigureView } from '../figure/SystemFigureView'

interface Props {
  project: Project
  index: number
  /** smaller type for grid cards */
  compact?: boolean
  /** 'figure' always draws the system figure, even when screenshots exist */
  art?: CoverArt
  /** category shown in the title block */
  highlight: ProjectCategory
  /** defer drawing the system figure until the cover nears the viewport */
  lazy?: boolean
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
export function ProjectCover({
  project,
  index,
  compact = false,
  art = 'auto',
  highlight,
  lazy = false,
}: Props) {
  const title = projectTitle(project)
  const image = art === 'auto' ? project.cover : undefined

  return (
    <figure className="group/cover relative overflow-hidden border border-line bg-surface">
      <div className="relative aspect-[5/4]">
        {image ? (
          // Variants come from `npm run covers`; cards are ~340px on phones, ~530px at 1440.
          <picture>
            <source
              type="image/avif"
              srcSet={`${image}-800.avif 800w, ${image}-1200.avif 1200w`}
              sizes="(min-width: 768px) 540px, 100vw"
            />
            <img
              src={`${image}.jpg`}
              alt={`${title} — screenshot`}
              width={1200}
              height={960}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.03]"
            />
          </picture>
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
                <SystemFigureView figure={project.figure} lazy={lazy} className="size-full" />
              </div>
            ) : (
              <SpecSheet project={project} title={title} index={index} />
            )}
          </div>
        )}

        {/* inner drawing frame */}
        <span aria-hidden className="pointer-events-none absolute inset-3 border border-line" />

        {image && project.figure && (
          // Smaller on phones so it doesn't hide the screenshot it sits on.
          <div className="absolute right-4 bottom-4 w-[30%] max-w-[220px] border border-line-strong bg-bg/85 backdrop-blur sm:right-5 sm:bottom-5 sm:w-[38%]">
            <SystemFigureView
              figure={project.figure}
              lazy={lazy}
              className="h-auto w-full p-1.5 sm:p-2"
            />
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
        <span className="border-l border-line px-4 py-2.5 text-accent">{highlight}</span>
      </figcaption>
    </figure>
  )
}
