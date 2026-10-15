import { m, useReducedMotion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { projects, work, type ProjectCategory } from '../content/site'
import { pad } from '../lib/project'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ProjectCard } from '../components/work/ProjectCard'

type Filter = 'All' | ProjectCategory

const readFilter = (options: Filter[]): Filter => {
  const value = new URLSearchParams(window.location.search).get('category')
  return options.find((o) => o.toLowerCase() === value?.toLowerCase()) ?? 'All'
}

export function WorkPage() {
  const reduce = useReducedMotion()
  const options = useMemo<Filter[]>(() => {
    const cats = new Set<ProjectCategory>()
    projects.forEach((p) => p.categories.forEach((c) => cats.add(c)))
    return ['All', ...cats]
  }, [])
  // Start at 'All' so the prerendered HTML matches the first client render,
  // then apply any ?category= from the URL.
  const [filter, setFilter] = useState<Filter>('All')
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off sync from the URL after hydration
  useEffect(() => setFilter(readFilter(options)), [options])

  // Keep the filter in the URL so a filtered view can be shared.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (filter === 'All') url.searchParams.delete('category')
    else url.searchParams.set('category', filter.toLowerCase())
    window.history.replaceState(null, '', url)
  }, [filter])

  const count = (f: Filter) =>
    f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length
  const shown = filter === 'All' ? projects : projects.filter((p) => p.categories.includes(filter))

  return (
    <section id="work" aria-labelledby="all-work-title" className="relative pt-32 pb-24 md:pt-40">
      <div className="container-site">
        <a
          href="/"
          className="group mb-12 inline-flex items-center gap-2 label-mono text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
          Back home
        </a>

        <SectionHeading index="W" label="Index" title={work.allHeading} id="all-work-title">
          {work.allIntro}
        </SectionHeading>

        <div
          role="group"
          aria-label="Filter projects by category"
          className="mt-12 flex flex-wrap gap-2"
        >
          {options.map((o) => {
            const active = o === filter
            return (
              <button
                key={o}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(o)}
                className={`inline-flex items-center gap-2 border px-3.5 py-2 label-mono transition-colors ${
                  active
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-line-strong text-muted hover:border-ink hover:text-ink'
                }`}
              >
                {o}
                <span className={active ? 'text-accent-ink/70' : 'text-faint'}>
                  {pad(count(o))}
                </span>
              </button>
            )
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
        </p>

        <ul key={filter} className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {shown.map((project, i) => (
            <m.li
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
            >
              <ProjectCard project={project} index={projects.indexOf(project)} />
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
