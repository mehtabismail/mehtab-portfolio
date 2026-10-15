import { AnimatePresence, m } from 'motion/react'
import { ArrowDown, Copy } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { nav, site, socials } from '../../content/site'
import { useCopyEmail } from '../../hooks/useCopyEmail'
import { BrandIcon } from '../ui/BrandIcon'

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (target: string) => void
}

const ease = [0.16, 1, 0.3, 1] as const

export function MobileMenu({ open, onClose, onNavigate }: Props) {
  const firstLink = useRef<HTMLAnchorElement>(null)
  const copyEmail = useCopyEmail()

  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 top-16 z-40 overflow-y-auto bg-bg/95 backdrop-blur-xl lg:hidden"
          data-lenis-prevent
        >
          <div className="absolute inset-0 blueprint-grid opacity-60" aria-hidden />
          <div className="relative flex min-h-full flex-col px-4 pt-10 pb-8 sm:px-6">
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <m.li
                    key={item.target}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.06 }}
                  >
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={`/#${item.target}`}
                      onClick={(e) => {
                        e.preventDefault()
                        onNavigate(item.target)
                      }}
                      className="group flex items-baseline gap-4 border-b border-line py-4"
                    >
                      <span className="font-mono text-xs text-accent">0{i + 1}</span>
                      <span className="font-display text-5xl font-semibold tracking-[var(--tracking-display)] text-ink transition-colors group-hover:text-accent">
                        {item.label}
                      </span>
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-auto space-y-6 pt-12"
            >
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center gap-2 font-mono text-sm text-muted hover:text-ink"
              >
                {site.email}
                <Copy className="size-4 text-accent" aria-hidden />
                <span className="sr-only">Copy email address</span>
              </button>

              <div className="flex items-center justify-between gap-4">
                <ul className="flex items-center gap-2">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="grid size-11 place-items-center border border-line-strong text-muted transition-colors hover:border-accent hover:text-ink"
                      >
                        <BrandIcon name={s.key} />
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={site.resumeHref}
                  download
                  className="flex h-11 items-center gap-2 border border-accent px-4 label-mono text-accent transition-colors hover:bg-accent hover:text-accent-ink"
                >
                  Resume <ArrowDown className="size-4" aria-hidden />
                </a>
              </div>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
