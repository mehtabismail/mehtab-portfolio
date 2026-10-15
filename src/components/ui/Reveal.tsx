import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'p'
}

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Fades content up once it enters the viewport. Triggers early (before the
 * element is fully visible) so jumping via anchors never shows blank areas.
 */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Tag>
  )
}
