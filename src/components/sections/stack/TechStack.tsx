import { m, useReducedMotion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { techStack } from '../../../content/site'
import { SectionHeading } from '../../ui/SectionHeading'
import { TechChip } from './TechChip'

// matter.js is only downloaded when the physics pit is actually used.
const PhysicsPit = lazy(() => import('./PhysicsPit'))

const PLAYABLE = '(pointer: fine) and (min-width: 768px)'

function StaticGrid() {
  const reduce = useReducedMotion()
  return (
    <ul className="flex flex-wrap gap-3">
      {techStack.items.map((tech, i) => (
        <m.li
          key={tech.name}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
        >
          <TechChip tech={tech} />
        </m.li>
      ))}
    </ul>
  )
}

export function TechStack() {
  const reduce = useReducedMotion() ?? false
  const holder = useRef<HTMLDivElement>(null)
  const [playable, setPlayable] = useState(false)
  const [near, setNear] = useState(false)

  // Physics only for mouse users on wider screens who allow motion.
  useEffect(() => {
    const mq = window.matchMedia(PLAYABLE)
    const update = () => setPlayable(mq.matches && !reduce)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  // Start downloading matter.js shortly before the section scrolls into view.
  useEffect(() => {
    const el = holder.current
    if (!el || !playable) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: '600px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [playable])

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <SectionHeading index="05" label="Toolbox" title={techStack.heading} id="stack-title" />

        {/* Screen-reader list; the visual pit is decorative */}
        <ul className="sr-only">
          {techStack.items.map((t) => (
            <li key={t.name}>{t.name}</li>
          ))}
        </ul>

        <div ref={holder} className="mt-14 md:mt-20" aria-hidden>
          {playable ? (
            near ? (
              <Suspense fallback={<div className="h-[480px] border border-line-strong" />}>
                <PhysicsPit items={techStack.items} hint={techStack.hint} />
              </Suspense>
            ) : (
              <div className="h-[480px] border border-line-strong" />
            )
          ) : (
            <StaticGrid />
          )}
        </div>
      </div>
    </section>
  )
}
