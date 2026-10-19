import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { caseStudies, galleries } from '../content/caseStudies'
import { projects, type Project } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { chipsFor, coverCategory, pad, projectHref, projectTitle } from '../lib/project'
import { scrollToId } from '../lib/scroll'
import { Gallery } from '../components/case/Gallery'
import { ArchitectureFigure } from '../components/figure/ArchitectureFigure'
import { BookCallButton, WhatsAppLink } from '../components/ui/BookCall'
import { Reveal } from '../components/ui/Reveal'
import { ProjectCover } from '../components/work/ProjectCover'
import { ProjectLinks } from '../components/work/ProjectLinks'

interface Section {
  id: string
  label: string
  title: string
  body: ReactNode
}

function CaseSection({ section, n }: { section: Section; n: number }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="border-t border-line py-14 md:py-20"
    >
      <Reveal>
        <p aria-hidden className="flex items-center gap-3 label-mono text-faint">
          <span className="text-accent">§{pad(n)}</span>
          {section.label}
        </p>
        <h2
          id={`${section.id}-title`}
          className="mt-4 font-display text-3xl leading-[1.05] font-semibold tracking-[-0.035em] sm:text-4xl md:text-5xl"
        >
          {section.title}
          <span className="text-accent">.</span>
        </h2>
      </Reveal>
      <div className="mt-10">{section.body}</div>
    </section>
  )
}

/** Numbered cards: challenges and the pieces I built. */
function Points({ items, prefix }: { items: { title: string; body: string }[]; prefix: string }) {
  return (
    <ol className="grid gap-px border border-line bg-line sm:grid-cols-2">
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} delay={(i % 2) * 0.08} className="bg-bg p-6 md:p-8">
          <span className="label-mono text-faint">
            {prefix}-{pad(i + 1)}
          </span>
          <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-[-0.02em]">
            {item.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}

const prose = 'max-w-3xl space-y-5 text-lg leading-relaxed text-muted'

function buildSections(project: Project): Section[] {
  const cs = caseStudies[project.slug]
  const shots = galleries[project.slug] ?? []
  const title = projectTitle(project)
  const sections: Section[] = []

  sections.push({
    id: 'overview',
    label: cs ? 'Overview' : 'My role',
    title: cs ? 'The project' : 'What I did',
    body: (
      <Reveal className={prose}>
        {/* Without a case study the header already shows the summary, so only the role is new. */}
        {cs?.context.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <div className={`border-l-2 border-accent pl-5 ${cs ? '!mt-10' : ''}`}>
          <p className="label-mono text-faint">My role</p>
          <p className="mt-2 text-ink">{project.role}</p>
        </div>
      </Reveal>
    ),
  })

  sections.push({
    id: 'challenge',
    label: cs ? 'The challenge' : 'The problem',
    title: cs ? 'What made it hard' : 'Why it was built',
    body: (
      <>
        <Reveal>
          <p className="max-w-3xl font-display text-2xl leading-snug tracking-[-0.02em] text-ink md:text-3xl">
            {project.problem}
          </p>
        </Reveal>
        {cs?.challenges && (
          <div className="mt-10">
            <Points items={cs.challenges} prefix="C" />
          </div>
        )}
      </>
    ),
  })

  if (project.figure || project.architecture) {
    sections.push({
      id: 'architecture',
      label: 'Architecture',
      title: 'How it fits together',
      body: (
        <>
          {project.figure && (
            <Reveal>
              <ArchitectureFigure figure={project.figure} />
            </Reveal>
          )}
          {project.architecture && (
            <Reveal className={`${prose} mt-10`}>
              <p>{project.architecture}</p>
            </Reveal>
          )}
        </>
      ),
    })
  }

  if (cs?.built) {
    sections.push({
      id: 'built',
      label: 'What I built',
      title: 'The main pieces',
      body: <Points items={cs.built} prefix="B" />,
    })
  }

  if (cs?.decisions) {
    sections.push({
      id: 'decisions',
      label: 'Key decisions',
      title: 'Decisions and trade-offs',
      body: (
        <ol>
          {cs.decisions.map((d, i) => (
            <Reveal
              as="li"
              key={d.title}
              className="grid gap-4 border-t border-line py-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8"
            >
              <span className="font-display text-4xl font-semibold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_var(--color-accent)]">
                D{pad(i + 1)}
              </span>
              <div>
                <h3 className="font-display text-xl leading-snug font-semibold tracking-[-0.02em] md:text-2xl">
                  {d.title}
                </h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="label-mono text-faint">Why</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted">{d.why}</dd>
                  </div>
                  {d.tradeoff && (
                    <div>
                      <dt className="label-mono text-faint">Trade-off</dt>
                      <dd className="mt-1.5 leading-relaxed text-muted">{d.tradeoff}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          ))}
        </ol>
      ),
    })
  }

  if (shots.length > 0) {
    sections.push({
      id: 'screens',
      label: 'Screens',
      title: 'From the product',
      body: <Gallery shots={shots} title={title} />,
    })
  }

  if (cs?.results || project.outcome) {
    sections.push({
      id: 'results',
      label: 'Results',
      title: 'Where it landed',
      body: (
        <>
          {cs?.results && (
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {cs.results.map((r, i) => (
                <Reveal as="li" key={r.label} delay={(i % 2) * 0.08} className="bg-bg p-6 md:p-8">
                  {r.value && (
                    <span className="block font-display text-5xl leading-none font-semibold tracking-[-0.045em] text-accent md:text-6xl">
                      {r.value}
                    </span>
                  )}
                  <span className="mt-4 block leading-relaxed text-muted">{r.label}</span>
                </Reveal>
              ))}
            </ul>
          )}
          {/* The one-line outcome stands in when there's no results grid. */}
          {!cs?.results && project.outcome && (
            <Reveal>
              <p className="max-w-3xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-ink">
                {project.outcome}
              </p>
            </Reveal>
          )}
        </>
      ),
    })
  }

  sections.push({
    id: 'stack',
    label: 'Stack',
    title: 'Built with',
    body: (
      <Reveal>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className="border border-line-strong px-3 py-1.5 font-mono text-sm">
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    ),
  })

  if (cs?.lessons) {
    sections.push({
      id: 'lessons',
      label: 'Lessons',
      title: 'What I’d take to the next one',
      body: (
        <ul className="max-w-3xl space-y-6">
          {cs.lessons.map((l) => (
            <Reveal as="li" key={l} className="flex gap-4 text-lg leading-relaxed text-ink">
              <ArrowRight className="mt-1.5 size-5 shrink-0 text-accent" aria-hidden />
              {l}
            </Reveal>
          ))}
        </ul>
      ),
    })
  }

  return sections
}

function Facts({ project }: { project: Project }) {
  const rows = [
    project.year && { label: 'Year', value: project.year },
    project.madeAt
      ? { label: 'Built at', value: project.madeAt }
      : project.own && { label: 'Type', value: 'Own project' },
    { label: 'Work', value: project.categories.join(' · ') },
    ...(caseStudies[project.slug]?.facts ?? []),
  ].filter((r): r is { label: string; value: string } => Boolean(r))

  return (
    <dl className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3 xl:grid-cols-6">
      {rows.map((r) => (
        <div key={r.label} className="border-r border-b border-line px-4 py-4">
          <dt className="label-mono text-[10px] text-faint">{r.label}</dt>
          <dd className="mt-1.5 text-sm leading-snug text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Toc({ sections }: { sections: Section[] }) {
  const active = useActiveSection(sections.map((s) => s.id))

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="label-mono text-faint">On this page</p>
      <ol className="mt-4 border-l border-line">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(s.id)
              }}
              className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:text-ink aria-[current]:border-accent aria-[current]:text-ink"
            >
              <span className="label-mono text-[10px] leading-5 text-faint">{pad(i + 1)}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Cta({ title }: { title: string }) {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden border border-line-strong bg-surface blueprint-grid px-6 py-12 sm:px-12 sm:py-16"
    >
      <p className="label-mono text-accent">Next step</p>
      <h2
        id="cta-title"
        className="mt-4 max-w-3xl font-display text-3xl leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl"
      >
        Building something like {title}?
      </h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
        Tell me what you’re working on. In 30 minutes we can go through the architecture, the risks
        and a realistic plan.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BookCallButton />
        <a
          href="/#contact"
          className="group inline-flex h-12 items-center gap-3 border border-line-strong px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <Mail className="size-4" aria-hidden />
          Send a message
        </a>
        <WhatsAppLink />
      </div>
    </section>
  )
}

function Neighbours({ project }: { project: Project }) {
  const i = projects.indexOf(project)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]
  const link = (p: Project, dir: 'prev' | 'next') => (
    <a
      href={projectHref(p)}
      rel={dir}
      className={`group flex flex-col gap-2 px-5 py-8 transition-colors hover:bg-surface sm:px-8 ${dir === 'next' ? 'items-end text-right' : ''}`}
    >
      <span className="flex items-center gap-2 label-mono text-faint">
        {dir === 'prev' && (
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
        )}
        {dir === 'prev' ? 'Previous' : 'Next'} · PRJ-{pad(projects.indexOf(p) + 1)}
        {dir === 'next' && (
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        )}
      </span>
      <span className="font-display text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent sm:text-3xl">
        {projectTitle(p)}
      </span>
    </a>
  )

  return (
    <nav
      aria-label="More projects"
      className="grid border border-line sm:grid-cols-2 [&>a+a]:border-t [&>a+a]:border-line sm:[&>a+a]:border-t-0 sm:[&>a+a]:border-l"
    >
      {link(prev, 'prev')}
      {link(next, 'next')}
    </nav>
  )
}

/** One project's full case study, at /work/<slug>/. */
export function ProjectPage({ project }: { project: Project }) {
  const index = projects.indexOf(project)
  const title = projectTitle(project)
  const cs = caseStudies[project.slug]
  const highlight = coverCategory(project, 'auto')
  const sections = buildSections(project)

  return (
    <article aria-labelledby="project-title" className="relative pt-28 pb-24 md:pt-36">
      <div className="container-site">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 label-mono text-faint">
            <li>
              <a href="/" className="transition-colors hover:text-ink">
                Home
              </a>
            </li>
            <li aria-hidden>/</li>
            <li>
              <a
                href="/work/"
                className="group inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <ArrowLeft
                  className="size-3.5 transition-transform group-hover:-translate-x-1"
                  aria-hidden
                />
                All work
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-muted">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 label-mono text-faint">
              <span className="text-accent">PRJ-{pad(index + 1)}</span>
              Case study
            </p>
            <h1
              id="project-title"
              className="mt-5 font-display text-[clamp(2.75rem,7vw,5rem)] leading-[0.92] font-semibold tracking-[var(--tracking-display)] break-words"
            >
              {title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
              {cs?.headline ?? project.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Categories">
              {chipsFor(project, highlight).map((c) => (
                <li
                  key={c}
                  className={`border px-2.5 py-1 label-mono ${c === highlight ? 'border-accent/60 text-accent' : 'border-line-strong text-muted'}`}
                >
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ProjectLinks project={project} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProjectCover project={project} index={index} highlight={highlight} priority />
          </div>
        </header>

        <div className="mt-14">
          <Facts project={project} />
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="h-full pt-14">
              <Toc sections={sections} />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-9">
            {sections.map((s, i) => (
              <CaseSection key={s.id} section={s} n={i + 1} />
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          <Cta title={title} />
          <Neighbours project={project} />
        </div>
      </div>
    </article>
  )
}
