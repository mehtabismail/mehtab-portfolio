import { ArrowDown } from 'lucide-react'
import { site, socials } from '../../content/site'
import { BrandIcon } from '../ui/BrandIcon'

/** Desktop-only fixed chrome: social rail (left) and resume link (bottom-right). */
export function SideRails() {
  return (
    <>
      <aside
        aria-label="Social links"
        className="fixed bottom-0 left-6 z-30 hidden flex-col items-center gap-5 lg:flex"
      >
        <ul className="flex flex-col items-center gap-4">
          {socials.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="block p-1 text-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-accent"
              >
                <BrandIcon name={s.key} />
              </a>
            </li>
          ))}
        </ul>
        {/* Leader line to the page edge, like a drawing callout */}
        <span aria-hidden className="relative h-24 w-px bg-[var(--color-line-strong)]">
          <span className="absolute -top-px left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-muted" />
        </span>
      </aside>

      {/* Mirrors the social rail: vertical label running down into a leader line */}
      <a
        href={site.resumeHref}
        download
        aria-label="Download resume (PDF)"
        className="group fixed right-6 bottom-0 z-30 hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="flex items-center gap-2 py-1 label-mono text-muted transition-colors [writing-mode:vertical-rl] group-hover:text-ink">
          Resume
          <ArrowDown
            className="size-4 text-accent transition-transform group-hover:translate-y-1"
            aria-hidden
          />
        </span>
        <span aria-hidden className="relative h-24 w-px bg-[var(--color-line-strong)]">
          <span className="absolute inset-x-0 top-0 h-0 bg-accent transition-[height] duration-500 group-hover:h-full" />
        </span>
      </a>
    </>
  )
}
