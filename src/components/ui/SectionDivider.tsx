import { m, useReducedMotion } from 'motion/react'

interface Props {
  from: string
  to: string
}

const ease = [0.16, 1, 0.3, 1] as const

/** Blueprint connector between sections: two nodes joined by a dimension line. */
export function SectionDivider({ from, to }: Props) {
  const reduce = useReducedMotion()
  const line = (origin: 0 | 1) => ({
    initial: reduce ? false : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 1.4, ease },
    style: { originX: origin },
  })

  return (
    <div aria-hidden className="container-site">
      <div className="flex items-center gap-3 text-faint">
        <span className="label-mono text-[10px]">§{from}</span>
        <span className="h-2.5 w-px bg-current" />
        <m.span className="h-px flex-1 bg-[var(--color-line-strong)]" {...line(0)} />
        <span className="size-[7px] rotate-45 border border-accent/70" />
        <m.span className="h-px flex-1 bg-[var(--color-line-strong)]" {...line(1)} />
        <span className="h-2.5 w-px bg-current" />
        <span className="label-mono text-[10px]">§{to}</span>
      </div>
    </div>
  )
}
