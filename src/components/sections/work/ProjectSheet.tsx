import type { Project } from '../../../content/site'
import { pad, projectTitle } from '../../../lib/project'
import { Reveal } from '../../ui/Reveal'
import { ProjectCover } from '../../work/ProjectCover'
import { ProjectLinks } from '../../work/ProjectLinks'
import { SpecList } from '../../work/SpecList'

interface Props {
  project: Project
  index: number
}

/** One numbered case study: sticky index on the left, cover and spec table on the right. */
export function ProjectSheet({ project, index }: Props) {
  const title = projectTitle(project)

  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="group grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <p
              aria-hidden
              className="font-display text-[clamp(5rem,12vw,9rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent transition-[-webkit-text-stroke-color] duration-700 [-webkit-text-stroke:1px_var(--color-line-strong)] group-hover:[-webkit-text-stroke-color:var(--color-accent)]"
            >
              {pad(index + 1)}
            </p>
            <h3
              id={`project-${project.slug}`}
              className="mt-6 font-display text-3xl leading-tight font-semibold tracking-[-0.03em] md:text-4xl"
            >
              {title}
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="border border-accent/60 px-2.5 py-1 label-mono text-accent">
                {project.category}
              </span>
              {project.categories
                .filter((c) => c !== project.category)
                .map((c) => (
                  <span
                    key={c}
                    className="border border-line-strong px-2.5 py-1 label-mono text-muted"
                  >
                    {c}
                  </span>
                ))}
              {project.year && <span className="label-mono text-faint">{project.year}</span>}
            </div>
            <p className="mt-5 max-w-sm leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-6">
              <ProjectLinks project={project} />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="lg:col-span-8">
        <Reveal delay={0.1}>
          <ProjectCover project={project} index={index} />
        </Reveal>
        <Reveal delay={0.15} className="mt-8">
          <SpecList project={project} />
        </Reveal>
      </div>
    </article>
  )
}
