import type { FigureEdge, FigureNode, SystemFigure } from '../content/figureTypes'

export const NODE_W = 156
export const NODE_H = 50
const LANE_W = 176
const TIER_H = 112
const PAD_L = 76 // room for the tiers/nodes dimension line on the left
const PAD_R = 20
const PAD_T = 30
const PAD_B = 30
/** x of the vertical dimension line */
export const DIM_X = 44

export type Pt = [number, number]
export type Curve = [Pt, Pt, Pt, Pt]

export interface PlacedNode extends FigureNode {
  x: number
  y: number
}

export interface Layout {
  width: number
  height: number
  tiers: number
  nodes: PlacedNode[]
  byId: Map<string, PlacedNode>
  /** top and bottom of the dimension line */
  dim: { y1: number; y2: number; tierYs: number[] }
}

export function layoutFigure(fig: SystemFigure): Layout {
  const tiers = Math.max(...fig.nodes.map((n) => n.tier)) + 1
  const nodes = fig.nodes.map((n) => ({
    ...n,
    x: PAD_L + n.lane * LANE_W + NODE_W / 2,
    y: PAD_T + n.tier * TIER_H + NODE_H / 2,
  }))
  const tierYs = Array.from({ length: tiers }, (_, t) => PAD_T + t * TIER_H + NODE_H / 2)
  return {
    width: PAD_L + (fig.lanes - 1) * LANE_W + NODE_W + PAD_R,
    height: PAD_T + (tiers - 1) * TIER_H + NODE_H + PAD_B,
    tiers,
    nodes,
    byId: new Map(nodes.map((n) => [n.id, n])),
    dim: { y1: PAD_T, y2: PAD_T + (tiers - 1) * TIER_H + NODE_H, tierYs },
  }
}

type Side = 'top' | 'bottom' | 'left' | 'right'

/** Which side of each node an edge leaves from and arrives at. */
export function edgeSides(a: FigureNode, b: FigureNode, ax: number, bx: number): [Side, Side] {
  if (b.tier > a.tier) return ['bottom', 'top']
  if (b.tier === a.tier) return bx > ax ? ['right', 'left'] : ['left', 'right']
  // back edge (to a higher tier): leave sideways, arrive underneath
  return [bx < ax ? 'left' : 'right', 'bottom']
}

function anchor(x: number, y: number, side: Side): Pt {
  switch (side) {
    case 'top':
      return [x, y - NODE_H / 2]
    case 'bottom':
      return [x, y + NODE_H / 2]
    case 'left':
      return [x - NODE_W / 2, y]
    case 'right':
      return [x + NODE_W / 2, y]
  }
}

/** Cubic connector between two node centres (which may be offset by the cursor). */
export function routeEdge(a: FigureNode, b: FigureNode, [ax, ay]: Pt, [bx, by]: Pt): Curve {
  const [sa, sb] = edgeSides(a, b, ax, bx)
  const s = anchor(ax, ay, sa)
  const e = anchor(bx, by, sb)
  if (sa === 'bottom') {
    const m = (s[1] + e[1]) / 2
    return [s, [s[0], m], [e[0], m], e]
  }
  if (sb !== 'bottom') {
    const m = (s[0] + e[0]) / 2
    return [s, [m, s[1]], [m, e[1]], e]
  }
  return [s, [e[0] + (s[0] - e[0]) * 0.35, s[1]], [e[0], s[1]], e]
}

export const toPath = ([a, b, c, d]: Curve) =>
  `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`

export function pointOn([a, b, c, d]: Curve, t: number): Pt {
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

/** Sides of a node that have a connector, so ports are drawn only where used. */
export function usedSides(layout: Layout, edges: FigureEdge[]) {
  const sides = new Map<string, Set<Side>>()
  const add = (id: string, s: Side) => {
    if (!sides.has(id)) sides.set(id, new Set())
    sides.get(id)!.add(s)
  }
  for (const e of edges) {
    const a = layout.byId.get(e.from)
    const b = layout.byId.get(e.to)
    if (!a || !b) continue
    const [sa, sb] = edgeSides(a, b, a.x, b.x)
    add(a.id, sa)
    add(b.id, sb)
  }
  return sides
}

export function groupBox(layout: Layout, ids: string[], pad = 16) {
  const ns = ids.map((id) => layout.byId.get(id)).filter((n): n is PlacedNode => Boolean(n))
  const x1 = Math.min(...ns.map((n) => n.x - NODE_W / 2)) - pad
  const x2 = Math.max(...ns.map((n) => n.x + NODE_W / 2)) + pad
  const y1 = Math.min(...ns.map((n) => n.y - NODE_H / 2)) - pad - 10
  const y2 = Math.max(...ns.map((n) => n.y + NODE_H / 2)) + pad
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}
