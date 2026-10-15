import { m, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import type { Project } from '../../content/site'

const W = 240
const H = 140
const NODE_H = 20

/** box width fitted to the label so neighbouring nodes don't collide */
const nodeWidth = (label: string) => Math.max(34, label.length * 5.2 + 14)

const toX = (x: number) => 30 + (x / 100) * (W - 60)
const toY = (y: number) => 22 + (y / 100) * (H - 44)

interface Props {
  arch: Project['arch']
  className?: string
  /** draw edges in when scrolled into view */
  animate?: boolean
}

/** Small blueprint-style architecture diagram with orthogonal connectors. */
export function ArchThumb({ arch, className, animate = true }: Props) {
  const reduce = useReducedMotion()
  const byId = new Map(arch.nodes.map((n) => [n.id, n]))
  const draw = animate && !reduce
  // Observe the whole diagram: straight connectors have zero-height boxes
  // that an IntersectionObserver may never report as visible.
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      {arch.edges.map(([a, b], i) => {
        const from = byId.get(a)
        const to = byId.get(b)
        if (!from || !to) return null
        const x1 = toX(from.x)
        const y1 = toY(from.y)
        const x2 = toX(to.x)
        const y2 = toY(to.y)
        const mid = (x1 + x2) / 2
        const d =
          Math.abs(y1 - y2) < 1 ? `M${x1},${y1} H${x2}` : `M${x1},${y1} H${mid} V${y2} H${x2}`
        return (
          <m.path
            key={`${a}-${b}`}
            d={d}
            fill="none"
            stroke="rgb(148 163 184 / 0.45)"
            strokeWidth={1}
            initial={draw ? { pathLength: 0 } : false}
            animate={!draw || inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}
      {arch.nodes.map((n) => {
        const cx = toX(n.x)
        const cy = toY(n.y)
        const w = nodeWidth(n.label)
        return (
          <g key={n.id}>
            <rect
              x={cx - w / 2}
              y={cy - NODE_H / 2}
              width={w}
              height={NODE_H}
              rx={3}
              fill="var(--color-surface)"
              stroke={n.core ? 'var(--color-accent)' : 'rgb(148 163 184 / 0.4)'}
            />
            <text
              x={cx}
              y={cy + 3}
              textAnchor="middle"
              fill={n.core ? 'var(--color-accent)' : 'var(--color-muted)'}
              fontFamily="var(--font-mono)"
              fontSize={8}
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
