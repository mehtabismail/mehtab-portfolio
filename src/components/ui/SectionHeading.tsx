import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  /** two-digit section number, e.g. "01" */
  index: string
  /** short mono label next to the number */
  label: string
  title: string
  id: string
  /** heading level; 'h1' when it's the page's own title (e.g. /work) */
  as?: 'h1' | 'h2'
  children?: ReactNode
}

const ease = [0.16, 1, 0.3, 1] as const

/** Section title with a blueprint dimension line running out from the section number. */
export function SectionHeading({ index, label, title, id, as: Heading = 'h2', children }: Props) {
  const reduce = useReducedMotion()

  return (
    <header className="max-w-4xl">
      <m.div
        aria-hidden
        className="flex items-center gap-3 label-mono text-faint"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-accent">§{index}</span>
        <span>{label}</span>
        <m.span
          className="relative h-px flex-1 bg-[var(--color-line-strong)]"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease, delay: 0.15 }}
          style={{ originX: 0 }}
        >
          <span className="absolute -top-1 right-0 h-[9px] w-px bg-[var(--color-line-strong)]" />
        </m.span>
      </m.div>

      <Heading
        id={id}
        className="mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] font-semibold tracking-[var(--tracking-display)]"
      >
        <span className="block overflow-hidden pb-[0.08em]">
          <m.span
            className="block"
            initial={reduce ? false : { y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            {title}
            <span className="text-accent">.</span>
          </m.span>
        </span>
      </Heading>

      {children && (
        <m.div
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          {children}
        </m.div>
      )}
    </header>
  )
}
