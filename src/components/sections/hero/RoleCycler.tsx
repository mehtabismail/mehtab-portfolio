import { useEffect, useState } from 'react'

interface Props {
  roles: string[]
  reduce: boolean
}

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 1900

/** Terminal-style typewriter that cycles through roles. */
export function RoleCycler({ roles, reduce }: Props) {
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) return
    const word = roles[index]
    let delay = deleting ? DELETE_MS : TYPE_MS
    if (!deleting && length === word.length) delay = HOLD_MS

    const id = window.setTimeout(() => {
      if (!deleting && length === word.length) setDeleting(true)
      else if (deleting && length === 0) {
        setDeleting(false)
        setIndex((i) => (i + 1) % roles.length)
      } else setLength((l) => l + (deleting ? -1 : 1))
    }, delay)
    return () => window.clearTimeout(id)
  }, [roles, index, length, deleting, reduce])

  return (
    <p className="font-mono text-base sm:text-lg">
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-faint">role:</span>
        {reduce ? (
          <span className="flex flex-wrap gap-x-2 text-accent">
            {roles.map((r, i) => (
              <span key={r} className="whitespace-nowrap">
                {r}
                {i < roles.length - 1 && <span className="text-faint"> ·</span>}
              </span>
            ))}
          </span>
        ) : (
          <span className="inline-flex items-baseline text-accent">
            {roles[index].slice(0, length)}
            <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] animate-caret bg-accent" />
          </span>
        )}
      </span>
    </p>
  )
}
