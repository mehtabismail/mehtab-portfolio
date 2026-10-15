import { ArrowRight } from 'lucide-react'
import { projects, work } from '../../../content/site'
import { pad } from '../../../lib/project'
import { Reveal } from '../../ui/Reveal'
import { SectionHeading } from '../../ui/SectionHeading'
import { ProjectSheet } from './ProjectSheet'

export function SelectedWork() {
  const featured = projects.filter((p) => p.featured)

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <SectionHeading index="03" label="Case studies" title={work.heading} id="work-title">
          {work.intro}
        </SectionHeading>

        <div className="mt-16 md:mt-20">
          {featured.map((project) => (
            <ProjectSheet key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>

        <Reveal>
          <a
            href="/work/"
            className="group relative flex items-center justify-between gap-6 overflow-hidden border border-line-strong px-6 py-8 transition-colors duration-500 hover:border-accent sm:px-10 sm:py-10"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
            />
            <span className="relative">
              <span className="block label-mono text-faint transition-colors duration-500 group-hover:text-accent-ink/70">
                {pad(projects.length)} projects · filter by category
              </span>
              <span className="mt-2 block font-display text-3xl font-semibold tracking-[-0.03em] transition-colors duration-500 group-hover:text-accent-ink sm:text-5xl">
                See all work
              </span>
            </span>
            <ArrowRight
              className="relative size-8 shrink-0 text-accent transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-accent-ink sm:size-10"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
