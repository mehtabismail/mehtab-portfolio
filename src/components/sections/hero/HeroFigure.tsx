import { AnimatePresence, m } from 'motion/react'
import { RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { SystemFigure } from '../../../content/figureTypes'
import { systemFigures } from '../../../content/figures'
import { projects } from '../../../content/site'
import { pad, projectTitle } from '../../../lib/project'
import { SystemFigureView } from '../../figure/SystemFigureView'

interface Entry {
  caption: string
  figure: SystemFigure
}

const STORAGE_KEY = 'hero-figure'

function readLast(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveLast(caption: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, caption)
  } catch {
    // storage blocked (private mode etc.) — rotation still works
  }
}

/**
 * Hero diagram: a random system figure per visit (never the one shown last
 * time), with a button to cycle through the rest.
 */
export function HeroFigure() {
  const pool = useMemo<Entry[]>(
    () => [
      ...projects
        .filter((p) => p.showName)
        .flatMap((p) =>
          p.figure ? [{ caption: `${projectTitle(p)} · ${p.figure.title}`, figure: p.figure }] : [],
        ),
      ...systemFigures.map((f) => ({ caption: f.title, figure: f })),
    ],
    [],
  )
  // Picked after hydration so the prerendered HTML and first client render match.
  const [index, setIndex] = useState<number | null>(null)

  useEffect(() => {
    const last = readLast()
    const choices = pool.map((_, i) => i).filter((i) => pool[i].caption !== last)
    const pick = choices[Math.floor(Math.random() * choices.length)] ?? 0
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random pick must happen client-side
    setIndex(pick)
    saveLast(pool[pick].caption)
  }, [pool])

  const next = () => {
    const i = ((index ?? 0) + 1) % pool.length
    setIndex(i)
    saveLast(pool[i].caption)
  }

  const entry = index === null ? null : pool[index]

  return (
    <figure className="relative mx-auto w-full max-w-[660px]">
      <div className="relative aspect-[604/558]">
        <AnimatePresence mode="wait">
          {entry && (
            <m.div
              key={entry.caption}
              className="absolute inset-0 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <SystemFigureView
                figure={entry.figure}
                interactive
                enter="mount"
                className="h-auto max-h-full w-full"
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 label-mono text-faint">
        <span className="min-w-0 truncate" aria-live="polite">
          {entry ? `fig. ${pad(index! + 1)} — ${entry.caption}` : 'fig. 01'}
        </span>
        <button
          type="button"
          onClick={next}
          className="group inline-flex shrink-0 items-center gap-2 transition-colors hover:text-accent"
        >
          <RefreshCw
            className="size-3.5 transition-transform duration-500 group-hover:rotate-180"
            aria-hidden
          />
          Next system
          <span className="sr-only">diagram</span>
        </button>
      </figcaption>
    </figure>
  )
}
