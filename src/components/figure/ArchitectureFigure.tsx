import { X } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import type { SystemFigure } from '../../content/figureTypes'
import { pad } from '../../lib/project'
import { SystemFigureView } from './SystemFigureView'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * CSS-only scroll hint: a faint shade at the top or bottom edge only while
 * there is more note to scroll to. The surface-coloured covers scroll with the
 * text and hide each shade once its end is reached.
 */
const SCROLL_HINT = [
  'linear-gradient(var(--color-surface) 30%, transparent) top / 100% 40px no-repeat local',
  'linear-gradient(transparent, var(--color-surface) 70%) bottom / 100% 40px no-repeat local',
  'radial-gradient(farthest-side at 50% 0, rgb(148 163 184 / 0.2), transparent) top / 100% 14px no-repeat scroll',
  'radial-gradient(farthest-side at 50% 100%, rgb(148 163 184 / 0.2), transparent) bottom / 100% 14px no-repeat scroll',
  'var(--color-surface)',
].join(', ')

/** The corner tick drawn on nodes that have a note, for use in running text. */
function NoteMark() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className="inline-block size-2.5 align-baseline">
      <path d="M1 1.5 H8.5 V9" fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
    </svg>
  )
}

/**
 * The large figure in a case study's Architecture section. When the figure's
 * nodes carry notes, they become buttons and a panel beside the drawing (under
 * it on phones) says what the tapped node does and why it's there. Without
 * notes it renders the plain figure.
 */
export function ArchitectureFigure({ figure }: { figure: SystemFigure }) {
  const [selected, setSelected] = useState<string | null>(null)
  const panelId = `note-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const wrapRef = useRef<HTMLDivElement>(null)
  const hasNotes = figure.nodes.some((n) => n.note)

  const focusNode = (id: string) =>
    wrapRef.current
      ?.querySelector<SVGGElement>(`[data-node="${id}"]`)
      ?.focus({ preventScroll: true })

  // Esc closes the note; focus goes back to its node if it was inside the figure.
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const inside = wrapRef.current?.contains(document.activeElement)
      setSelected(null)
      if (inside) focusNode(selected)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selected])

  const drawing = (
    <div className="relative blueprint-grid px-4 py-8 sm:px-10 sm:py-12">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 45%, var(--color-accent-dim), transparent 70%)',
        }}
      />
      <SystemFigureView
        figure={figure}
        interactive
        explore={
          hasNotes
            ? {
                selected,
                onToggle: (id) => setSelected((cur) => (cur === id ? null : id)),
                panelId,
              }
            : undefined
        }
        className="relative mx-auto h-auto w-full max-w-[720px]"
      />
    </div>
  )

  const index = figure.nodes.findIndex((n) => n.id === selected)
  const node = index >= 0 ? figure.nodes[index] : undefined
  const links = node
    ? figure.edges
        .filter((e) => e.from === node.id || e.to === node.id)
        .map((e) => figure.nodes.find((n) => n.id === (e.from === node.id ? e.to : e.from))!.label)
    : []

  return (
    <figure className="border border-line bg-surface">
      {hasNotes ? (
        <div ref={wrapRef} className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {drawing}
          <div
            id={panelId}
            aria-live="polite"
            className="border-t border-line lg:relative lg:border-t-0 lg:border-l"
          >
            {/* On wide screens the drawing sets the height and a long note scrolls, so
                picking a node never resizes the figure. */}
            <div
              data-lenis-prevent
              className="p-5 text-[15px] sm:p-6 lg:absolute lg:inset-0 lg:overflow-y-auto lg:p-7"
              style={{ background: SCROLL_HINT }}
            >
              {node?.note ? (
                <m.div
                  key={node.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="label-mono text-faint">
                      <span className="text-accent">Node {pad(index + 1)}</span> /{' '}
                      {pad(figure.nodes.length)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(null)
                        focusNode(node.id)
                      }}
                      className="-m-2 p-2 text-faint transition-colors hover:text-accent"
                    >
                      <X className="size-4" aria-hidden />
                      <span className="sr-only">Close note on {node.label}</span>
                    </button>
                  </div>
                  <h3 className="mt-4 font-mono text-lg font-medium text-ink">{node.label}</h3>
                  {node.sub && <p className="mt-1 label-mono text-faint">{node.sub}</p>}
                  <dl className="mt-6 space-y-5">
                    <div>
                      <dt className="label-mono text-faint">What it does</dt>
                      <dd className="mt-1.5 leading-relaxed text-muted">{node.note.what}</dd>
                    </div>
                    {node.note.why && (
                      <div className="border-l-2 border-accent pl-4">
                        <dt className="label-mono text-faint">Why it’s here</dt>
                        <dd className="mt-1.5 leading-relaxed text-ink">{node.note.why}</dd>
                      </div>
                    )}
                    {links.length > 0 && (
                      <div>
                        <dt className="label-mono text-faint">Connects to</dt>
                        <dd className="mt-1.5 font-mono text-sm text-muted">{links.join(' · ')}</dd>
                      </div>
                    )}
                  </dl>
                </m.div>
              ) : (
                <div className="flex h-full flex-col justify-center">
                  <p className="label-mono text-faint">
                    <span className="text-accent">Detail</span> — node notes
                  </p>
                  <p className="mt-3 leading-relaxed text-muted">
                    Select a node marked <NoteMark /> to see what it does in this project and why
                    it’s there.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        drawing
      )}
      <figcaption className="grid grid-cols-[1fr_auto] border-t border-line label-mono text-[10px] text-faint">
        <span className="truncate px-4 py-2.5 text-muted">Fig. A — {figure.title}</span>
        <span className="border-l border-line px-4 py-2.5 text-accent">
          {figure.nodes.length} nodes
        </span>
      </figcaption>
    </figure>
  )
}
