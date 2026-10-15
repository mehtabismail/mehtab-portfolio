import { m, useReducedMotion } from 'motion/react'
import { hero, site } from '../../../content/site'
import { SectionButton } from '../../ui/Button'
import { RoleCycler } from './RoleCycler'
import { HeroFigure } from './HeroFigure'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reduce = useReducedMotion() ?? false
  const [first, ...rest] = site.name.split(' ')

  const rise = (delay: number, fade = true) => ({
    initial: reduce ? false : { opacity: fade ? 0 : 1, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center pt-16"
    >
      <div className="container-site grid items-center gap-14 py-14 xl:grid-cols-12 xl:gap-8 xl:py-20">
        <div className="xl:col-span-6">
          <h1 id="hero-title" className="font-display">
            <m.span
              {...rise(0.1)}
              className="block text-2xl font-normal tracking-tight text-muted sm:text-3xl"
            >
              {hero.greeting}
            </m.span>
            <span className="mt-2 block text-[clamp(3.75rem,15vw,9.5rem)] leading-[0.86] font-semibold tracking-[var(--tracking-display)] xl:text-[clamp(5rem,9.5vw,9.5rem)]">
              <span className="sr-only">{site.name}</span>
              {[first, rest.join(' ')].map((word, line) => (
                // Letters rise one by one out of a mask, line two trailing line one.
                <span key={word} aria-hidden className="block overflow-hidden pb-[0.06em]">
                  {[...word, ...(line === 1 ? ['.'] : [])].map((char, i) => (
                    <m.span
                      key={`${char}-${i}`}
                      className={`inline-block ${char === '.' ? 'text-accent' : ''}`}
                      initial={reduce ? false : { y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, ease, delay: 0.2 + line * 0.18 + i * 0.035 }}
                    >
                      {char}
                    </m.span>
                  ))}
                </span>
              ))}
            </span>
          </h1>

          {/* Dimension marker under the name */}
          <m.div
            aria-hidden
            className="mt-6 flex max-w-xl items-center gap-3 text-faint"
            initial={reduce ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
            style={{ originX: 0 }}
          >
            <span className="h-3 w-px bg-current" />
            <span className="h-px flex-1 bg-current opacity-60" />
            <span className="shrink-0 label-mono text-[10px]">
              idea → architecture → production
            </span>
            <span className="h-px flex-1 bg-current opacity-60" />
            <span className="h-3 w-px bg-current" />
          </m.div>

          <m.div {...rise(0.4)} className="mt-6">
            <RoleCycler roles={hero.roles} reduce={reduce} />
          </m.div>

          {/* Usually the LCP element on mobile: visible from the first frame, it only slides. */}
          <m.p
            {...rise(0.45, false)}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {hero.statement}
          </m.p>

          <m.div {...rise(0.5)} className="mt-10 flex flex-wrap gap-3">
            <SectionButton target={hero.primaryCta.target}>{hero.primaryCta.label}</SectionButton>
            <SectionButton target={hero.secondaryCta.target} variant="ghost">
              {hero.secondaryCta.label}
            </SectionButton>
          </m.div>
        </div>

        <div className="xl:col-span-6 xl:-mr-8">
          <HeroFigure />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 label-mono text-faint xl:tall:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-[var(--color-line)]">
          <span className="absolute inset-0 animate-scroll-cue bg-accent" />
        </span>
      </div>
    </section>
  )
}
