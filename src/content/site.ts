/**
 * All editable site copy lives in this folder. Change text here — no component
 * edits needed. Items marked TODO are placeholders waiting for real details.
 */

export type SocialKey = 'github' | 'linkedin' | 'x' | 'upwork' | 'fiverr'

export interface SocialLink {
  key: SocialKey
  label: string
  href: string
}

export interface NavLink {
  label: string
  /** id of the section to scroll to */
  target: string
}

export const site = {
  name: 'Mehtab Ismail',
  initials: 'MI',
  // TODO: replace with the email you want public on the site
  email: 'hello@example.com',
  // TODO: replace with your city
  location: 'City, Pakistan',
  resumeHref: '/resume.pdf',
  url: 'https://example.com', // TODO: your domain, used for SEO tags
} as const

/**
 * Search and social-share text. Injected into the HTML at build time by the
 * siteMeta plugin in vite.config.ts (titles, descriptions, Open Graph, JSON-LD,
 * sitemap.xml and robots.txt).
 */
export const seo = {
  jobTitle: 'Freelance Full-Stack Developer & System Architect',
  pages: {
    '/': {
      title: 'Mehtab Ismail — Full-Stack Developer & System Architect',
      description:
        'Freelance full-stack developer who also handles system architecture, technical documentation and UI design — taking products from idea to shipped code.',
    },
    '/work/': {
      title: 'All work — Mehtab Ismail',
      description:
        'Case studies from Mehtab Ismail: full-stack builds, system architecture, technical documentation, audits and automation.',
    },
  },
  /** 1200×630 share image in /public */
  ogImage: '/og.png',
  ogImageAlt: 'Mehtab Ismail — Full-Stack Developer & System Architect',
}

export const nav: NavLink[] = [
  { label: 'About', target: 'about' },
  { label: 'Work', target: 'work' },
  { label: 'Process', target: 'process' },
  { label: 'Contact', target: 'contact' },
]

// TODO: replace each href with your real profile URL. Remove any you don't use.
export const socials: SocialLink[] = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { key: 'x', label: 'X (Twitter)', href: 'https://x.com/' },
  { key: 'upwork', label: 'Upwork', href: 'https://www.upwork.com/' },
]

export const hero = {
  greeting: "Hi, I'm",
  availability: 'Available for freelance projects',
  roles: ['Full-Stack Developer', 'System Architect', 'UI Designer', 'Technical Writer'],
  statement:
    'I turn product ideas into documented, scalable platforms — from architecture to pixel.',
  primaryCta: { label: 'Hire me', target: 'contact' },
  secondaryCta: { label: 'See my work', target: 'work' },
}

/* ───────────────────────────── What I do ───────────────────────────── */

export type ServiceIcon = 'code' | 'architecture' | 'design'

export interface Service {
  /** short discipline code shown in the card's title block */
  code: string
  icon: ServiceIcon
  title: string
  tagline: string
  description: string
  tools: string[]
}

export const about = {
  heading: 'What I do',
  intro:
    "I'm a freelance full-stack developer. On client projects I also own the system architecture, the technical documentation and the UI design — so one person carries the product from idea to shipped code.",
}

export const services: Service[] = [
  {
    code: 'FS-DEV',
    icon: 'code',
    title: 'Full-Stack Development',
    tagline: 'Web and mobile products, end to end',
    description:
      'Production apps across web and mobile: typed front ends, APIs, data models and the deployment that ties them together.',
    tools: [
      'React',
      'Next.js',
      'React Native',
      'Expo',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'MongoDB',
      'REST APIs',
    ],
  },
  {
    code: 'SYS-ARC',
    icon: 'architecture',
    title: 'Architecture & Documentation',
    tagline: 'Systems designed and written down',
    description:
      'System design before the first commit, technical specs the team can build from, client-facing docs, and audits of existing codebases.',
    tools: [
      'System design',
      'Technical specs',
      'API design',
      'Client-facing docs',
      'Code audits',
      'Diagrams',
      'Integration planning',
    ],
  },
  {
    code: 'UI-DSN',
    icon: 'design',
    title: 'UI/UX Design',
    tagline: 'Interfaces that are ready to build',
    description:
      'Mobile and web interfaces designed in Figma, backed by design systems that keep the product consistent as it grows.',
    tools: ['Figma', 'Design systems', 'Prototyping', 'Mobile UI', 'Web UI', 'Component libraries'],
  },
]

/* ───────────────────────────── Work ───────────────────────────── */

export type ProjectCategory =
  'Mobile' | 'Web' | 'Architecture' | 'Documentation' | 'Audit' | 'Automation'

export interface ArchNode {
  id: string
  label: string
  /** position on a 0–100 grid */
  x: number
  y: number
  /** highlight this node in amber */
  core?: boolean
}

/**
 * PRIVACY SWITCH. Everything in this file ships in the site's JavaScript, so a
 * hidden project must not contain its real name anywhere (TypeScript enforces
 * this). Keep the real name in a // comment — comments are stripped from the
 * build — until the client approves, then add `name` and set `showName: true`.
 */
type ProjectNaming =
  { showName: true; /** public project name */ name: string } | { showName: false; name?: never }

export type Project = ProjectNaming & {
  /** used in HTML ids — keep it neutral for hidden projects */
  slug: string
  /** neutral title shown while the name is hidden (and as a fallback) */
  alias: string
  /** shown on the home page "Selected work" list */
  featured: boolean
  category: ProjectCategory
  categories: ProjectCategory[]
  year?: string
  summary: string
  problem: string
  role: string
  architecture: string
  stack: string[]
  outcome: string
  /** Optional cover image in /public (WebP/AVIF), e.g. '/work/liora.webp' */
  cover?: string
  arch: { nodes: ArchNode[]; edges: [string, string][] }
  links: { live?: string; caseStudy?: string; repo?: string }
}

export const work = {
  heading: 'Selected work',
  intro:
    'Case studies from products I have designed, architected, documented and built. Some client names are withheld.',
  allHeading: 'All work',
  allIntro: 'Everything I can share, filterable by the kind of work involved.',
}

/*
 * DRAFT COPY: written from the short descriptions in your brief. Check every
 * field — especially stack and outcome — before publishing.
 */
export const projects: Project[] = [
  {
    slug: 'liora',
    name: 'Liora',
    alias: 'Cycle-tracking app',
    showName: true, // confirmed public 2026-10-15
    featured: true,
    category: 'Mobile',
    categories: ['Mobile', 'Web', 'Architecture'],
    summary: 'A cycle-tracking app for women and girls, on mobile and web.',
    problem:
      'Women and girls need a simple, private way to track their cycle, on their phone and on the web.',
    role: 'Product owner: architecture, UI design and the full-stack build.',
    architecture:
      'A mobile app and a web client sharing one backend API and one data model, so a user’s history is the same everywhere.',
    stack: ['React Native', 'Expo', 'React', 'TypeScript', 'Node.js'], // TODO: verify
    outcome: 'TODO: add a concrete outcome (users, launch status, store rating…).',
    arch: {
      nodes: [
        { id: 'mobile', label: 'Mobile', x: 18, y: 22 },
        { id: 'web', label: 'Web', x: 18, y: 78 },
        { id: 'api', label: 'API', x: 55, y: 50, core: true },
        { id: 'db', label: 'DB', x: 88, y: 50 },
      ],
      edges: [
        ['mobile', 'api'],
        ['web', 'api'],
        ['api', 'db'],
      ],
    },
    links: {},
  },
  {
    // Real name: MarketNest — add `name` and set showName: true once the client approves.
    slug: 'multi-vendor-marketplace',
    alias: 'Multi-vendor marketplace',
    showName: false,
    featured: true,
    category: 'Architecture',
    categories: ['Architecture', 'Documentation', 'Web'],
    summary: 'Architecture and documentation for a multi-vendor e-commerce platform.',
    problem:
      'A marketplace where many independent vendors sell through one storefront needs clear boundaries between vendors, orders and payouts before anyone writes code.',
    role: 'System architecture and technical documentation.',
    architecture:
      'Vendor, catalogue, order and payout domains separated behind one API, written up as specs the build team works from.',
    stack: ['System design', 'API design', 'Technical specs'], // TODO: verify
    outcome: 'TODO: add a concrete outcome.',
    arch: {
      nodes: [
        { id: 'store', label: 'Store', x: 14, y: 50 },
        { id: 'api', label: 'API', x: 42, y: 50, core: true },
        { id: 'vendor', label: 'Vendors', x: 76, y: 16 },
        { id: 'orders', label: 'Orders', x: 76, y: 50 },
        { id: 'payouts', label: 'Payouts', x: 76, y: 84 },
      ],
      edges: [
        ['store', 'api'],
        ['api', 'vendor'],
        ['api', 'orders'],
        ['api', 'payouts'],
      ],
    },
    links: {},
  },
  {
    // Real name: Bling — add `name` and set showName: true once the client approves.
    slug: 'dhl-marketplace',
    alias: 'Marketplace with DHL logistics',
    showName: false,
    featured: true,
    category: 'Documentation',
    categories: ['Documentation', 'Web'],
    summary: 'Client-facing documentation for an e-commerce marketplace’s DHL integration.',
    problem:
      'A non-technical client needed to understand what happens to an order between checkout and DHL delivery.',
    role: 'Client-facing technical documentation for the logistics integration.',
    architecture:
      'Orders hand shipments to a DHL integration layer that creates labels and syncs tracking back to the order.',
    stack: ['DHL API', 'Integration docs', 'Sequence diagrams'], // TODO: verify
    outcome: 'TODO: add a concrete outcome.',
    arch: {
      nodes: [
        { id: 'checkout', label: 'Checkout', x: 10, y: 30 },
        { id: 'orders', label: 'Orders', x: 48, y: 30, core: true },
        { id: 'dhl', label: 'DHL', x: 86, y: 30 },
        { id: 'track', label: 'Tracking', x: 60, y: 80 },
      ],
      edges: [
        ['checkout', 'orders'],
        ['orders', 'dhl'],
        ['dhl', 'track'],
        ['track', 'orders'],
      ],
    },
    links: {},
  },
  {
    slug: 'outreach-agent',
    name: 'Business outreach agent',
    alias: 'Business outreach agent',
    showName: true, // descriptive title, not a client name
    featured: true,
    category: 'Automation',
    categories: ['Automation', 'Web'],
    summary: 'An automated lead-generation agent that builds sample sites and sends outreach.',
    problem: 'Finding businesses and pitching each one by hand doesn’t scale.',
    role: 'Design and build of the whole pipeline.',
    architecture:
      'A pipeline that finds businesses, generates a sample website for each one, then sends personalised outreach with a link to it.',
    stack: ['Node.js', 'TypeScript'], // TODO: verify
    outcome: 'TODO: add a concrete outcome.',
    arch: {
      nodes: [
        { id: 'find', label: 'Find', x: 6, y: 50 },
        { id: 'build', label: 'Build site', x: 40, y: 50, core: true },
        { id: 'send', label: 'Outreach', x: 80, y: 50 },
        { id: 'leads', label: 'Leads', x: 92, y: 14 },
      ],
      edges: [
        ['find', 'build'],
        ['build', 'send'],
        ['send', 'leads'],
      ],
    },
    links: {},
  },
  {
    // Real name: KAVE — add `name` and set showName: true once the client approves.
    slug: 'mobile-app-audit',
    alias: 'Enterprise mobile app audit',
    showName: false,
    featured: false,
    category: 'Audit',
    categories: ['Audit', 'Mobile'],
    summary: 'An enterprise code audit of a React Native / Expo app.',
    problem:
      'An enterprise team wanted an independent view of their React Native codebase: what was risky, and what to fix first.',
    role: 'Code audit and written findings.',
    architecture:
      'Reviewed app structure, state and data flow, API usage, build setup and dependencies; findings delivered as a prioritised report.',
    stack: ['React Native', 'Expo', 'TypeScript'],
    outcome: 'TODO: add a concrete outcome.',
    arch: {
      nodes: [
        { id: 'ui', label: 'UI', x: 16, y: 24 },
        { id: 'state', label: 'State', x: 16, y: 76 },
        { id: 'app', label: 'App', x: 50, y: 50, core: true },
        { id: 'api', label: 'API', x: 84, y: 50 },
      ],
      edges: [
        ['ui', 'app'],
        ['state', 'app'],
        ['app', 'api'],
      ],
    },
    links: {},
  },
  {
    slug: 'work-log',
    name: 'Work-log automation',
    alias: 'Work-log automation',
    showName: true, // descriptive title, not a client name
    featured: false,
    category: 'Automation',
    categories: ['Automation', 'Documentation'],
    summary: 'Tooling that maintains dev logs and client meeting records.',
    problem: 'Keeping a client-facing record of work and meetings by hand is easy to skip.',
    role: 'Design and build.',
    architecture:
      'Work entries and meeting notes are captured in a structured log, then rendered into a report the client can read.',
    stack: ['Markdown', 'Node.js'], // TODO: verify
    outcome: 'TODO: add a concrete outcome.',
    arch: {
      nodes: [
        { id: 'work', label: 'Work', x: 14, y: 26 },
        { id: 'meet', label: 'Meetings', x: 14, y: 74 },
        { id: 'log', label: 'Log', x: 50, y: 50, core: true },
        { id: 'report', label: 'Report', x: 86, y: 50 },
      ],
      edges: [
        ['work', 'log'],
        ['meet', 'log'],
        ['log', 'report'],
      ],
    },
    links: {},
  },
]

/* ───────────────────────────── Process ───────────────────────────── */

export type ProcessIcon = 'discover' | 'architect' | 'design' | 'ship'

export interface ProcessStep {
  title: string
  icon: ProcessIcon
  description: string
  deliverables: string[]
}

export const processFlow = {
  heading: 'How I work',
  intro:
    'Most developers start at step four. I start at step one, so the code is built on decisions that are already made and written down.',
  // DRAFT: edit the descriptions and deliverables to match how you actually work.
  steps: [
    {
      title: 'Discover',
      icon: 'discover',
      description:
        'Goals, users and constraints. I ask the questions that change the plan before anything gets estimated.',
      deliverables: ['Project brief', 'Scope & priorities', 'Risks & open questions'],
    },
    {
      title: 'Architect & Document',
      icon: 'architect',
      description:
        'System design and a written spec — data model, APIs, integrations — so everyone builds from the same plan.',
      deliverables: ['Architecture diagram', 'Technical spec', 'API contracts'],
    },
    {
      title: 'Design',
      icon: 'design',
      description:
        'Interfaces in Figma on a small design system, reviewed with you before a line of UI code is written.',
      deliverables: ['Figma screens', 'Design system', 'Clickable prototype'],
    },
    {
      title: 'Build & Ship',
      icon: 'ship',
      description:
        'Typed code shipped in small increments, deployed, and handed over with the docs to maintain it.',
      deliverables: ['Production app', 'Deployment', 'Handover docs'],
    },
  ] satisfies ProcessStep[],
}

/* ───────────────────────────── Tech stack ───────────────────────────── */

export type TechIconKey =
  | 'react'
  | 'nextjs'
  | 'expo'
  | 'typescript'
  | 'javascript'
  | 'nodejs'
  | 'postgresql'
  | 'mongodb'
  | 'tailwind'
  | 'figma'
  | 'git'
  | 'github'
  | 'vercel'

export interface Tech {
  name: string
  icon: TechIconKey
}

export const techStack = {
  heading: 'Tech stack',
  hint: 'Play with me — drag and throw',
  // TODO: confirm this list. Icons available: see TechIconKey above.
  items: [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'React Native', icon: 'react' },
    { name: 'Expo', icon: 'expo' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'Node.js', icon: 'nodejs' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'Tailwind CSS', icon: 'tailwind' },
    { name: 'Figma', icon: 'figma' },
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Vercel', icon: 'vercel' },
  ] satisfies Tech[],
}

/* ───────────────────────────── Contact ───────────────────────────── */

export const contact = {
  heading: "Let's build something",
  intro: 'Tell me what you’re building — an idea, a spec, or a half-finished codebase.',
  /**
   * Formspree form ID: the part after /f/ in your form's endpoint,
   * e.g. https://formspree.io/f/xyzabcd → 'xyzabcd'.
   * TODO: paste your ID here. Until then the form explains it isn't connected.
   */
  formspreeId: '',
  projectTypes: [
    'Full-stack build',
    'Architecture & documentation',
    'UI/UX design',
    'Code audit',
    'Something else',
  ],
  successTitle: 'Message sent.',
  successBody: 'Thanks — I’ll read it properly and reply by email.',
}

/* ───────────────────────────── Experience ───────────────────────────── */

export interface ExperienceEntry {
  /** e.g. "2025" or "Now" */
  year: string
  role: string
  org: string
  summary: string
}

export const experience = {
  heading: 'Experience',
  // Newest first. TODO: replace the placeholder entries with your real history.
  entries: [
    {
      year: 'Now',
      role: 'Freelance Full-Stack Developer & Architect',
      org: 'Self-employed',
      summary:
        'Building web and mobile products for clients, including architecture, technical documentation and UI design.',
    },
    {
      year: 'YYYY',
      role: 'TODO: Role title',
      org: 'TODO: Organisation',
      summary: 'TODO: One or two lines on what you did and what changed because of it.',
    },
    {
      year: 'YYYY',
      role: 'TODO: Role title',
      org: 'TODO: Organisation',
      summary: 'TODO: One or two lines on what you did and what changed because of it.',
    },
    {
      year: 'YYYY',
      role: 'TODO: Role title',
      org: 'TODO: Organisation',
      summary: 'TODO: One or two lines on what you did and what changed because of it.',
    },
  ] satisfies ExperienceEntry[],
}
