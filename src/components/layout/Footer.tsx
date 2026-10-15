import { ArrowRight, ArrowUp } from 'lucide-react'
import { site } from '../../content/site'
import { scrollToTop } from '../../lib/scroll'

/** Site footer styled as a drawing title block. Shared by every page. */
export function Footer({ showContactCta }: { showContactCta: boolean }) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="relative border-t border-line">
      <div className="container-site">
        {showContactCta && (
          <a
            href="/#contact"
            className="group flex items-center justify-between gap-6 border-b border-line py-10"
          >
            <span className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Have a project? <span className="text-accent">Let’s talk.</span>
            </span>
            <ArrowRight
              className="size-8 shrink-0 text-accent transition-transform group-hover:translate-x-2"
              aria-hidden
            />
          </a>
        )}

        <div className="grid border-x border-line text-sm sm:grid-cols-[1.4fr_1fr_auto]">
          <p className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0">
            <span className="block label-mono text-faint">Drawn by</span>
            <span className="mt-1 block text-ink">
              Designed &amp; developed by {site.name} © {year}
            </span>
          </p>
          <p className="border-b border-line px-5 py-5 sm:border-r sm:border-b-0">
            <span className="block label-mono text-faint">Location</span>
            <span className="mt-1 block text-ink">{site.location}</span>
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-surface"
          >
            <span>
              <span className="block label-mono text-faint">Return</span>
              <span className="mt-1 block text-ink group-hover:text-accent">Back to top</span>
            </span>
            <span className="grid size-9 place-items-center border border-line-strong transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              <ArrowUp className="size-4" aria-hidden />
            </span>
          </button>
        </div>
        <div className="h-6 sm:h-8" />
      </div>
    </footer>
  )
}
