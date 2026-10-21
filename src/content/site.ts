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
  jobTitle: 'Senior Full-Stack Engineer · Forward Deployed',
  pages: {
    '/': {
      title: 'Mehtab Ismail — Forward Deployed & Senior Full-Stack Engineer',
      description:
        'Forward deployed full-stack engineer: 30+ mobile, web, backend and AI products shipped since 2019, from client discovery and architecture to production.',
    },
    '/work/': {
      title: 'All work — Mehtab Ismail',
      description:
        'Case studies from Mehtab Ismail: full-stack builds, system architecture, technical documentation, audits and automation.',
    },
  },
  /** 1200×630 share image in /public */
  ogImage: '/og.png',
  ogImageAlt: 'Mehtab Ismail — Forward Deployed & Senior Full-Stack Engineer',
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
  roles: ['Forward Deployed Engineer', 'Senior Full-Stack Engineer', 'System Architect', 'AI Integration Engineer'],
  statement:
    'I work inside your business, find the real problem, and ship the system that solves it — from architecture to production.',
  secondaryCta: { label: 'See my work', target: 'work' },
}

/* ───────────────────────────── Book a call ───────────────────────────── */

export const booking = {
  label: 'Book a call',
  /**
   * Your Cal.com link, the part after cal.com/ — e.g. 'mehtabismail/intro'.
   * Connect Google Calendar in Cal.com and each booking gets a Google Meet link.
   * Leave empty and "Book a call" scrolls to the contact form instead.
   */
  calLink: 'mehtabismail/30min',
  /** shown next to the button in the Contact section */
  note: '30-minute intro call on Google Meet',
  /**
   * WhatsApp number in international format, digits only — e.g. '923001234567'.
   * Leave empty to hide the "Chat on WhatsApp" link.
   */
  whatsapp: '923060506402',
  whatsappMessage: 'Hi Mehtab, I found your portfolio and I’d like to talk about a project.',
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
    "I work the way a forward deployed engineer does: directly with clients, close to the problem and accountable for production. Since 2019 I've shipped 30+ products — React Native apps, Next.js platforms, NestJS and Node.js APIs, and AI features built on OpenAI and RAG — owning discovery, system architecture, third-party integrations, technical documentation and the handoff to the client's team.",
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
      'Express',
      'Prisma',
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
      'Redux Saga',
      'Socket.IO',
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
  /** leave out when the internals aren't known well enough to describe */
  architecture?: string
  stack: string[]
  /** leave empty ('') to hide the Outcome row until you have a real result */
  outcome: string
  /**
   * Optional cover image in /public, as a base path without extension, e.g. '/work/liora'.
   * `npm run covers` writes <base>-800.avif, <base>-1200.avif and a <base>.jpg fallback.
   */
  cover?: string
  /** what the cover screenshots show; picks the highlighted chip on /work */
  coverKind?: 'mobile' | 'web'
  /**
   * architecture drawing for the cover — see src/content/figures.ts. Optional:
   * without one (and without a cover image) the card shows a typographic cover.
   */
  figure?: SystemFigure
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
    category: 'Web',
    categories: ['Web', 'Mobile', 'Architecture', 'Documentation'],
    year: '2026',
    summary:
      'A curated marketplace for handmade objects: a buyer storefront, seller studio and admin on the web, a mobile app, and the API behind them.',
    problem:
      'Independent makers need a storefront that feels premium, with clear boundaries between makers, orders and payouts, and buyers need help finding the right piece.',
    role: 'Product owner: architecture, documentation and the full-stack build of all three apps.',
    architecture:
      'Three independent apps that share only an HTTP contract. A NestJS API (21 modules) on Postgres with Prisma and pgvector serves a Next.js web app — shop, seller studio and admin — and an Expo mobile app. Stripe handles payments, a BullMQ worker on Redis sends email and push, and Lume, an AI assistant built on OpenAI tool calls, finds products from a plain-language request and answers questions from a pgvector knowledge base.',
    stack: [
      'NestJS',
      'Prisma',
      'PostgreSQL · pgvector',
      'Redis · BullMQ',
      'Next.js',
      'Expo',
      'React Native',
      'Stripe',
      'OpenAI',
      'Playwright',
    ],
    outcome:
      'The web storefront and API are deployed, and contract and end-to-end tests run against a seeded backend in CI.',
    cover: '/work/arca',
    coverKind: 'web',
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
    outcome: 'Launched on the App Store in Saudi Arabia in June 2026.',
    cover: '/work/bling',
    coverKind: 'mobile',
    figure: figures.bling,
    links: {
      live: 'https://bling.sa',
      appStore: 'https://apps.apple.com/sa/app/bling-luxury/id6756652619',
    },
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
    outcome: 'KAVE Living launched on the App Store in Saudi Arabia in June 2026.',
    cover: '/work/kave',
    coverKind: 'mobile',
    figure: figures.kave,
    links: {
      live: 'https://kave.sa',
      appStore: 'https://apps.apple.com/sa/app/kave-living/id6762975609',
    },
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
    year: '2026',
    summary:
      'A private cycle tracker for women and girls on iOS, Android and the web, in English and Urdu.',
    problem:
      'Most cycle apps ask for an account and keep sensitive health data on their servers. Women and girls need a tracker that works without either, in their own language.',
    role: 'Product owner: architecture, documentation and the full-stack build of both apps.',
    architecture:
      'Two independent apps — Expo for iOS and Android, a static Next.js export for the web — that work fully without an account. Health data is encrypted on the device (AES-256 on phones, AES-GCM in the browser), and the optional Firebase backup only ever stores data it can’t read.',
    stack: [
      'Expo',
      'React Native',
      'Expo Router',
      'Next.js',
      'TypeScript',
      'MMKV',
      'IndexedDB · Web Crypto',
      'Firebase',
    ],
    outcome:
      'Built from a 683-screen design handoff: English and Urdu (right-to-left), light and dark, on phone and web.',
    cover: '/work/liora',
    coverKind: 'mobile',
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
    slug: 'lax-ferries',
    name: 'Lax Kw’alaams Ferries',
    alias: 'Ferry operations app',
    showName: true,
    featured: false,
    madeAt: 'ZAPTA Technologies',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2025–26',
    summary:
      'A staff app for the Lax Kw’alaams ferry service: ticket checks, boarding, ferry assignment and in-person sales, right from the dock.',
    problem:
      'Deck staff need to verify tickets, board passengers and sell fares on the spot, without paperwork.',
    role: 'Sole mobile developer at ZAPTA Technologies: built the whole staff app.',
    stack: ['Expo', 'React Native', 'Expo Router', 'TypeScript', 'Zustand'],
    outcome: 'Live on the App Store.',
    figure: figures.lax,
    links: { appStore: 'https://apps.apple.com/ca/app/lax-kwalaams-ferries/id6752282340' },
  },
  {
    slug: 'majlix',
    name: 'Majlix',
    alias: 'Market stats app',
    showName: true,
    featured: false,
    madeAt: 'ZAPTA Technologies',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2025–26',
    summary:
      'A markets app that brings trading and currency stats from third-party platforms into one place. It shows the numbers rather than placing trades.',
    problem:
      'Traders follow prices and stats across several platforms; one app that pulls them together saves the switching.',
    role: 'Mobile developer on the ZAPTA Technologies team.',
    architecture:
      'An Expo Router app on a NestJS API that aggregates market, currency and trading-platform data from third-party providers.',
    stack: ['Expo', 'React Native', 'Expo Router', 'Reanimated', 'TypeScript', 'NestJS'],
    outcome: 'Delivered to the client.',
    figure: figures.majlix,
    links: {},
  },
  {
    slug: 'extent',
    name: 'ExtEnt Events',
    alias: 'Social events app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile', 'Web'],
    year: '2025–26',
    summary:
      'A social events app — find events nearby, RSVP, add friends and follow their activity — where planners pay a subscription to keep their events live, with a web dashboard for the team.',
    problem:
      'Event-goers want to find events and see which friends are going; planners need their events seen; the team needs moderation, pricing, reports and user management.',
    role: 'Sole full-stack engineer, working directly with the client: the React Native app, the Node.js API and the admin dashboard.',
    architecture:
      'A React Native app (Redux Toolkit) and a Next.js admin dashboard share an Express API on MongoDB. Stripe runs planners’ subscriptions through signed webhooks, BullMQ on Redis sends push notifications and email, and the API runs on cPanel under Passenger.',
    stack: [
      'React Native',
      'Redux Toolkit',
      'Next.js',
      'TanStack Query',
      'Node.js',
      'Express',
      'MongoDB',
      'Stripe',
      'Redis',
      'BullMQ',
      'Firebase',
    ],
    outcome: 'In active development with the client.',
    figure: figures.extent,
    links: {},
  },
  {
    slug: 'fmb-toronto',
    name: 'FMB Toronto',
    alias: 'Community thaali app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2025–26',
    summary:
      'The thaali (community meal) app for the Dawoodi Bohra community in Toronto: schedules and menus, RSVPs, announcements, Fateha and Zabihat requests, and food ratings.',
    problem:
      'A community kitchen serving hundreds of families needs one place to share the menu, take RSVPs and requests, and hear back on the food.',
    role: 'Sole mobile developer: built the React Native app on the community’s existing API.',
    architecture:
      'A React Native app with Redux Toolkit and i18next on the community’s existing API, with OneSignal push for announcements.',
    stack: ['React Native', 'Redux Toolkit', 'i18next', 'OneSignal', 'Reanimated'],
    outcome: 'Live on the App Store and Google Play.',
    figure: figures.fmb,
    links: {
      appStore: 'https://apps.apple.com/ca/app/fmb-toronto/id1434854407',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.telkoware.fmb',
    },
  },
  {
    slug: 'myusta',
    name: 'myUSTA',
    alias: 'Home-services marketplace',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2025',
    summary:
      'Two apps for an Albanian-language home-services marketplace: one for homeowners to find local tradespeople, one for tradespeople to win more work.',
    problem:
      'Homeowners need trusted local tradespeople quickly; tradespeople need a steady flow of jobs without chasing leads.',
    role: 'Sole mobile developer: built both apps.',
    stack: ['React Native', 'TypeScript', 'Redux Toolkit', 'Reanimated'],
    outcome: 'Both apps are live on the App Store.',
    figure: figures.myusta,
    links: { appStore: 'https://apps.apple.com/app/id6758246269' },
  },
  {
    slug: 'referralpro',
    name: 'ReferralPro',
    alias: 'Business referral app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2025',
    summary:
      'A business referral network: people refer customers, partners and services to companies and earn rewards, while reps track every referral.',
    problem:
      'Word-of-mouth referrals are a strong source of business, but they’re rarely tracked or rewarded.',
    role: 'Designed and built the app on my own, working directly with the client.',
    architecture:
      'A React Native app on Firebase — Auth with Google and Facebook sign-in, Firestore for companies and referrals — with in-app purchases for plans.',
    stack: [
      'React Native',
      'Redux',
      'Firebase',
      'In-app purchases',
      'Google Sign-In',
      'Facebook Login',
    ],
    outcome: 'Delivered to the client.',
    figure: figures.referralpro,
    links: {},
  },
  {
    slug: 'devtinder',
    name: 'DevTinder',
    alias: 'Developer matching app',
    showName: true,
    featured: false,
    own: true,
    category: 'Web',
    categories: ['Web'],
    year: '2025',
    summary:
      'A web app for developers to find each other: profiles, matching and connection requests.',
    problem:
      'Developers looking for collaborators have no simple place to browse each other and connect.',
    role: 'Built the React frontend my own way; the backend follows NamasteDev’s Node.js course.',
    architecture:
      'A React 19 single-page app with TanStack Query for server data and Redux Toolkit for the signed-in user, on an Express API with MongoDB and JWT authentication in cookies.',
    stack: ['React', 'TanStack Query', 'Redux Toolkit', 'Tailwind CSS', 'DaisyUI', 'Node.js', 'Express', 'MongoDB'],
    outcome: '',
    cover: '/work/devtinder',
    coverKind: 'web',
    figure: figures.devtinder,
    links: {
      live: 'https://dev-tinder-web-ruddy.vercel.app',
      repo: 'https://github.com/mehtabismail/devTinder-web',
    },
  },
  {
    slug: 'istikhara',
    name: 'Istikhara',
    alias: 'Spiritual guidance app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024–25',
    summary:
      'A spiritual guidance app: describe the decision you’re facing, perform istikhara, and receive guidance according to Islamic tradition.',
    problem:
      'People seeking istikhara before a decision want a simple, private and trustworthy way to do it.',
    role: 'Mobile developer on the team.',
    architecture:
      'A React Native app with email, Google, Facebook and Apple sign-in on a JWT-secured API, a guided multi-step flow, Socket.IO chat, and a small staff side for attendance and shifts.',
    stack: [
      'React Native',
      'TypeScript',
      'Redux Toolkit',
      'Socket.IO',
      'MMKV',
      'i18next',
      'Apple · Google · Facebook sign-in',
    ],
    outcome: 'Delivered to the client.',
    figure: figures.istikhara,
    links: {},
  },
  {
    slug: 'safetycheck',
    name: 'SafetyCheck NZ',
    alias: 'Construction safety app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile', 'Web'],
    year: '2024–25',
    summary:
      'A health and safety system for small New Zealand construction businesses: site inductions with quizzes, contractor records, vehicle inspections and risk registers, on phone and web.',
    problem:
      'Small construction firms have to stay compliant with health and safety rules, but full safety systems cost too much and take too long to use.',
    role: 'Mobile developer: built the React Native app on the shared API.',
    architecture:
      'A React Native app and a Tailwind CSS web portal share one Node.js and Express API. Redux Toolkit and RTK Query manage data in the app, CarJam fills in vehicle details for inspections, and Branch.io handles deep links into the app.',
    stack: [
      'JavaScript',
      'React Native',
      'Redux Toolkit',
      'RTK Query',
      'Node.js',
      'Express',
      'Tailwind CSS',
      'CarJam APIs',
      'Branch.io',
    ],
    outcome: 'Released on the App Store and Google Play.',
    cover: '/work/safetycheck',
    coverKind: 'mobile',
    figure: figures.safetycheck,
    links: {},
  },
  {
    slug: 'isqroll',
    name: 'ISQROLL',
    alias: 'Kiwi marketplace app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile', 'Web'],
    year: '2024–25',
    summary:
      'An online marketplace for New Zealanders: a safe place to buy and sell, with easy communication between traders.',
    problem: 'Kiwi buyers and sellers needed a safe place to trade and talk to each other.',
    role: 'Team lead at OutsourceNZ.',
    architecture:
      'A React Native app using Redux and RTK Query for data and MMKV for a fast offline cache. Vehicle listings pull details from CarJam’s APIs.',
    stack: ['TypeScript', 'React Native', 'Redux', 'RTK Query', 'MMKV', 'CarJam APIs'],
    outcome: 'Released on the App Store and Google Play; still live on Google Play and the web.',
    cover: '/work/isqroll',
    coverKind: 'web',
    figure: figures.isqroll,
    links: {
      live: 'https://isqroll.co.nz',
      googlePlay: 'https://play.google.com/store/apps/details?id=com.isqroll&hl=en',
    },
  },
  {
    slug: 'ponataki',
    name: 'Ponataki',
    alias: 'Niuean language app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024–25',
    summary:
      'A language-learning app for Niuean, with simple lessons on everyday words and sentences, on mobile and online.',
    problem:
      'Carrying the Niue language to the next generation needs lessons that are simple and available on demand.',
    role: 'Team lead at OutsourceNZ.',
    stack: ['React Native', 'JavaScript'],
    outcome: '',
    cover: '/work/ponataki',
    coverKind: 'mobile',
    figure: figures.ponataki,
    links: {},
  },
  {
    slug: 'whou',
    name: 'WhoU',
    alias: 'Local social discovery app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024',
    summary:
      'A mobile app that connects people with like-minded users nearby and links straight to their Instagram profiles.',
    problem:
      'Meeting like-minded people nearby is hard when everyone’s profile lives on a different platform.',
    role: 'Mobile developer at OutsourceNZ: built the React Native app.',
    architecture:
      'A React Native app with Redux on an Express and MongoDB API that lists registered users within a radius of your location.',
    stack: ['React Native', 'Redux', 'JavaScript', 'Express', 'MongoDB'],
    outcome: 'Released on the App Store and Google Play.',
    cover: '/work/whou',
    coverKind: 'mobile',
    figure: figures.whou,
    links: {},
  },
  {
    slug: 'bookit',
    name: 'BookIt',
    alias: 'All-in-one booking app',
    showName: true,
    featured: false,
    madeAt: 'OptimusFox',
    category: 'Mobile',
    categories: ['Mobile', 'Web'],
    year: '2024',
    summary:
      'One app for booking almost anything: appointments, venues and tables, events and tickets.',
    problem: 'Booking a haircut, a table and an event ticket usually means three different apps.',
    role: 'Mobile developer at OptimusFox: built the React Native app on the team’s Node.js API.',
    stack: ['React Native', 'Redux Toolkit', 'Axios', 'Node.js'],
    outcome: 'Built as an MVP; not launched publicly.',
    figure: figures.bookit,
    links: {},
  },
  {
    slug: 'livestream',
    name: 'Live-streaming app',
    alias: 'Live-streaming app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024',
    summary:
      'A live-streaming app in the style of Bigo Live: go live, watch and explore streams, chat and send gifts, with notifications when someone goes live.',
    problem: 'The client wanted a social live-streaming product of their own.',
    role: 'Designed and built the app.',
    stack: [
      'React Native',
      'Redux Toolkit',
      'MMKV',
      'Vision Camera',
      'React Native Video',
      'FlashList',
      'WebRTC',
    ],
    outcome: 'Delivered; the client has since paused the project.',
    figure: figures.livestream,
    links: {},
  },
  {
    slug: 'safesigns',
    name: 'SafeSigns',
    alias: 'Safety-sign translation app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2024',
    summary: 'Photograph a health and safety sign and read what it means in your own language.',
    problem:
      'Workers and visitors from culturally and linguistically diverse backgrounds can’t always read the safety signs on New Zealand sites.',
    role: 'React Native development at OutsourceNZ.',
    architecture:
      'The app matches a photographed sign against a database of the health and safety signage used across New Zealand industries, then shows its meaning in the chosen language.',
    stack: ['React Native', 'Redux Toolkit', 'Node.js'],
    outcome: 'Live on the App Store.',
    cover: '/work/safesigns',
    coverKind: 'mobile',
    figure: figures.safesigns,
    links: { appStore: 'https://apps.apple.com/nz/app/safesignz/id6446236002' },
  },
  {
    slug: 'spouse',
    name: 'Spouse',
    alias: 'Matrimonial app',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2023–24',
    summary:
      'A matrimonial and matchmaking app for Muslims looking to marry: detailed profiles, likes and matches, and private conversations.',
    problem:
      'People looking for a spouse want serious, well-described profiles and a respectful way to connect.',
    role: 'React Native development.',
    architecture:
      'A React Native app with Redux Toolkit and RTK Query on the client’s REST API, Socket.IO for realtime conversations, and i18next for translations.',
    stack: ['React Native', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Socket.IO', 'i18next'],
    outcome: 'Delivered to the client.',
    figure: figures.spouse,
    links: {},
  },
  {
    slug: 'mybenefits',
    name: 'MyBeneFITs NZ',
    alias: 'Gym rewards app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2023',
    summary:
      'Rewards people for using the gym membership they already pay for: three visits a week unlock discount codes from online retailers.',
    problem:
      'People pay for gym memberships they don’t use; a reward for turning up keeps them going.',
    role: 'Team lead at OutsourceNZ.',
    stack: ['React Native', 'Node.js'],
    outcome: 'Released on the App Store.',
    cover: '/work/mybenefits',
    coverKind: 'mobile',
    figure: figures.mybenefits,
    links: {},
  },
  {
    slug: 'locumbridge',
    name: 'LocumBridge',
    alias: 'Healthcare staffing app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2023',
    summary:
      'A healthcare staffing app that connects locum professionals with practices that need cover.',
    problem:
      'Practices struggle to fill shifts, and locums to find the right work, through traditional staffing agencies.',
    role: 'Team lead at OutsourceNZ.',
    stack: ['React Native', 'JavaScript', 'Redux', 'Redux Thunk', 'i18next'],
    outcome: 'Live on the App Store.',
    cover: '/work/locumbridge',
    coverKind: 'mobile',
    figure: figures.locumbridge,
    links: { appStore: 'https://apps.apple.com/nz/app/locumbridge/id6461689669' },
  },
  {
    slug: 'lifevize',
    name: 'Lifevize',
    alias: 'Advice marketplace',
    showName: true,
    featured: false,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022–24',
    summary:
      'An advice marketplace: users post questions by category and approved advisers answer them in paid, timed chat sessions.',
    problem:
      'Getting expert advice quickly is hard; advisers need a way to be paid for their time.',
    role: 'React Native development.',
    architecture:
      'A React Native app on the client’s REST API, with Firebase for realtime chat and Stripe Connect for session payments and adviser payouts.',
    stack: ['React Native', 'Redux', 'Firebase', 'Stripe Connect', 'Axios'],
    outcome: '',
    figure: figures.lifevize,
    links: {},
  },
  {
    slug: 'aawhina',
    name: 'AawhinaNZ',
    alias: 'Family-harm support app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022–23',
    summary:
      'A free support app from Friendship House for whaanau who have experienced family and sexual harm.',
    problem:
      'People affected by family and sexual harm need an easy, private way to reach support from someone they feel comfortable with.',
    role: 'React Native development at OutsourceNZ.',
    stack: ['React Native', 'JavaScript', 'Node.js'],
    outcome: '',
    cover: '/work/aawhina',
    coverKind: 'mobile',
    figure: figures.aawhina,
    links: {},
  },
  {
    slug: 'mish',
    name: 'MISH — Carpooling',
    alias: 'Carpooling app',
    showName: true,
    featured: false,
    madeAt: 'OutsourceNZ',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022–23',
    summary:
      'A ride-sharing app where people sign up as drivers or riders and book seats on trips.',
    problem:
      'Riders needed a simple way to find and pay for a seat on a trip someone was already driving.',
    role: 'Team lead at OutsourceNZ.',
    architecture:
      'Rider and driver apps share one API for trips and seat bookings, with Google Maps for routes and a confirmed seat purchase before the trip.',
    stack: ['JavaScript', 'React Native', 'Redux Toolkit', 'Google Maps'],
    outcome: 'Released on the App Store and Google Play.',
    cover: '/work/mish',
    coverKind: 'mobile',
    figure: figures.mish,
    links: {},
  },
  {
    slug: 'vigourme',
    name: 'VigourMe',
    alias: 'Anonymous health app',
    showName: true,
    featured: false,
    madeAt: 'OptimusFox',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022',
    summary: 'A healthcare app that makes intimate well-being support accessible and anonymous.',
    problem: 'People needed private, anonymous access to well-being support from their phone.',
    role: 'React Native development at OptimusFox.',
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
    slug: 'dinisium',
    name: 'Dinisium',
    alias: 'Token investment app',
    showName: true,
    featured: false,
    madeAt: 'OptimusFox',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022',
    summary:
      'A crypto token investment app: buy the token, see holdings on a dashboard, model returns with a calculator, and manage subscriptions.',
    problem:
      'Investors in a token project need a simple mobile way to buy in and follow their holdings.',
    role: 'React Native development at OptimusFox.',
    stack: ['React Native', 'Redux Toolkit', 'Web3 wallet', 'React Navigation'],
    outcome: 'Delivered to the client.',
    figure: figures.dinisium,
    links: {},
  },
  {
    slug: 'noyz',
    name: 'NOYZ',
    alias: 'Music NFT app',
    showName: true,
    featured: false,
    madeAt: 'OptimusFox',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022',
    summary:
      'A music NFT app: artists release music, fans stream it in a social feed, buy and sell music NFTs, and keep them in a personal vault.',
    problem: 'Artists want new ways to sell their music, and fans want to own a piece of it.',
    role: 'React Native development at OptimusFox.',
    stack: [
      'React Native',
      'Redux Toolkit',
      'Blockchain wallet',
      'Audio streaming',
      'Google · Facebook sign-in',
    ],
    outcome: 'Delivered to the client.',
    figure: figures.noyz,
    links: {},
  },
  {
    slug: 'crypto-exchange',
    name: 'Crypto exchange app',
    alias: 'Crypto exchange app',
    showName: true,
    featured: false,
    madeAt: 'OptimusFox',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022',
    summary:
      'A crypto exchange and wallet app: hold crypto, trade on an order book, follow markets and top up from a bank account.',
    problem:
      'Trading and funding usually happen in separate places; this brings wallets, trading and banking together.',
    role: 'React Native development at OptimusFox.',
    stack: ['React Native', 'Redux Toolkit', 'React Navigation'],
    outcome: '',
    figure: figures.exchange,
    links: {},
  },
  {
    slug: 'restro',
    name: 'Restro',
    alias: 'Restaurant booking app',
    showName: true,
    featured: false,
    madeAt: 'Tribex Technologies',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022',
    summary: 'Discover restaurants and hotels, browse menus, book a table and leave feedback.',
    problem: 'Diners want to find a place, see the menu and reserve a table in one go.',
    role: 'React Native development at Tribex Technologies.',
    architecture:
      'A React Native app with Firebase Auth (phone, Google and Facebook) on the restaurants’ API: discovery and search, menus with modifiers and pairings, table booking by date and time, and feedback.',
    stack: ['React Native', 'Firebase', 'Google · Facebook sign-in', 'Axios'],
    outcome: 'Delivered to the client.',
    figure: figures.restro,
    links: {},
  },
  {
    slug: 'fitness',
    name: 'Fitness tracker',
    alias: 'Fitness tracker',
    showName: true,
    featured: false,
    own: true,
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2022–23',
    summary: 'A personal workout and BMI tracker with an exercise library and progress history.',
    problem: 'A simple way to follow workouts and BMI over time.',
    role: 'Designed and built it.',
    stack: ['React Native', 'Redux Toolkit', 'Firebase', 'Reanimated'],
    outcome: '',
    figure: figures.fitness,
    links: {},
  },
  {
    slug: 'grow',
    name: 'Grow',
    alias: 'Baby care tracker',
    showName: true,
    featured: false,
    madeAt: 'Tribex Technologies',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2021–23',
    summary:
      'A baby care tracker for parents: log feeds, pumping, bottles, sleep, diapers and solids for each child, with a parent community and resources.',
    problem: 'New parents need an easy way to keep track of every feed, nap and change.',
    role: 'React Native development at Tribex Technologies.',
    stack: ['React Native', 'Redux Toolkit', 'React Navigation'],
    outcome: 'Delivered to the client.',
    figure: figures.grow,
    links: {},
  },
  {
    slug: 'arms',
    name: 'ARMS membership app',
    alias: 'Loyalty membership app',
    showName: true,
    featured: false,
    madeAt: 'Tribex Technologies',
    category: 'Mobile',
    categories: ['Mobile'],
    year: '2021',
    summary:
      'A retail loyalty app: member card and points, vouchers and coupons, promotions and an e-brochure, an online shop, outlet locations, referrals and scan & pay.',
    problem: 'A retail brand wanted one app to reward members and bring them back to its outlets.',
    role: 'React Native development at Tribex Technologies.',
    stack: ['React Native', 'React Native Maps', 'React Native Video', 'i18n'],
    outcome: '',
    figure: figures.arms,
    links: {},
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
    summary:
      'An agent skill for Claude Code and Cursor that keeps a client-facing work log and meeting record, and builds one HTML report from them.',
    problem: 'Keeping a client-facing record of work and meetings by hand is easy to skip.',
    role: 'Planned and built end to end.',
    architecture:
      'Work entries and meeting notes are captured in a structured log, then rendered into a report the client can read.',
    year: '2026',
    stack: ['Python', 'Claude Code', 'Cursor', 'Markdown'],
    outcome: '', // TODO: add a concrete outcome
    figure: figures.worklog,
    links: { repo: 'https://github.com/mehtabismail/project-journal' },
  },
  {
    slug: 'rn-boilerplate',
    name: 'React Native boilerplate',
    alias: 'React Native boilerplate',
    showName: true,
    featured: false,
    own: true,
    category: 'Mobile',
    categories: ['Mobile', 'Architecture'],
    year: '2022–24',
    summary:
      'Open-source React Native templates that start a new app with navigation, Redux Toolkit, RTK Query and validation already wired up.',
    problem:
      'Every new app repeats the same setup; a documented template starts projects on solid ground.',
    role: 'Author and maintainer.',
    architecture:
      'Business logic is kept apart from the UI, and every piece is documented. Start a new app from it with `npx react-native init AppName --template`.',
    stack: ['React Native', 'TypeScript', 'React Navigation', 'Redux Toolkit', 'RTK Query'],
    outcome: '',
    figure: figures.boilerplate,
    links: { repo: 'https://github.com/mehtabismail/RNBoilerplate' },
  },
  {
    slug: 'medical-records-blockchain',
    name: 'Medical records on blockchain',
    alias: 'Medical records on blockchain',
    showName: true,
    featured: false,
    own: true,
    category: 'Web',
    categories: ['Web'],
    year: '2021–22',
    summary:
      'Final-year project at The University of Lahore: a medical report system that stores records on a blockchain.',
    problem: 'Medical reports need a history that can’t be quietly changed after the fact.',
    role: 'Final-year project: design and build.',
    stack: ['React', 'Web3.js', 'Solidity', 'Truffle', 'Tailwind CSS'],
    outcome: '',
    figure: figures.medical,
    links: { repo: 'https://github.com/mehtabismail/FypTest' },
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
      org: 'Tribex Technologies',
      summary:
        'Shipped apps to the App Store and Google Play, with CI/CD on Fastlane and GitHub Actions.',
    },
  ] satisfies ExperienceEntry[],
  education: {
    degree: 'BS Software Engineering',
    school: 'The University of Lahore',
    years: '2017–2021',
    note: 'CGPA 3.4',
  },
  certifications: [
    { name: 'React deep dive', issuer: 'NamasteDev', year: '2025' },
    { name: 'React.js — verified skill badge', issuer: 'LinkedIn' },
    { name: 'React Native with Redux & Hooks', issuer: 'Udemy', year: '2020' },
    { name: 'React Native app development', issuer: 'Udemy', year: '2020' },
  ],
}
