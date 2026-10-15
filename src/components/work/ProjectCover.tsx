import type { Project } from '../../content/site'
import { pad, projectTitle } from '../../lib/project'
import { ArchThumb } from './ArchThumb'

interface Props {
  project: Project
  index: number
  /** smaller type for grid cards */
  compact?: boolean
}

/**
 * Cover framed like a drawing sheet. Uses the project's image when provided;
 * otherwise the architecture diagram becomes the artwork. With an image, the
 * diagram is shown as an inset "Detail A" callout.
 */
export function ProjectCover({ project, index, compact = false }: Props) {
  const title = projectTitle(project)

  return (
    <figure className="group/cover relative overflow-hidden border border-line bg-surface">
      <div className="relative aspect-[16/10]">
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
            <ArchThumb
              arch={project.arch}
              className="absolute inset-0 m-auto h-[72%] w-[86%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/cover:scale-[1.04]"
            />
          </div>
        )}

        {/* inner drawing frame */}
        <span aria-hidden className="pointer-events-none absolute inset-3 border border-line" />

        {project.cover && (
          <div className="absolute right-5 bottom-5 w-[38%] max-w-[220px] border border-line-strong bg-bg/85 backdrop-blur">
            <ArchThumb arch={project.arch} className="h-auto w-full" />
            <span className="block border-t border-line px-2 py-1 label-mono text-[9px] text-faint">
              Detail A — architecture
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
