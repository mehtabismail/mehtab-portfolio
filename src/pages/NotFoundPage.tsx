import { ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from '../content/site'
import { SectionHeading } from '../components/ui/SectionHeading'

/** Served by Vercel for any URL that doesn't exist (dist/404.html). */
export function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex min-h-[80svh] items-center pt-32 pb-24 md:pt-40"
    >
      <div className="container-site">
        <SectionHeading
          as="h1"
          index="404"
          label="Sheet missing"
          title={notFound.heading}
          id="not-found-title"
        >
          {notFound.body}
        </SectionHeading>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="/"
            className="group inline-flex h-12 items-center gap-3 bg-accent px-6 text-sm font-medium text-accent-ink transition-shadow duration-300 hover:shadow-[0_0_0_4px_var(--color-accent-dim),0_12px_40px_-8px_var(--color-accent)]"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            />
            Back home
          </a>
          <a
            href="/work/"
            className="group inline-flex h-12 items-center gap-3 border border-line-strong px-6 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink"
          >
            See all work
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </section>
  )
}
