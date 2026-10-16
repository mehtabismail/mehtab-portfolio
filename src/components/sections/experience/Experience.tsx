import { m, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { experience } from '../../../content/site'
import { Reveal } from '../../ui/Reveal'
import { SectionHeading } from '../../ui/SectionHeading'

const pad = (n: number) => String(n).padStart(2, '0')

/** Experience as a drawing revision log; the rail fills as you scroll. */
export function Experience() {
  const reduce = useReducedMotion()
  const list = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 65%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const total = experience.entries.length

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <SectionHeading
          index="02"
          label="Revision log"
          title={experience.heading}
          id="experience-title"
        />

        <div className="relative mt-16 md:mt-20">
          {/* Table header, desktop only */}
          <div
            aria-hidden
            className="hidden grid-cols-[180px_minmax(0,1fr)_minmax(0,1.1fr)] gap-10 border-b border-line pb-3 pl-14 label-mono text-faint md:grid"
          >
            <span>Rev · Date</span>
            <span>Role</span>
            <span>Notes</span>
          </div>

          <div className="relative">
            {/* Rail + scroll-progress fill */}
            <span
              aria-hidden
              className="absolute top-0 bottom-0 left-[5px] w-px bg-[var(--color-line-strong)]"
            />
            <m.span
              aria-hidden
              className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-accent shadow-[0_0_12px_var(--color-accent)]"
              style={{ scaleY: reduce ? 1 : fill }}
            />

            <ol ref={list}>
              {experience.entries.map((entry, i) => (
                <li
                  key={`${entry.year}-${entry.role}-${i}`}
                  className="relative border-b border-line py-10 pl-10 md:grid md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:py-12 md:pl-14"
                >
                  {/* Rail marker: lights up once the scroll line reaches it */}
                  <m.span
                    aria-hidden
                    className="absolute top-[3.1rem] left-0 size-[11px] rotate-45 border bg-bg md:top-[3.6rem]"
                    initial={{
                      borderColor: 'var(--color-line-strong)',
                      backgroundColor: 'var(--color-bg)',
                    }}
                    whileInView={{
                      borderColor: 'var(--color-accent)',
                      backgroundColor: 'var(--color-accent)',
                    }}
                    viewport={{ margin: '0px 0px -45% 0px' }}
                    transition={{ duration: 0.3 }}
                  />

                  <Reveal delay={0.05}>
                    <p className="label-mono text-faint">Rev {pad(total - i)}</p>
                    <p className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] whitespace-nowrap md:text-[2.75rem]">
                      {entry.year}
                    </p>
                  </Reveal>

                  <Reveal delay={0.12} className="mt-4 md:mt-0">
                    <h3 className="font-display text-2xl leading-tight font-medium tracking-[-0.02em] md:pt-6">
                      {entry.role}
                    </h3>
                    <p className="mt-2 font-mono text-[13px] text-accent">{entry.org}</p>
                  </Reveal>

                  <Reveal delay={0.19} className="mt-4 md:mt-0">
                    <p className="leading-relaxed text-muted md:pt-6">{entry.summary}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Education and certifications, as the drawing's title-block notes */}
        <Reveal className="mt-16 grid gap-10 md:mt-20 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:pl-14">
          <p className="label-mono text-faint">Credentials</p>
          <div>
            <h3 className="font-display text-2xl leading-tight font-medium tracking-[-0.02em]">
              {experience.education.degree}
            </h3>
            <p className="mt-2 font-mono text-[13px] text-accent">{experience.education.school}</p>
            <p className="mt-2 label-mono text-faint">
              {experience.education.years} · {experience.education.note}
            </p>
          </div>
          <ul className="space-y-3">
            {experience.certifications.map((c) => (
              <li
                key={c.name}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
              >
                <span className="text-ink">{c.name}</span>
                <span className="shrink-0 label-mono text-faint">
                  {c.issuer}
                  {'year' in c && c.year ? ` · ${c.year}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
