/**
 * Data model for the blueprint "system figures": the hero diagram and every
 * project cover. Nodes sit on a grid of tiers (top → bottom) and lanes
 * (left → right); connectors are routed automatically.
 */

export type FigureIcon =
  | 'web'
  | 'mobile'
  | 'devices'
  | 'server'
  | 'gateway'
  | 'database'
  | 'queue'
  | 'worker'
  | 'cache'
  | 'search'
  | 'auth'
  | 'payments'
  | 'cart'
  | 'store'
  | 'mail'
  | 'bell'
  | 'message'
  | 'cloud'
  | 'cdn'
  | 'external'
  | 'truck'
  | 'map'
  | 'git'
  | 'build'
  | 'check'
  | 'browser'
  | 'form'
  | 'dashboard'
  | 'state'
  | 'storage'
  | 'chip'
  | 'doc'
  | 'bot'
  | 'users'
  | 'calendar'
  | 'clock'
  | 'webhook'
  | 'video'
  | 'sparkles'

export interface FigureNode {
  id: string
  label: string
  /** small mono line under the label, e.g. "postgres" */
  sub?: string
  icon: FigureIcon
  /** row, 0 = top */
  tier: number
  /** column, 0 = left; halves (0.5, 1.5) centre a node between two columns */
  lane: number
  /** highlight in amber — usually the core of the system */
  accent?: boolean
}

export interface FigureEdge {
  from: string
  to: string
  /** dashed connector for async / event / out-of-band links */
  async?: boolean
}

/** dashed boundary drawn around a set of nodes, e.g. "firebase" or "audit scope" */
export interface FigureGroup {
  label: string
  nodes: string[]
}

export interface SystemFigure {
  /** short caption, e.g. "multi-vendor commerce" */
  title: string
  /** number of columns the figure uses (max 3 keeps it readable) */
  lanes: number
  nodes: FigureNode[]
  edges: FigureEdge[]
  groups?: FigureGroup[]
}
