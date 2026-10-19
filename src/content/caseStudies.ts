/**
 * Long-form case studies for the /work/<slug>/ pages, keyed by project slug.
 * A project without an entry still gets a page built from its fields in
 * site.ts (summary, problem, role, architecture, stack, outcome).
 *
 * Every fact here comes from the project's own code, docs or handover notes.
 * Don't add numbers that can't be traced back to one of those.
 */
import shots from './shots.json' with { type: 'json' }

export type ShotName = keyof typeof shots

export interface Point {
  title: string
  body: string
}

export interface Decision {
  title: string
  /** why this was the right call */
  why: string
  /** what it costs, said plainly */
  tradeoff?: string
}

export interface Result {
  /** big figure, e.g. "1,000+"; leave out for a plain statement */
  value?: string
  label: string
}

export interface CaseStudy {
  /** one-sentence hook under the page title */
  headline: string
  /** extra rows for the facts strip (role, year and origin come from the project) */
  facts?: { label: string; value: string }[]
  /** the situation: who it's for and why it exists */
  context: string[]
  /** what made it hard */
  challenges: Point[]
  /** the main pieces I built */
  built?: Point[]
  /** decisions with the reasoning behind them */
  decisions?: Decision[]
  results?: Result[]
  /** what I'd carry into the next project */
  lessons?: string[]
}

export interface Shot {
  name: ShotName
  caption: string
}

export const caseStudies: Record<string, CaseStudy> = {
  arca: {
    headline:
      'Rebuilding a marketplace as three independent apps, and finding a live security hole before it was used.',
    facts: [
      { label: 'Apps', value: 'Web, mobile, API' },
      { label: 'Backend', value: '21 NestJS modules' },
      { label: 'Tests', value: '1,000+ automated' },
    ],
    context: [
      'ARCA is a curated marketplace for handmade objects. Buyers shop on the web or in the app, makers run their storefronts from a seller studio, and an admin console runs the platform.',
      'Its first version lived in a Turborepo monorepo on Supabase. Before changing anything, I audited all of it: about 100 features, the 22-table schema, roughly 125 API routes and every place Supabase was used. The audit decided the plan. Supabase was doing less than expected, because every data call already went through the NestJS API. But it held the auth, the file storage and a serious risk.',
    ],
    challenges: [
      {
        title: 'A security hole in the live system',
        body: 'The database’s row-level security let users update their own rows without limiting which columns. With their own token and the public key, a signed-in buyer could in principle make themselves an admin, verify their own seller account or approve their own identity check. I flagged it to be patched right away, separately from the rebuild.',
      },
      {
        title: 'Identity documents in a public bucket',
        body: 'Sellers’ ID scans and selfies sat in the same public bucket as product photos, and bank account numbers were stored in plain text.',
      },
      {
        title: 'No safety net',
        body: 'The API had 30 unit tests. The web and mobile apps had none, and there were no integration or end-to-end tests. Any rewrite could quietly drop behaviour.',
      },
      {
        title: 'Three apps, one set of types',
        body: 'Removing the shared types package meant three copies of the API types that could drift apart without anyone noticing.',
      },
    ],
    built: [
      {
        title: 'Own authentication',
        body: 'Supabase Auth replaced with bcrypt, its own JWTs and rotating refresh tokens with reuse detection. The web keeps the refresh token in an httpOnly cookie and the phone keeps it in SecureStore. Google sign-in now runs in the backend with PKCE.',
      },
      {
        title: 'Private file storage',
        body: 'Cloudflare R2 with a public bucket for catalogue images and a private one for identity documents, read only through short-lived signed links. Bank account numbers are encrypted with AES-256-GCM.',
      },
      {
        title: 'Checkout that holds under pressure',
        body: 'Stripe and cash on delivery. Stock claims and coupon redemptions stay correct when several buyers check out at once, and a test races six redemptions against a limit of two.',
      },
      {
        title: 'Lume, the shopping assistant',
        body: 'OpenAI tool calls search the catalogue and a pgvector knowledge base of 40 passages about how ARCA works. Without a model, it falls back to full-text search.',
      },
    ],
    decisions: [
      {
        title: 'Keep NestJS and add a repository layer',
        why: 'Rewriting 9,700 lines of working, partly tested business logic in Express would add risk and nothing a user could see. A repository layer gave the clean routes → services → repositories layering the brief asked for.',
        tradeoff: 'More framework than the smallest possible backend.',
      },
      {
        title: 'Share a contract, not code',
        why: 'Each app installs, builds, tests and deploys on its own. Each client keeps its own API types, and contract tests check them against the running API in CI.',
        tradeoff: 'The types are written more than once. Tests keep them honest, not the compiler.',
      },
      {
        title: 'Fix bugs instead of porting them',
        why: 'The audit found that checkout ignored product variants, so a buyer picking a pricier option paid the base price, and that a coupon’s last use could be redeemed twice. Each fix got a test that fails against the old behaviour.',
      },
      {
        title: 'Run everything on one ARM server',
        why: 'An always-free cloud machine runs the API, the job worker, the website, Postgres with pgvector and Redis. It has nightly backups to R2 and a rollback copy kept before every deploy.',
        tradeoff:
          'It is one machine. The backups and rollback copies are what make that acceptable at this stage.',
      },
    ],
    results: [
      {
        value: '1,000+',
        label: 'automated tests: unit, integration, contract and Playwright journeys',
      },
      { value: '93%', label: 'line coverage from the backend integration suite' },
      { value: '~70 s', label: 'of API downtime to move all hosting to a new server' },
      { value: '41/45', label: 'evaluation questions Lume answers correctly, even with no model' },
    ],
    lessons: [
      'Audit before you migrate. The most valuable finding, a live security hole, had nothing to do with the migration.',
      'Tests that call the real HTTP API catch the drift that a shared types package only hides.',
    ],
  },

  bling: {
    headline:
      'A luxury-watch marketplace for Saudi Arabia, where trust is the product: checked listings, negotiated prices, instalments and tracked delivery.',
    facts: [
      { label: 'Platforms', value: 'iOS app + 2 web portals' },
      { label: 'Languages', value: 'Arabic & English' },
      { label: 'Launched', value: 'June 2026' },
    ],
    context: [
      'Bling lets people in Saudi Arabia buy and sell luxury watches. Dealers sell through company stores on a web portal. Individuals sell from the mobile app once they pass a national identity check. Bling’s team approves every listing before buyers can see it.',
      'At this price, buyers need proof before they pay. Each listing is reviewed against live market prices and can be sent for an outside authenticity check. Every sale passes through Bling’s own centre before it reaches the buyer.',
    ],
    challenges: [
      {
        title: 'One person, several roles',
        body: 'A buyer can become a seller after a Nafath identity check without losing their buyer account. Company sellers can only be created by Bling and can only sign in on the web. The user model had to allow both without letting one account be both kinds of seller.',
      },
      {
        title: 'Negotiation with rules',
        body: 'Buyers can make an offer, but never above the asking price. Sellers can counter, but never below the buyer’s last offer. A negotiated price can’t take a promo code on top.',
      },
      {
        title: 'Many ways to pay',
        body: 'Card, Apple Pay, Tabby and Tamara pay-in-four, and a Bling wallet, all with ZATCA e-invoicing.',
      },
      {
        title: 'Two delivery legs, then payout',
        body: 'DHL collects from the seller and brings the watch to Bling’s centre for checks. A second DHL leg takes it to the buyer or a gift recipient. Only then is the seller paid to their bank account.',
      },
    ],
    built: [
      {
        title: 'The buyer and seller app',
        body: 'Expo and React Native with Redux Toolkit and RTK Query, in Arabic (right to left) and English: browsing, wishlists, offers, checkout, chat and seller listings.',
      },
      {
        title: 'Admin and partner portals',
        body: 'Next.js dashboards where Bling’s team creates stores, reviews listings, clears orders and pays sellers, and where company stores list stock one item at a time or by spreadsheet.',
      },
      {
        title: 'The backend and its integrations',
        body: 'A NestJS API on Postgres with Prisma, Socket.IO chat, and Redis and pg-boss for background jobs. It connects to DHL for both delivery legs, Entrupy and LegitGrails for authenticity, WatchCharts for market prices, and the payment providers.',
      },
      {
        title: 'A playable map of the business',
        body: 'For the client handover I mapped the whole platform as one step-numbered flow, then turned it into an interactive simulation with six swim lanes (admin, company seller, buyer, individual seller, Bling Center and DHL, money) and five chapters you can play, pause and step through.',
      },
    ],
    decisions: [
      {
        title: 'Document how it runs, not how it was specced',
        why: 'The client isn’t technical. A four-minute simulation explains two full orders, both kinds of seller and every payment method better than a long document would, and its step numbers match the written flow.',
      },
      {
        title: 'Roles scoped to a store, with personal overrides',
        why: 'What a person can do comes from roles, each tied to the whole platform or to one company store, plus permissions added or removed for that person. That covers buyer-turned-seller, store staff and Bling’s team with one person record.',
      },
      {
        title: 'Write the engineering rules down',
        why: 'The app follows 29 short architecture documents covering layers, dependency rules, API contracts, error handling, testing and a code-review checklist, so new developers can work the same way.',
        tradeoff: 'The documents have to be kept up to date as the code changes.',
      },
    ],
    results: [
      { value: 'June 2026', label: 'launched on the App Store in Saudi Arabia' },
      { value: '5', label: 'ways to pay: card, Apple Pay, Tabby, Tamara and wallet' },
      { value: '2', label: 'DHL legs per order, booked from the platform' },
      { value: '4 min', label: 'interactive walkthrough of the whole business for the client' },
    ],
  },

  kave: {
    headline:
      'Two apps for a Saudi short-stay rental company: one for guests and hosts, and one for the team on the ground that keeps working without a signal.',
    facts: [
      { label: 'Apps', value: 'KAVE Living, KAVE Ops' },
      { label: 'Platforms', value: 'iOS & Android' },
      { label: 'Languages', value: 'English & Arabic' },
    ],
    context: [
      'KAVE runs short-stay rentals in Saudi Arabia. In KAVE Living, guests find, book and pay for stays, and hosts list and manage their properties. KAVE Ops is for the operations team, who inspect properties and handle service requests on site.',
      'Before the first release to real users, I ran a production-readiness audit of KAVE Living. It found 28 issues, from payments to privacy, each with its evidence. I worked through them with the client before launch.',
    ],
    challenges: [
      {
        title: 'Payments that must never charge twice',
        body: 'With 3-D Secure, a bank could approve a payment while the app reported a failure, and tapping retry would charge the card again. The audit marked it as a launch blocker.',
      },
      {
        title: 'Retries that multiplied',
        body: 'Both the API client and TanStack Query retried failed requests. One failing request could make up to 9 attempts over about 21 seconds behind a spinner, and the request timeout was 200 seconds. In an outage, every phone made the load on the server nine times worse.',
      },
      {
        title: 'Inspections without a signal',
        body: 'Operations staff work inside buildings with poor coverage, but an inspection can’t wait for a signal.',
      },
      {
        title: 'Private data on a shared phone',
        body: 'Tokens, payout accounts, host ID documents and messages must not be left on the device where another app or a backup could read them.',
      },
    ],
    built: [
      {
        title: 'KAVE Living',
        body: 'Feature-first modules sharing one API client with token refresh. TanStack Query holds server state and Zustand runs multi-step flows like booking. Moyasar and Apple Pay payments, socket messaging, an AI concierge and add-on service requests, in English and Arabic (right to left).',
      },
      {
        title: 'KAVE Ops, offline-first',
        body: 'Inspections and service requests are saved to a local SQLite outbox and sent when the connection returns, so staff can finish their work on site.',
      },
      {
        title: 'A safe release path',
        body: 'A remote minimum-version gate (“Update KAVE”), a rollback runbook, and Sentry error tracking that receives only the user’s id.',
      },
    ],
    decisions: [
      {
        title: 'One layer owns retries',
        why: 'Only the API client retries now: once, for reads, and only after network errors, timeouts or server errors. It never retries a rate limit (429). TanStack Query doesn’t retry at all, and the timeout is 60 seconds.',
        tradeoff:
          'A flaky request fails sooner, and the user sees a retry button instead of a frozen spinner.',
      },
      {
        title: 'Remember the verified payment',
        why: 'Once the bank approves, the app keeps the verified payment id. Tapping Confirm again only re-sends the confirmation, with no new card token and no second charge. Changing the dates or services makes it a new payment.',
      },
      {
        title: 'Nothing private written to disk',
        why: 'Tokens and saved passwords never go into plain storage, and payouts, profiles, bookings, messages and ID documents are no longer cached on the device. Users are logged out only when the server actually rejects their refresh token.',
      },
      {
        title: 'Record decisions as ADRs',
        why: 'Twelve architecture decision records explain the important choices, such as module structure, response envelope, token storage and payments, so the next developer knows why, not just what.',
      },
    ],
    results: [
      { value: 'June 2026', label: 'KAVE Living launched on the App Store in Saudi Arabia' },
      { value: '21', label: 'of 28 audit findings fixed before the first real-user release' },
      { value: '364', label: 'automated tests passing at release' },
      { value: '9 → 2', label: 'most attempts a failing request can make' },
    ],
  },

  liora: {
    headline:
      'A cycle tracker that never needs an account and never lets a server read your health data.',
    facts: [
      { label: 'Platforms', value: 'iOS, Android, web' },
      { label: 'Languages', value: 'English & Urdu (RTL)' },
      { label: 'Design', value: '683-screen handoff' },
    ],
    context: [
      'Liora is for women and girls who track periods, are trying to conceive, are pregnant, take the pill or are going through menopause, in English or Urdu. Most cycle apps ask for an account and keep this data on their servers. Liora works fully without one.',
      'I built both apps, a phone app and a web app, from a 683-screen design handoff, plus a 100-screen follow-up for restore, forgotten PIN and sharing. I kept a dated log of every product and technical decision along the way.',
    ],
    challenges: [
      {
        title: 'Private by design, not by promise',
        body: 'The server must not be able to read anything, including backups and links shared with a doctor.',
      },
      {
        title: 'A lock that holds',
        body: 'A PIN lock on phone and web with a decoy PIN, a growing wait after wrong tries that survives reloads and restarts, and a way back in if the PIN is forgotten.',
      },
      {
        title: 'Urdu, right to left',
        body: 'Mirrored layouts, Urdu fonts that still show English words in Liora’s Latin fonts, and a language switch that reloads the phone app once without ever looping.',
      },
      {
        title: 'Two apps, no shared code',
        body: 'By decision, the phone and web apps are separate repos. The core logic is copied into both and kept identical, with the same tests in each.',
      },
    ],
    built: [
      {
        title: 'Encrypted storage on the device',
        body: 'On phones, MMKV with AES-256 and keys in the Keychain or Keystore. On the web, IndexedDB with AES-GCM under a browser key that can’t be exported.',
      },
      {
        title: 'Backup the server can’t read',
        body: 'A 12-word recovery key wraps a random backup key. Firebase stores only the encrypted data and the wrapped key, and wrong words fail on the device without any network call.',
      },
      {
        title: 'Share with a doctor',
        body: 'A summary link whose key is in the part of the URL after the #, which browsers never send to a server. Links expire, can be revoked, and are removed once they end.',
      },
      {
        title: 'App lock and recovery',
        body: 'The PIN is stored as a PBKDF2 verifier, never the PIN itself. Wrong tries wait 5, then 10, 20 and 40 minutes, up to an hour. There’s a hold-to-erase option and a real WebAuthn passkey on the web.',
      },
    ],
    decisions: [
      {
        title: 'Local-first, account optional',
        why: 'The safest health data is data that never leaves the phone. Backup is opt-in, and it only ever uploads data the server can’t read.',
        tradeoff: 'There are no server-side features, and restoring depends on her 12 words.',
      },
      {
        title: 'Native crypto where JavaScript is too slow',
        why: 'In JavaScript on the phone, 20,000 PBKDF2 rounds took 6.3 seconds. A small native module (CommonCrypto on iOS, Android’s own PBKDF2) runs the archive’s 310,000 rounds in a fraction of a second.',
      },
      {
        title: 'Stay on Firebase’s free plan',
        why: 'Automatic expiry of old records needs a paid plan, so ended share links are cleaned up another way. The rules let anyone delete a link that has already ended, and the app and the share page remove ended links when they open.',
        tradeoff: 'More code than a single expiry setting.',
      },
      {
        title: 'Built for review, not just for release',
        why: 'Medical text was written from NHS, NICE, FSRH and WHO guidance and marked for a doctor’s sign-off. The Urdu was marked for a native speaker’s review.',
      },
    ],
    results: [
      { value: '683', label: 'designed screens built, in two languages, light and dark' },
      { value: '3', label: 'platforms from two codebases: iOS, Android and the web' },
      { value: '0', label: 'health data any server can read' },
      { value: '310k', label: 'PBKDF2 rounds protecting each exported archive' },
    ],
  },

  portfolio: {
    headline:
      'A portfolio drawn like a set of technical drawings, with a system diagram for every project and every page prerendered for speed.',
    context: [
      'People hiring a freelancer want to see how they think, not a list of skills. This site leads with architecture: every project has a system diagram, and each one has its own case study.',
    ],
    challenges: [
      {
        title: 'Showing architecture without images',
        body: 'Every project needed its own system diagram, consistent in style, sharp at any size and quick to change.',
      },
      {
        title: 'Rich motion without a slow page',
        body: 'Animated diagrams, a physics playground and smooth scrolling still had to pass Lighthouse on a throttled phone.',
      },
      {
        title: 'Client names stay private until approved',
        body: 'All the content ships in the page’s JavaScript, so a client name hidden on screen could still leak through the code.',
      },
    ],
    built: [
      {
        title: 'A diagram engine',
        body: 'Each diagram is described as data: tiers, lanes, nodes and edges. A layout step places the boxes and routes the connectors, then they draw themselves in as you scroll.',
      },
      {
        title: 'Prerendered pages',
        body: 'At build time, every page, including each case study, is rendered to static HTML with its own title, description, share image and structured data. React then takes over in the browser.',
      },
      {
        title: 'A physics tech-stack pit',
        body: 'Built on matter.js. The tech chips can be dragged and thrown.',
      },
    ],
    decisions: [
      {
        title: 'Diagrams as data, not images',
        why: 'One TypeScript type describes every diagram, so they stay consistent, can be edited in code, scale perfectly and add almost nothing to download.',
        tradeoff: 'Layouts are limited to a simple grid of up to three columns.',
      },
      {
        title: 'Privacy enforced by the type system',
        why: 'A project marked hidden can’t carry its real name, because TypeScript rejects the build, so a name can’t leak into the bundle by mistake.',
      },
      {
        title: 'Load heavy things only when needed',
        why: 'The booking popup’s script loads on the first click, diagrams draw only when they come near the screen, and animation features load in the background.',
      },
    ],
    results: [
      { value: '100', label: 'Lighthouse accessibility, best practices and SEO' },
      { value: '99', label: 'Lighthouse mobile performance under real throttling' },
      { value: '1.6 s', label: 'largest paint on a throttled phone' },
    ],
  },
}

/** Screens for each project's gallery, from public/work/shots (`npm run shots`). */
export const galleries: Record<string, Shot[]> = {
  arca: [
    { name: 'arca-web-home', caption: 'The storefront home page' },
    { name: 'arca-web-p202', caption: 'A product page' },
  ],
  bling: [
    { name: 'bling-home', caption: 'Home: today’s market and newly authenticated watches' },
    { name: 'bling-shop', caption: 'Shop, with filters by category, gender and brand' },
    {
      name: 'bling-detail',
      caption: 'A listing verified by Nafath, with the price and add to cart',
    },
  ],
  kave: [
    {
      name: 'kave-detail',
      caption: 'A property with its amenities, KAVE services and price per night',
    },
    { name: 'kave-assistant', caption: 'The AI assistant for finding stays and planning trips' },
  ],
  liora: [
    { name: 'liora-welcome', caption: 'Welcome, with English and Urdu' },
    {
      name: 'liora-4',
      caption: 'For every stage: periods, conceiving, pregnancy, the pill, menopause',
    },
    { name: 'liora-private', caption: 'No account needed, with an app lock and one-step delete' },
    { name: 'liora-range', caption: 'Predictions shown as a range, not a single date' },
  ],
  safetycheck: [
    { name: 'safetycheck-onboarding', caption: 'Onboarding' },
    {
      name: 'safetycheck-home',
      caption: 'Home: requests, resources, emergency services and activity',
    },
    { name: 'safetycheck-vehicles', caption: 'Vehicle inspections and their status' },
  ],
  isqroll: [
    { name: 'isqroll-web-home', caption: 'The ISQROLL website' },
    { name: 'isqroll-store', caption: 'Selling a car: set an asking price or run an auction' },
  ],
  mish: [
    { name: 'mish-web-home', caption: 'The Mish website' },
    { name: 'mish-store', caption: 'Starting a ride as rider or driver' },
  ],
  locumbridge: [
    { name: 'locumbridge-match', caption: 'Matched locums for a pharmacy' },
    { name: 'locumbridge-jobs', caption: 'A pharmacy’s posted jobs' },
    { name: 'locumbridge-calendar', caption: 'Scheduling on the calendar' },
  ],
  mybenefits: [
    { name: 'mybenefits-welcome', caption: 'Sign in' },
    { name: 'mybenefits-workout', caption: 'A timed workout' },
    { name: 'mybenefits-faq', caption: 'Frequently asked questions' },
  ],
  ponataki: [
    { name: 'ponataki-home', caption: 'Home: learning units and learn-while-playing' },
    { name: 'ponataki-unit', caption: 'A unit with video lessons' },
    { name: 'ponataki-quiz', caption: 'A unit quiz with audio' },
  ],
  safesigns: [
    { name: 'safesigns-splash', caption: 'Splash screen' },
    { name: 'safesigns-language', caption: 'Choosing a language' },
    { name: 'safesigns-home', caption: 'Sign categories and recently scanned signs' },
  ],
  whou: [
    { name: 'whou-welcome', caption: 'Welcome' },
    { name: 'whou-matching', caption: 'Searching for people nearby' },
  ],
  aawhina: [
    { name: 'aawhina-support', caption: 'Support services' },
    { name: 'aawhina-map', caption: 'Finding services on the map' },
  ],
  devtinder: [
    { name: 'devtinder-signin', caption: 'Sign in' },
    { name: 'devtinder-feed', caption: 'The developer feed' },
  ],
}

export const shotSize = (name: ShotName) => shots[name]
