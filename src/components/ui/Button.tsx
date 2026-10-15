import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { scrollToId } from '../../lib/scroll'

interface Props {
  /** Section id to scroll to */
  target: string
  variant?: 'primary' | 'ghost'
  children: ReactNode
}

const styles = {
  primary:
    'bg-accent text-accent-ink hover:shadow-[0_0_0_4px_var(--color-accent-dim),0_12px_40px_-8px_var(--color-accent)]',
  ghost: 'border border-line-strong text-ink hover:border-ink',
}

export function SectionButton({ target, variant = 'primary', children }: Props) {
  return (
    <a
      href={`/#${target}`}
      onClick={(e) => {
        e.preventDefault()
        scrollToId(target)
      }}
      className={`group inline-flex h-12 items-center gap-3 px-6 text-sm font-medium transition-[box-shadow,border-color,background-color] duration-300 ${styles[variant]}`}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden
      />
    </a>
  )
}
