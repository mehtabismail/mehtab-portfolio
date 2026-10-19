import {
  AppWindow,
  Bell,
  Bot,
  Boxes,
  CalendarDays,
  Check,
  Clock,
  Cloud,
  Cpu,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  Globe,
  Hammer,
  HardDrive,
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  MonitorSmartphone,
  Network,
  Plug,
  Search,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Truck,
  Users,
  Video,
  Webhook,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useId, useMemo, useRef } from 'react'
import type { FigureEdge, FigureIcon, SystemFigure } from '../../content/figureTypes'
import { usePointer } from '../../hooks/usePointer'
import {
  DIM_X,
  NODE_H,
  NODE_W,
  groupBox,
  layoutFigure,
  pointOn,
  routeEdge,
  toPath,
  usedSides,
  type Layout,
  type PlacedNode,
  type Pt,
} from '../../lib/figureLayout'

const ICONS: Record<FigureIcon, LucideIcon> = {
  web: Monitor,
  mobile: Smartphone,
  devices: MonitorSmartphone,
  server: Server,
  gateway: Network,
  database: Database,
  queue: Layers,
  worker: Cpu,
  cache: Zap,
  search: Search,
  auth: ShieldCheck,
  payments: CreditCard,
  cart: ShoppingCart,
  store: Store,
  mail: Mail,
  bell: Bell,
  message: MessageSquare,
  cloud: Cloud,
  cdn: Globe,
  external: Plug,
  truck: Truck,
  map: MapPin,
  git: GitBranch,
  build: Hammer,
  check: Check,
  browser: AppWindow,
  form: FileText,
  dashboard: LayoutDashboard,
  state: Boxes,
  storage: HardDrive,
  chip: Cpu,
  doc: FileText,
  bot: Bot,
  users: Users,
  calendar: CalendarDays,
  clock: Clock,
  webhook: Webhook,
  video: Video,
  sparkles: Sparkles,
}

const FOLLOW = 16 // px of cursor travel for the most responsive tier
const ease = [0.16, 1, 0.3, 1] as const

interface Shared {
  layout: Layout
  px: MotionValue<number>
  py: MotionValue<number>
  /** run entrance animations (false = render final state) */
  play: boolean
  glowId: string
}

/** Upper tiers drift more than lower ones, which gives the figure depth. */
const depthOf = (n: PlacedNode, tiers: number) => 1 - (n.tier / Math.max(1, tiers)) * 0.65

function offsetPos(n: PlacedNode, tiers: number, x: number, y: number): Pt {
  const d = depthOf(n, tiers)
  return [n.x + x * d * FOLLOW, n.y + y * d * FOLLOW]
}

function EdgePath({
  edge,
  index,
  layout,
  px,
  py,
  play,
}: Shared & { edge: FigureEdge; index: number }) {
  const a = layout.byId.get(edge.from)!
  const b = layout.byId.get(edge.to)!
  const d = useTransform([px, py], ([x, y]: number[]) =>
    toPath(routeEdge(a, b, offsetPos(a, layout.tiers, x, y), offsetPos(b, layout.tiers, x, y))),
  )
  const delay = 0.45 + index * 0.08
  return edge.async ? (
    <m.path
      d={d}
      fill="none"
      stroke="rgb(148 163 184 / 0.45)"
      strokeWidth={1.25}
      strokeDasharray="4 5"
      initial={play ? { opacity: 0 } : false}
      animate={play ? { opacity: 1 } : undefined}
      transition={{ duration: 0.8, delay }}
    />
  ) : (
    <m.path
      d={d}
      fill="none"
      stroke="rgb(148 163 184 / 0.45)"
      strokeWidth={1.25}
      initial={play ? { pathLength: 0 } : false}
      animate={play ? { pathLength: 1 } : undefined}
      transition={{ duration: 0.8, ease, delay }}
    />
  )
}

function Packet({
  edge,
  index,
  layout,
  px,
  py,
}: Omit<Shared, 'play'> & { edge: FigureEdge; index: number }) {
  const a = layout.byId.get(edge.from)!
  const b = layout.byId.get(edge.to)!
  const t = useMotionValue(0)
  useEffect(() => {
    const controls = animate(t, [0, 1], {
      duration: 1.7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1.4 + (index % 5) * 0.45,
      delay: 1.8 + index * 0.3,
    })
    return () => controls.stop()
  }, [t, index])
  const point = (x: number, y: number, p: number) =>
    pointOn(routeEdge(a, b, offsetPos(a, layout.tiers, x, y), offsetPos(b, layout.tiers, x, y)), p)
  const cx = useTransform([px, py, t], ([x, y, p]: number[]) => point(x, y, p)[0])
  const cy = useTransform([px, py, t], ([x, y, p]: number[]) => point(x, y, p)[1])
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

const PORTS = {
  top: [0, -NODE_H / 2],
  bottom: [0, NODE_H / 2],
  left: [-NODE_W / 2, 0],
  right: [NODE_W / 2, 0],
} as const

function NodeBox({
  node,
  layout,
  sides,
  px,
  py,
  play,
  glowId,
}: Shared & { node: PlacedNode; sides: Set<keyof typeof PORTS> | undefined }) {
  const d = depthOf(node, layout.tiers)
  const x = useTransform(px, (v) => v * d * FOLLOW)
  const y = useTransform(py, (v) => v * d * FOLLOW)
  const Icon = ICONS[node.icon]
  const left = node.x - NODE_W / 2
  return (
    <m.g style={{ x, y }}>
      <m.g
        initial={play ? { opacity: 0, scale: 0.88 } : false}
        animate={play ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, ease, delay: 0.1 + node.tier * 0.14 + node.lane * 0.05 }}
        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
      >
        {node.accent && <circle cx={node.x} cy={node.y} r={74} fill={`url(#${glowId})`} />}
        <rect
          x={left}
          y={node.y - NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx={6}
          fill="var(--color-surface)"
          stroke={node.accent ? 'var(--color-accent)' : 'rgb(148 163 184 / 0.3)'}
        />
        {[...(sides ?? [])].map((s) => (
          <circle
            key={s}
            cx={node.x + PORTS[s][0]}
            cy={node.y + PORTS[s][1]}
            r={2.5}
            fill="var(--color-bg)"
            stroke="var(--color-muted)"
          />
        ))}
        <Icon
          x={left + 12}
          y={node.y - 9}
          width={18}
          height={18}
          strokeWidth={1.5}
          color={node.accent ? 'var(--color-accent)' : 'var(--color-muted)'}
        />
        <text
          x={left + 38}
          y={node.sub ? node.y - 2 : node.y + 4}
          fill={node.accent ? 'var(--color-accent)' : 'var(--color-ink)'}
          fontFamily="var(--font-mono)"
          fontSize={12.5}
          fontWeight={500}
        >
          {node.label}
        </text>
        {node.sub && (
          <text
            x={left + 38}
            y={node.y + 13}
            fill="var(--color-faint)"
            fontFamily="var(--font-mono)"
            fontSize={9.5}
          >
            {node.sub}
          </text>
        )}
      </m.g>
    </m.g>
  )
}

interface Props {
  figure: SystemFigure
  /** cursor-follow + flowing packets (the hero) */
  interactive?: boolean
  /** 'mount' animates immediately, 'view' waits until scrolled into view */
  enter?: 'mount' | 'view'
  /** draw an empty, same-size SVG until the figure nears the viewport */
  lazy?: boolean
  className?: string
}

/** Blueprint system diagram rendered from a SystemFigure. */
export function SystemFigureView({
  figure,
  interactive = false,
  enter = 'view',
  lazy = false,
  className,
}: Props) {
  const reduce = useReducedMotion() ?? false
  const layout = useMemo(() => layoutFigure(figure), [figure])
  const sides = useMemo(() => usedSides(layout, figure.edges), [layout, figure.edges])
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  // Mount the full drawing well ahead of the entrance trigger so it's ready in time.
  const near = useInView(ref, { once: true, margin: '800px 0px 800px 0px' })
  const pointer = usePointer(interactive && !reduce)
  const still = useMotionValue(0)
  const px = interactive ? pointer.x : still
  const py = interactive ? pointer.y : still

  const play = !reduce && (enter === 'mount' || inView)
  // Before a 'view' figure is reached, keep it hidden rather than flashing the final state.
  const waiting = !reduce && enter === 'view' && !inView
  const glowId = `glow-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const shared: Shared = { layout, px, py, play, glowId }
  const label = `${figure.title}: ${figure.nodes.map((n) => n.label).join(', ')}`
  const { dim } = layout
  const midY = (dim.y1 + dim.y2) / 2

  if (lazy && !near) {
    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className={className}
        role="img"
        aria-label={label}
        style={{ overflow: 'visible', opacity: waiting ? 0 : 1 }}
      />
    )
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={className}
      role="img"
      aria-label={label}
      style={{ overflow: 'visible', opacity: waiting ? 0 : 1 }}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Dimension line with tier ticks; the label sits to its left */}
      <m.g
        stroke="rgb(148 163 184 / 0.3)"
        initial={play ? { opacity: 0 } : false}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <path
          d={`M${DIM_X} ${dim.y1} V${dim.y2} M${DIM_X - 6} ${dim.y1} H${DIM_X + 6} M${DIM_X - 6} ${dim.y2} H${DIM_X + 6}`}
        />
        {dim.tierYs.map((ty) => (
          <path key={ty} d={`M${DIM_X} ${ty} H${DIM_X + 5}`} />
        ))}
        <text
          transform={`translate(${DIM_X - 14} ${midY}) rotate(-90)`}
          textAnchor="middle"
          fill="var(--color-faint)"
          stroke="none"
          fontFamily="var(--font-mono)"
          fontSize={9.5}
          letterSpacing={1.6}
        >
          {`${layout.tiers} TIERS · ${figure.nodes.length} NODES`}
        </text>
      </m.g>

      {figure.groups?.map((g) => {
        const box = groupBox(layout, g.nodes)
        return (
          <m.g
            key={g.label}
            initial={play ? { opacity: 0 } : false}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              rx={10}
              fill="rgb(148 163 184 / 0.025)"
              stroke="rgb(148 163 184 / 0.22)"
              strokeDasharray="3 5"
            />
            <text
              x={box.x + 12}
              y={box.y + 15}
              fill="var(--color-faint)"
              fontFamily="var(--font-mono)"
              fontSize={9}
              letterSpacing={1.4}
            >
              {g.label.toUpperCase()}
            </text>
          </m.g>
        )
      })}

      {figure.edges.map((e, i) => (
        <EdgePath key={`${e.from}-${e.to}`} edge={e} index={i} {...shared} />
      ))}
      {interactive &&
        !reduce &&
        figure.edges
          .filter((e) => !e.async)
          .map((e, i) => <Packet key={`p-${e.from}-${e.to}`} edge={e} index={i} {...shared} />)}
      {layout.nodes.map((n) => (
        <NodeBox key={n.id} node={n} sides={sides.get(n.id)} {...shared} />
      ))}
    </svg>
  )
}
