import { DraftingCompass, Rocket, Search, type LucideIcon } from 'lucide-react'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef, useState, type UIEvent } from 'react'
import { processFlow, type ProcessIcon, type ProcessStep } from '../../../content/site'
import { pad } from '../../../lib/project'
import { Reveal } from '../../ui/Reveal'
import { SectionHeading } from '../../ui/SectionHeading'

const ICONS: Record<ProcessIcon, LucideIcon> = {
  discover: Search,
  architect: DraftingCompass,
  ship: Rocket,
}

function StepBody({ step, index, active }: { step: ProcessStep; index: number; active: boolean }) {
  const Icon = ICONS[step.icon]
  return (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-sm transition-colors duration-500 ${active ? 'text-accent' : 'text-faint'}`}
        >
          {pad(index + 1)}
        </span>
        <Icon
          className={`size-5 transition-colors duration-500 ${active ? 'text-accent' : 'text-faint'}`}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <h3 className="mt-6 font-display text-2xl leading-tight font-semibold tracking-[-0.03em]">
        {step.title}
      </h3>
      <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
      <ul className="mt-6 space-y-2 border-t border-line pt-5" aria-label="Deliverables">
        {step.deliverables.map((d) => (
          <li key={d} className="flex gap-2 font-mono text-xs text-ink/80">
            <span className="text-accent" aria-hidden>
              →
            </span>
            {d}
          </li>
        ))}
      </ul>
    </>
  )
}

/** Desktop: four steps on one connector line that fills as you scroll. */
function StepFlow() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const steps = processFlow.steps
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const [reached, setReached] = useState(reduce ? steps.length : 0)

  useMotionValueEvent(fill, 'change', (v) => {
    if (reduce) return
    // Each node sits at the start of its column (i / steps.length of the way along).
    const next = steps.filter((_, i) => v >= i / steps.length + 0.01).length
    setReached(next)
  })

  return (
    <div ref={track} className="relative mt-20 hidden lg:block">
      <span
        aria-hidden
        className="absolute top-[5px] right-0 left-0 h-px bg-[var(--color-line-strong)]"
      />
      <m.span
        aria-hidden
        className="absolute top-[5px] right-0 left-0 h-px origin-left bg-accent shadow-[0_0_12px_var(--color-accent)]"
        style={{ scaleX: reduce ? 1 : fill }}
      />
      <ol className="grid grid-cols-3 gap-6">
        {steps.map((step, i) => {
          const active = i < reached
          return (
            <li key={step.title} className="relative flex flex-col pt-10">
              <span
                aria-hidden
                className={`absolute top-0 left-0 size-[11px] rotate-45 border transition-colors duration-300 ${
                  active ? 'border-accent bg-accent' : 'border-line-strong bg-bg'
                }`}
              />
              <Reveal delay={i * 0.08} className="flex-1">
                <div
                  className={`h-full border p-6 transition-[border-color,background-color] duration-500 ${
                    active ? 'border-line-strong bg-surface/80' : 'border-line bg-surface/40'
                  }`}
                >
                  <StepBody step={step} index={i} active={active} />
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Mobile/tablet: horizontal scroll-snap carousel with position dots. */
function StepCarousel() {
  const steps = processFlow.steps
  const [current, setCurrent] = useState(0)

  const onScroll = (e: UIEvent<HTMLOListElement>) => {
    const el = e.currentTarget
    const card = el.firstElementChild as HTMLElement | null
    if (!card) return
    const stride = card.offsetWidth + 16
    setCurrent(Math.min(steps.length - 1, Math.round(el.scrollLeft / stride)))
  }

  return (
    <div className="mt-14 lg:hidden">
      <ol
        onScroll={onScroll}
        aria-label="Process steps"
        // Focusable so keyboard users can scroll it with the arrow keys.
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="w-[82%] max-w-[360px] shrink-0 snap-start border border-line-strong bg-surface/70 p-6"
          >
            <StepBody step={step} index={i} active={i === current} />
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2" aria-hidden>
          {steps.map((s, i) => (
            <span
              key={s.title}
              className={`h-1 transition-all duration-500 ${i === current ? 'w-8 bg-accent' : 'w-4 bg-[var(--color-line-strong)]'}`}
            />
          ))}
        </div>
        <span className="label-mono text-faint" aria-hidden>
          Swipe →
        </span>
      </div>
    </div>
  )
}

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <SectionHeading index="04" label="Process" title={processFlow.heading} id="process-title">
          {processFlow.intro}
        </SectionHeading>
        <StepFlow />
        <StepCarousel />
      </div>
    </section>
  )
}
