import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { CodeXml, Network, Plus, Smartphone, type LucideIcon } from 'lucide-react'
import { useId, useState, type PointerEvent } from 'react'
import type { Service, ServiceIcon } from '../../../content/site'

const ICONS: Record<ServiceIcon, LucideIcon> = {
  code: CodeXml,
  architecture: Network,
  mobile: Smartphone,
}

interface Props {
  service: Service
  index: number
  total: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Service card styled like a drawing sheet: dimension line on top, title block below. */
export function SpecCard({ service, index, total }: Props) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = useId()
  const Icon = ICONS[service.icon]

  const track = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <article
      onPointerMove={track}
      className="group relative flex h-full flex-col border border-line bg-surface/70 backdrop-blur-sm transition-colors duration-500 hover:bg-[var(--color-surface-2)]"
    >
      <span
        aria-hidden
        className="spotlight-border opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Dimension line along the top edge */}
      <div
        aria-hidden
        className="flex items-center gap-2 px-6 pt-5 text-faint transition-colors duration-500 group-hover:text-accent sm:px-8"
      >
        <span className="h-2.5 w-px bg-current" />
        <span className="h-px flex-1 origin-right scale-x-75 bg-current opacity-50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
        <span className="label-mono text-[10px]">{pad(index + 1)}</span>
        <span className="h-px flex-1 origin-left scale-x-75 bg-current opacity-50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
        <span className="h-2.5 w-px bg-current" />
      </div>

      <div className="flex flex-1 flex-col px-6 pt-8 pb-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-12 place-items-center border border-line-strong text-accent transition-colors duration-500 group-hover:border-accent">
            <Icon className="size-5" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="label-mono text-faint">{service.code}</span>
        </div>

        <h3 className="mt-8 font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-3xl">
          {service.title}
        </h3>
        <p className="mt-2 font-mono text-[13px] text-accent">{service.tagline}</p>
        <p className="mt-5 leading-relaxed text-muted">{service.description}</p>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="group/btn flex w-full items-center justify-between border-t border-line pt-4 text-left text-ink transition-colors hover:text-accent"
          >
            <span className="label-mono">
              Skillset & tools <span className="text-faint">({pad(service.tools.length)})</span>
            </span>
            <span className="grid size-8 place-items-center border border-line-strong transition-colors group-hover/btn:border-accent">
              <Plus
                className={`size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? 'rotate-45' : ''}`}
                aria-hidden
              />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <m.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <ul className="flex flex-wrap gap-2 pt-5">
                  {service.tools.map((tool, i) => (
                    <m.li
                      key={tool}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 + i * 0.03 }}
                      className="border border-line-strong px-2.5 py-1 font-mono text-xs text-ink"
                    >
                      {tool}
                    </m.li>
                  ))}
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Drawing title block */}
      <dl className="grid grid-cols-[1.35fr_1fr_0.9fr] border-t border-line label-mono text-[10px] whitespace-nowrap text-faint">
        <div className="border-r border-line px-4 py-3">
          <dt className="sr-only">Sheet</dt>
          <dd>
            Sheet {pad(index + 1)}/{pad(total)}
          </dd>
        </div>
        <div className="border-r border-line px-4 py-3">
          <dt className="sr-only">Scale</dt>
          <dd>Scale 1:1</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="sr-only">Revision</dt>
          <dd>Rev. A</dd>
        </div>
      </dl>
    </article>
  )
}
