/**
 * All editable site copy lives in this folder. Change text here — no component
 * edits needed. Items marked TODO are placeholders waiting for real details.
 */

import type { SystemFigure } from './figureTypes.ts'
import { figures } from './figures.ts'

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
  email: 'mehtabismail.dev@gmail.com',
  location: 'Lahore, Pakistan',
  resumeHref: '/resume.pdf',
  url: 'https://mehtab-portfolio-vert.vercel.app', // swap for a custom domain if you add one
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
        'Freelance full-stack developer who also handles system architecture and technical documentation — taking products from idea to shipped code.',
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
  /** the 404 page; kept out of search results and the sitemap */
  notFound: {
    title: 'Page not found — Mehtab Ismail',
    description: 'This page doesn’t exist. Head back to the home page or browse all work.',
  },
}

export const notFound = {
  heading: 'Page not found',
  body: 'This sheet isn’t in the drawing set — the link may be old or mistyped.',
}

export const nav: NavLink[] = [
  { label: 'About', target: 'about' },
  { label: 'Work', target: 'work' },
  { label: 'Process', target: 'process' },
  { label: 'Contact', target: 'contact' },
]

// Remove any entry to hide that link everywhere (side rail, menu, contact).
export const socials: SocialLink[] = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/mehtabismail' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/mehtabismail' },
  { key: 'x', label: 'X (Twitter)', href: 'https://x.com/MehtabIsmail' },
  { key: 'upwork', label: 'Upwork', href: 'https://www.upwork.com/freelancers/mehtabismail' },
]

export const hero = {
  greeting: "Hi, I'm",
  roles: ['Full-Stack Developer', 'React Native Developer', 'System Architect', 'Technical Writer'],
  statement:
    'I turn product ideas into documented, scalable platforms — from architecture to production.',
  primaryCta: { label: 'Hire me', target: 'contact' },
  secondaryCta: { label: 'See my work', target: 'work' },
}

/* ───────────────────────────── What I do ───────────────────────────── */

export type ServiceIcon = 'code' | 'architecture' | 'mobile'

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
    "I'm a freelance full-stack developer. On client projects I also own the system architecture and the technical documentation — so one person carries the product from idea to shipped code.",
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
      'NestJS',
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
    code: 'MOB-DEV',
    icon: 'mobile',
    title: 'Mobile Apps',
    tagline: 'React Native apps, shipped to both stores',
    description:
      'iOS and Android apps in React Native: real-time features, in-app purchases, smooth animations, and the release pipeline to the App Store and Google Play.',
    tools: [
      'React Native',
      'Expo',
      'Redux Toolkit',
      'WebRTC',
      'In-app purchases',
      'Reanimated',
      'Fastlane',
      'App Store & Play Store',
    ],
  },
]

/* ───────────────────────────── Work ───────────────────────────── */

export type ProjectCategory =
  'Mobile' | 'Web' | 'Architecture' | 'Documentation' | 'Audit' | 'Automation'

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
  /** company you built it at (shows "Built at …"); leave out for your own projects */
  madeAt?: string
  /** true for your own products — shows an "Own project" tag */
  own?: boolean
  category: ProjectCategory
  categories: ProjectCategory[]
  year?: string
  summary: string
  problem: string
  role: string
  architecture: string
  stack: string[]
  /** leave empty ('') to hide the Outcome row until you have a real result */
  outcome: string
  /** Optional cover image in /public (WebP/AVIF), e.g. '/work/liora.webp' */
  cover?: string
  /** architecture drawing for the cover — see src/content/figures.ts */
  figure: SystemFigure
  links: {
    live?: string
    appStore?: string
    googlePlay?: string
    caseStudy?: string
    repo?: string
  }
}

export const work = {
  heading: 'Selected work',
  intro:
    'Case studies from products I have architected, documented and built — each with the system behind it.',
  allHeading: 'All work',
  allIntro: 'Everything I can share, filterable by the kind of work involved.',
}

/*
 * DRAFT COPY: written from your brief and CV. Check every field — especially
 * stack and outcome — before publishing.
 */
export const projects: Project[] = [
  {
    slug: 'arca',
    name: 'ARCA',
    alias: 'Multi-vendor marketplace',
    showName: true,
    featured: true,
    own: true,
    category: 'Architecture',
    categories: ['Architecture', 'Documentation', 'Web'],
    summary: 'Architecture and documentation for a multi-vendor e-commerce platform.',
    problem:
      'A marketplace where many independent vendors sell through one storefront needs clear boundaries between vendors, orders and payouts before anyone writes code.',
    role: 'System architecture and technical documentation.',
    architecture:
      'Storefront, vendor portal and admin all go through one API gateway. Catalog, orders and payouts are separate domain services over a shared Postgres, with order events handled by background workers.',
    stack: ['System design', 'API design', 'Technical specs'], // TODO: verify
    outcome: '', // TODO: add a concrete outcome
    figure: figures.arca,
    links: {},
  },
  {
    slug: 'bling',
    name: 'Bling',
    alias: 'Luxury-watch marketplace',
    showName: true,
    featured: true,
    madeAt: 'ZAPTA Technologies',
    category: 'Mobile',
    categories: ['Mobile', 'Web', 'Architecture', 'Documentation'],
    year: '2025–26',
    summary:
      'A bilingual luxury-watch marketplace for Saudi Arabia: the buyer and seller app, admin and partner dashboards, and the backend behind them.',
    problem:
      'Buying and selling luxury watches online only works with trust — authenticated items, safe payments, offers and negotiation, and tracked delivery — in Arabic and English.',
    role: 'Lead developer at ZAPTA Technologies across the mobile app, dashboards and backend, including the DHL logistics integration and its client-facing documentation.',
    architecture:
      'An Expo app (Redux Toolkit + RTK Query) and Next.js admin and partner dashboards share a NestJS API on Postgres via Prisma. Socket.IO powers chat, Redis and pg-boss run background jobs, and integrations cover payments (CPay, Tabby, Tamara, wallet), carriers including DHL, authenticity checks (Entrupy, LegitGrails), WatchCharts pricing and ZATCA e-invoicing.',
    stack: [
      'Expo',
      'React Native',
      'Redux Toolkit',
      'Next.js',
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'Redis',
      'Socket.IO',
      'DHL API',
    ],
    outcome: '', // TODO: add a concrete outcome
    figure: figures.bling,
    links: {},
  },
  {
    slug: 'kave',
    name: 'KAVE',
    alias: 'Short-stay rental marketplace',
    showName: true,
    featured: true,
    madeAt: 'ZAPTA Technologies',
    category: 'Mobile',
    categories: ['Mobile', 'Architecture'],
    year: '2026',
    summary:
      'An Airbnb-style short-stay rental marketplace for iOS and Android — KAVE Living for guests and hosts, and KAVE Ops for the operations team.',
    problem:
      'Guests need to find, book and pay for stays; hosts need to list and manage properties; and the operations team needs to inspect properties and handle service requests on site, often without a signal.',
    role: 'Lead developer at ZAPTA Technologies: architecture and build of both apps.',
    architecture:
      'KAVE Living is built from feature-first modules: every request goes through one API client with retries and token refresh, with TanStack Query for server state and Zustand for multi-step flows like booking. Bookings, Moyasar and Apple Pay payments, socket messaging, an AI concierge and add-on service requests share one REST backend, in English and Arabic (RTL). KAVE Ops is offline-first — inspections and service requests are queued in a local SQLite outbox and synced when the connection returns.',
    stack: [
      'Expo',
      'React Native',
      'TypeScript',
      'Expo Router',
      'TanStack Query',
      'Zustand',
      'Socket.IO',
      'Moyasar · Apple Pay',
      'SQLite offline sync',
      'Sentry',
    ],
    outcome: '', // TODO: add a concrete outcome
    figure: figures.kave,
    links: {},
  },
  {
    slug: 'liora',
    name: 'Liora',
    alias: 'Cycle-tracking app',
    showName: true,
    featured: true,
    own: true,
    category: 'Mobile',
    categories: ['Mobile', 'Web', 'Architecture'],
    summary: 'A cycle-tracking app for women and girls, on mobile and web.',
    problem:
      'Women and girls need a simple, private way to track their cycle, on their phone and on the web.',
    role: 'Product owner: architecture and the full-stack build.',
    architecture:
      'Mobile and web clients share one API. Accounts, cycle predictions and reminders are separate concerns over one data model, and reminders go out as push notifications.',
    stack: ['React Native', 'Expo', 'React', 'TypeScript', 'Node.js'], // TODO: verify
    outcome: '', // TODO: add a concrete outcome (users, launch status, store rating…)
    figure: figures.liora,
    links: {},
  },
  {
    slug: 'portfolio',
    name: 'This portfolio',
    alias: 'This portfolio',
    showName: true,
    featured: true,
    own: true,
    category: 'Web',
    categories: ['Web', 'Architecture'],
    year: '2026',
    summary:
      'The site you’re on: a prerendered React portfolio with live system diagrams and a physics playground.',
    problem: 'Show how I work — architecture, documentation and build — not just a list of skills.',
    role: 'Architecture and build, end to end.',
    architecture:
      'All content lives in one TypeScript file. A Vite build on Vercel prerenders both pages to static HTML, the edge network serves them, and React hydrates them in the browser. The contact form posts to Formspree.',
    stack: ['React 19', 'Vite', 'TypeScript', 'Tailwind CSS', 'Motion', 'matter.js', 'Vercel'],
    outcome:
      'Lighthouse 100 for accessibility, best practices and SEO, and 99 for mobile performance under real throttling.',
    figure: figures.portfolio,
    links: { live: 'https://mehtab-portfolio-vert.vercel.app' },
  },
  {
    slug: 'iscroll',
    name: 'ISCROLL',
    alias: 'Kiwi marketplace app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024',
    summary:
      'An online marketplace for New Zealanders: a safe place to buy and sell, with easy communication between traders.',
    problem: 'Kiwi buyers and sellers needed a safe place to trade and talk to each other.',
    role: 'React Native development.',
    architecture:
      'A React Native app using Redux and RTK Query for data and MMKV for a fast offline cache. Vehicle listings pull details from CarJam’s APIs.',
    stack: ['TypeScript', 'React Native', 'Redux', 'RTK Query', 'MMKV', 'CarJam APIs'],
    outcome: 'Live on the App Store and Google Play.',
    figure: figures.iscroll,
    links: {
      appStore: 'https://apps.apple.com/pk/app/isqroll/id6479675690',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.isqroll&hl=en',
    },
  },
  {
    slug: 'mish',
    name: 'MISH — Carpooling',
    alias: 'Carpooling app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2023',
    summary:
      'A ride-sharing app where people sign up as drivers or riders and book seats on trips.',
    problem:
      'Riders needed a simple way to find and pay for a seat on a trip someone was already driving.',
    role: 'React Native development.',
    architecture:
      'Rider and driver apps share one API for trips and seat bookings, with Google Maps for routes and a confirmed seat purchase before the trip.',
    stack: ['JavaScript', 'React Native', 'Redux Toolkit', 'Google Maps'],
    outcome: 'Live on the App Store and Google Play.',
    figure: figures.mish,
    links: {
      appStore: 'https://apps.apple.com/nz/app/mish-carpooling/id1661264457',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.mish',
    },
  },
  {
    slug: 'vigourme',
    name: 'VigourMe',
    alias: 'Anonymous health app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2021',
    summary: 'A healthcare app that makes intimate well-being support accessible and anonymous.',
    problem: 'People needed private, anonymous access to well-being support from their phone.',
    role: 'React Native development.',
    architecture:
      'A React Native app on Firebase: anonymous sign-in, Firestore for consultations, and cloud functions for triggers and push notifications.',
    stack: ['JavaScript', 'React Native', 'Redux', 'Firebase'],
    outcome: 'Published on Google Play.',
    figure: figures.vigourme,
    links: {
      googlePlay: 'https://play.google.com/store/apps/details?id=com.vigourmeconsultancy',
    },
  },
  {
    slug: 'outreach-agent',
    name: 'Business outreach agent',
    alias: 'Business outreach agent',
    showName: true,
    featured: false,
    own: true,
    category: 'Automation',
    categories: ['Automation', 'Web'],
    summary: 'An automated lead-generation agent that builds sample sites and sends outreach.',
    problem: 'Finding businesses and pitching each one by hand doesn’t scale.',
    role: 'Planned and built the whole pipeline.',
    architecture:
      'A pipeline that finds businesses, generates a sample website for each one, then sends personalised outreach with a link to it.',
    stack: ['Node.js', 'TypeScript'], // TODO: verify
    outcome: '', // TODO: add a concrete outcome
    figure: figures.outreach,
    links: {},
  },
  {
    slug: 'work-log',
    name: 'Work-log automation',
    alias: 'Work-log automation',
    showName: true,
    featured: false,
    own: true,
    category: 'Automation',
    categories: ['Automation', 'Documentation'],
    summary: 'Tooling that maintains dev logs and client meeting records.',
    problem: 'Keeping a client-facing record of work and meetings by hand is easy to skip.',
    role: 'Planned and built end to end.',
    architecture:
      'Work entries and meeting notes are captured in a structured log, then rendered into a report the client can read.',
    stack: ['Markdown', 'Node.js'], // TODO: verify
    outcome: '', // TODO: add a concrete outcome
    figure: figures.worklog,
    links: {},
  },
]

/* ───────────────────────────── Process ───────────────────────────── */

export type ProcessIcon = 'discover' | 'architect' | 'ship'

export interface ProcessStep {
  title: string
  icon: ProcessIcon
  description: string
  deliverables: string[]
}

export const processFlow = {
  heading: 'How I work',
  intro:
    'Most developers start at the last step. I start at the first, so the code is built on decisions that are already made and written down.',
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
  | 'redux'
  | 'tailwind'
  | 'nodejs'
  | 'nestjs'
  | 'postgresql'
  | 'mongodb'
  | 'firebase'
  | 'socketio'
  | 'webrtc'
  | 'nginx'
  | 'caddy'
  | 'git'
  | 'github'
  | 'githubactions'
  | 'fastlane'
  | 'vercel'

export interface Tech {
  name: string
  icon: TechIconKey
}

export const techStack = {
  heading: 'Tech stack',
  hint: 'Play with me — drag and throw',
  // Icons available: see TechIconKey above (add new ones in TechChip.tsx).
  items: [
    { name: 'React', icon: 'react' },
    { name: 'Next.js', icon: 'nextjs' },
    { name: 'React Native', icon: 'react' },
    { name: 'Expo', icon: 'expo' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'JavaScript', icon: 'javascript' },
    { name: 'Redux Toolkit', icon: 'redux' },
    { name: 'Tailwind CSS', icon: 'tailwind' },
    { name: 'Node.js', icon: 'nodejs' },
    { name: 'NestJS', icon: 'nestjs' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'MongoDB', icon: 'mongodb' },
    { name: 'Firebase', icon: 'firebase' },
    { name: 'Socket.IO', icon: 'socketio' },
    { name: 'WebRTC', icon: 'webrtc' },
    { name: 'Nginx', icon: 'nginx' },
    { name: 'Caddy', icon: 'caddy' },
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'GitHub Actions', icon: 'githubactions' },
    { name: 'Fastlane', icon: 'fastlane' },
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
   * Leave empty and the form tells visitors to email you instead.
   */
  formspreeId: 'xzedkaqa',
  projectTypes: [
    'Full-stack build',
    'Mobile app',
    'Architecture & documentation',
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
  // Newest first. Taken from the CV (public/resume.pdf).
  entries: [
    {
      year: 'Now',
      role: 'Senior React Native Developer',
      org: 'ZAPTA Technologies',
      summary:
        'Since September 2025. Leading two products end to end — the Bling luxury-watch marketplace and the KAVE short-stay rental apps — across mobile, dashboards and backend.',
    },
    {
      year: '2022–25',
      role: 'Senior React Native Developer & Team Lead',
      org: 'OutsourceNZ',
      summary:
        'Promoted to lead a team of 7 React Native developers and owned delivery end to end. Cut product-list render time by 75%.',
    },
    {
      year: '2022',
      role: 'Senior React Native Developer',
      org: 'OptimusFox',
      summary:
        'Built reliable real-time calling with WebRTC and custom ICE servers, plus in-app subscriptions and purchases on iOS and Android.',
    },
    {
      year: '2019–22',
      role: 'React Native Developer',
      org: 'Tribex Technology',
      summary:
        'Shipped apps to the App Store and Google Play, with CI/CD on Fastlane and GitHub Actions.',
    },
  ] satisfies ExperienceEntry[],
}
