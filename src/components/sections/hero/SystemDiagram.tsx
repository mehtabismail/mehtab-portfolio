import { Cpu, Database, Layers, MonitorSmartphone, Server, type LucideIcon } from 'lucide-react'
import { animate, m, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useEffect } from 'react'
import { usePointer } from '../../../hooks/usePointer'

type NodeId = 'client' | 'api' | 'db' | 'queue' | 'worker'

interface DiagramNode {
  x: number
  y: number
  label: string
  sub: string
  icon: LucideIcon
  /** how strongly the node follows the cursor */
  depth: number
  accent?: boolean
}

const NODES: Record<NodeId, DiagramNode> = {
  client: {
    x: 220,
    y: 70,
    label: 'Client',
    sub: 'web · mobile',
    icon: MonitorSmartphone,
    depth: 1,
  },
  api: {
    x: 220,
    y: 210,
    label: 'API',
    sub: 'node · rest',
    icon: Server,
    depth: 0.55,
    accent: true,
  },
  db: { x: 96, y: 360, label: 'Database', sub: 'postgres', icon: Database, depth: 0.8 },
  queue: { x: 344, y: 360, label: 'Queue', sub: 'jobs · events', icon: Layers, depth: 0.9 },
  worker: { x: 344, y: 480, label: 'Worker', sub: 'async', icon: Cpu, depth: 0.45 },
}

const W = 124
const H = 48
const FOLLOW = 22 // px of cursor travel at depth 1

interface Edge {
  from: NodeId
  to: NodeId
  kind: 'down' | 'side'
}

const EDGES: Edge[] = [
  { from: 'client', to: 'api', kind: 'down' },
  { from: 'api', to: 'db', kind: 'down' },
  { from: 'api', to: 'queue', kind: 'down' },
  { from: 'queue', to: 'worker', kind: 'down' },
  { from: 'worker', to: 'db', kind: 'side' },
]

type Pt = [number, number]
type Curve = [Pt, Pt, Pt, Pt]

function pos(id: NodeId, px: number, py: number): Pt {
  const n = NODES[id]
  return [n.x + px * n.depth * FOLLOW, n.y + py * n.depth * FOLLOW]
}

function curveFor(edge: Edge, px: number, py: number): Curve {
  const [fx, fy] = pos(edge.from, px, py)
  const [tx, ty] = pos(edge.to, px, py)
  if (edge.kind === 'down') {
    const start: Pt = [fx, fy + H / 2]
    const end: Pt = [tx, ty - H / 2]
    const mid = (start[1] + end[1]) / 2
    return [start, [fx, mid], [tx, mid], end]
  }
  const start: Pt = [fx - W / 2, fy]
  const end: Pt = [tx, ty + H / 2]
  return [start, [tx + (start[0] - tx) * 0.35, fy], [tx, fy], end]
}

const toPath = ([a, b, c, d]: Curve) =>
  `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`

function pointOn([a, b, c, d]: Curve, t: number): Pt {
  const u = 1 - t
  const k0 = u * u * u
  const k1 = 3 * u * u * t
  const k2 = 3 * u * t * t
  const k3 = t * t * t
  return [
    k0 * a[0] + k1 * b[0] + k2 * c[0] + k3 * d[0],
    k0 * a[1] + k1 * b[1] + k2 * c[1] + k3 * d[1],
  ]
}

const ease = [0.16, 1, 0.3, 1] as const
const NODE_ORDER: NodeId[] = ['client', 'api', 'db', 'queue', 'worker']

interface PointerProps {
  px: MotionValue<number>
  py: MotionValue<number>
  reduce: boolean
}

function EdgePath({ edge, index, px, py, reduce }: PointerProps & { edge: Edge; index: number }) {
  const d = useTransform([px, py], ([x, y]: number[]) => toPath(curveFor(edge, x, y)))
  return (
    <m.path
      d={d}
      fill="none"
      stroke="rgb(148 163 184 / 0.42)"
      strokeWidth={1.25}
      initial={reduce ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.5 + index * 0.22 }}
    />
  )
}

function Packet({
  edge,
  index,
  px,
  py,
}: Omit<PointerProps, 'reduce'> & { edge: Edge; index: number }) {
  const t = useMotionValue(0)
  useEffect(() => {
    const controls = animate(t, [0, 1], {
      duration: 1.8,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1.2 + index * 0.35,
      delay: 2 + index * 0.4,
    })
    return () => controls.stop()
  }, [t, index])

  const cx = useTransform([px, py, t], ([x, y, p]: number[]) => pointOn(curveFor(edge, x, y), p)[0])
  const cy = useTransform([px, py, t], ([x, y, p]: number[]) => pointOn(curveFor(edge, x, y), p)[1])
  const opacity = useTransform(t, [0, 0.08, 0.92, 1], [0, 1, 1, 0])

  return (
    <m.circle
      cx={cx}
      cy={cy}
      r={3}
      fill="var(--color-accent)"
      style={{ opacity, filter: 'drop-shadow(0 0 6px var(--color-accent))' }}
    />
  )
}

function NodeBox({ id, index, px, py, reduce }: PointerProps & { id: NodeId; index: number }) {
  const n = NODES[id]
  const x = useTransform(px, (v) => v * n.depth * FOLLOW)
  const y = useTransform(py, (v) => v * n.depth * FOLLOW)
  const Icon = n.icon

  return (
    <m.g style={{ x, y }}>
      <m.g
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease, delay: 0.15 + index * 0.22 }}
        style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
      >
        {n.accent && <circle cx={n.x} cy={n.y} r={70} fill="url(#api-glow)" />}
        <rect
          x={n.x - W / 2}
          y={n.y - H / 2}
          width={W}
          height={H}
          rx={6}
          fill="var(--color-surface)"
          stroke={n.accent ? 'var(--color-accent)' : 'var(--color-line-strong)'}
          strokeWidth={1}
        />
        {/* connection ports */}
        <circle
          cx={n.x}
          cy={n.y - H / 2}
          r={2.5}
          fill="var(--color-bg)"
          stroke="var(--color-muted)"
        />
        <circle
          cx={n.x}
          cy={n.y + H / 2}
          r={2.5}
          fill="var(--color-bg)"
          stroke="var(--color-muted)"
        />
        <Icon
          x={n.x - W / 2 + 12}
          y={n.y - 9}
          width={18}
          height={18}
          strokeWidth={1.5}
          color={n.accent ? 'var(--color-accent)' : 'var(--color-muted)'}
        />
        <text
          x={n.x - W / 2 + 38}
          y={n.y - 2}
          fill="var(--color-ink)"
          fontFamily="var(--font-mono)"
          fontSize={12.5}
          fontWeight={500}
        >
          {n.label}
        </text>
        <text
          x={n.x - W / 2 + 38}
          y={n.y + 13}
          fill="var(--color-faint)"
          fontFamily="var(--font-mono)"
          fontSize={9.5}
        >
          {n.sub}
        </text>
      </m.g>
    </m.g>
  )
}

/** Self-drawing architecture diagram whose nodes drift toward the cursor. */
export function SystemDiagram({ reduce }: { reduce: boolean }) {
  const { x: px, y: py } = usePointer(!reduce)

  return (
    <figure className="relative mx-auto w-full max-w-[500px]">
      <svg
        viewBox="0 0 440 540"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-labelledby="diagram-title"
      >
        <title id="diagram-title">
          System diagram: client connects to an API, which writes to a database and a job queue
          processed by a worker.
        </title>
        <defs>
          <radialGradient id="api-glow">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Blueprint annotations */}
        <m.g
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth={1}
        >
          {/* vertical dimension line */}
          <path d="M8 46 V504 M2 46 H14 M2 504 H14" />
          <text
            x={-275}
            y={22}
            transform="rotate(-90)"
            fill="var(--color-faint)"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize={9}
            letterSpacing={1.5}
            textAnchor="middle"
          >
            3 TIERS · 5 NODES
          </text>
          {/* horizontal dimension between db and queue */}
          <path d="M96 418 V430 M344 418 V430 M96 424 H344" strokeDasharray="2 4" />
          <text
            x={220}
            y={440}
            fill="var(--color-faint)"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize={9}
            letterSpacing={1.5}
            textAnchor="middle"
          >
            ASYNC BOUNDARY
          </text>
        </m.g>

        {EDGES.map((e, i) => (
          <EdgePath key={`${e.from}-${e.to}`} edge={e} index={i} px={px} py={py} reduce={reduce} />
        ))}
        {!reduce &&
          EDGES.map((e, i) => (
            <Packet key={`p-${e.from}-${e.to}`} edge={e} index={i} px={px} py={py} />
          ))}
        {NODE_ORDER.map((id, i) => (
          <NodeBox key={id} id={id} index={i} px={px} py={py} reduce={reduce} />
        ))}
      </svg>
      <figcaption className="mt-2 flex items-center justify-between label-mono text-faint">
        <span>fig. 01 — request flow</span>
        <span>rev. A</span>
      </figcaption>
    </figure>
  )
}
