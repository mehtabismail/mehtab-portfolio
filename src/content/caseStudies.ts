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

  safetycheck: {
    headline:
      'A construction safety app built for the site, not the office: inductions, inspections and risk records that hold up in an audit.',
    facts: [{ label: 'Platform', value: 'iOS and Android' }],
    context: [
      'SafetyCheck NZ is a health and safety system for small New Zealand construction businesses. Full safety platforms cost too much and take too long to use, so smaller firms end up on paper forms and spreadsheets that are hard to prove in an audit.',
      'The product has a web portal for the office and a mobile app for the people on site, both on one Node.js and Express API. I built the mobile app: site inductions with quizzes, contractor records, vehicle inspections and risk registers.',
    ],
    challenges: [
      {
        title: 'Used on site, not at a desk',
        body: 'Workers open the app on construction sites where mobile coverage is weak, often with gloves on and little time. Every flow had to be short and forgiving of a slow connection.',
      },
      {
        title: 'Records that count as proof',
        body: 'An induction or inspection is only useful if it can be shown later. Each one had to be tied to a person, a site and a time, so the business can prove compliance when asked.',
      },
      {
        title: 'Different people, different jobs',
        body: 'Business owners, their workers and outside contractors all use the same app but need different screens and permissions.',
      },
      {
        title: 'Vehicle data from an outside service',
        body: 'Vehicle inspections depend on CarJam for registration and warrant details, so the app had to handle slow or missing lookups without blocking the inspection.',
      },
    ],
    built: [
      {
        title: 'Inductions with quizzes',
        body: 'Workers and contractors go through a site induction and answer a quiz, and the result is recorded against them.',
      },
      {
        title: 'Vehicle inspections',
        body: 'Enter a plate and CarJam fills in the vehicle, then the inspection checklist is completed and saved with its status.',
      },
      {
        title: 'Contractor records and risk registers',
        body: 'Contractor details and site risks are kept in one place and shared with the web portal through the same API.',
      },
      {
        title: 'Deep links into the app',
        body: 'Branch.io links open the right screen in the app, so an invite lands the person where they need to be.',
      },
    ],
    decisions: [
      {
        title: 'Auto-fill vehicles from CarJam',
        why: 'Typing a plate is faster than filling in make, model and registration by hand on a phone, and it removes typing mistakes from a record that may be checked later.',
        tradeoff: 'Inspections now depend on a paid outside service, so the app needs a fallback when a lookup fails.',
      },
      {
        title: 'RTK Query for server data',
        why: 'Cached responses keep screens quick on a weak connection and cut repeated calls to the API.',
      },
    ],
    results: [
      { label: 'Released on the App Store and Google Play' },
      { label: 'Delivered and handed over; the client runs it' },
    ],
  },
  'lax-ferries': {
    headline:
      'A deck-side app for a ferry crew: check tickets, board passengers, sell fares and run the right trip, all from one phone.',
    facts: [{ label: 'Platform', value: 'iOS' }],
    context: [
      'The Lax Kw’alaams ferry service needed its deck staff off paperwork. On the dock, the same few people check tickets, board a queue of passengers, sell fares to walk-ups and keep track of which ferry and trip they are running.',
      'I was the only mobile developer on the staff app at ZAPTA Technologies. I built it end to end in Expo and TypeScript on the ferry service’s API.',
    ],
    challenges: [
      {
        title: 'A weak signal at the dock',
        body: 'Ticket checks and sales happen at the water’s edge, where coverage is poor. The app had to stay usable when the network was slow or dropped out.',
      },
      {
        title: 'Boarding has to be fast',
        body: 'A full queue has to be checked and boarded in minutes before departure, so each check had to take seconds, not a form.',
      },
      {
        title: 'Selling fares on the spot',
        body: 'Walk-up passengers buy tickets from the crew, so in-person sales had to sit alongside checks in the same flow.',
      },
      {
        title: 'The right ferry and trip',
        body: 'Staff are assigned to a ferry and route, and every check and sale has to be recorded against the trip they are actually working.',
      },
    ],
    built: [
      {
        title: 'Ticket checks, two ways',
        body: 'Staff scan the QR code on a ticket with the phone camera, and can search for the passenger when a code won’t scan.',
      },
      {
        title: 'Boarding and in-person sales',
        body: 'A checked passenger is boarded in one step, and walk-up fares are sold from the same app.',
      },
      {
        title: 'Ferry and route assignment',
        body: 'Staff pick up their assigned ferry and route, so everything they do is tied to the right sailing.',
      },
      {
        title: 'One API client and a saved session',
        body: 'Every call goes through one Axios client, with the signed-in session kept in Zustand and saved to the device so crew aren’t logged out between sailings.',
      },
    ],
    decisions: [
      {
        title: 'Scan first, search as a fallback',
        why: 'Scanning is the fastest path for a queue, but a cracked screen or a faded printout can’t be allowed to stop someone boarding.',
      },
      {
        title: 'Expo Router and Zustand',
        why: 'File-based routes keep a small app easy to follow, and Zustand holds the session and ticket state without the setup Redux would need.',
      },
    ],
    results: [
      { label: 'Live on the App Store' },
      { label: 'Used by the crew on daily sailings' },
    ],
  },
  isqroll: {
    headline:
      'A New Zealand marketplace where strangers can trade safely, sell a car by price or auction, and keep talking in the app.',
    facts: [{ label: 'Team', value: 'Led the mobile team' }],
    context: [
      'ISQROLL is an online marketplace for New Zealanders: a safe place to buy and sell, with buyers and sellers talking to each other inside the app. Cars are a big part of it, sold either at an asking price or by auction.',
      'I was team lead at OutsourceNZ. I set the app’s architecture, led and reviewed the mobile team, wrote core features myself, and worked directly with the client on scope and releases.',
    ],
    challenges: [
      {
        title: 'Trust between strangers',
        body: 'People are trading money and goods with someone they’ve never met. The app had to make that feel safe, starting with keeping the conversation inside the app.',
      },
      {
        title: 'Two ways to sell',
        body: 'A fixed asking price and a timed auction follow different rules and screens, but had to feel like one product to sellers.',
      },
      {
        title: 'Car listings from a plate',
        body: 'Vehicle listings pull their details from CarJam, so a seller types a plate instead of filling in the car by hand.',
      },
      {
        title: 'Lots of listings, loading fast',
        body: 'Browsing had to stay quick with many listings and images, including on a weak mobile connection.',
      },
    ],
    built: [
      {
        title: 'Listings, auctions and offers',
        body: 'Sellers list at an asking price or start an auction; buyers browse, bid and make contact.',
      },
      {
        title: 'Buyer–seller messaging',
        body: 'Conversations happen in the app, so neither side has to hand over a phone number to a stranger.',
      },
      {
        title: 'A cached data layer',
        body: 'Redux with RTK Query for server data, and MMKV to keep it on the device so the app opens fast.',
      },
    ],
    decisions: [
      {
        title: 'RTK Query for all server data',
        why: 'One data layer handles caching, loading states and refetching, so the team wasn’t hand-writing the same request logic on every screen, and new developers had one pattern to follow.',
        tradeoff: 'More setup up front than plain fetch calls, and the team had to learn its cache rules.',
      },
      {
        title: 'MMKV for the on-device cache',
        why: 'MMKV is much faster than AsyncStorage, so cached listings show at once on launch.',
      },
    ],
    results: [
      { label: 'Released on the App Store and Google Play' },
      { label: 'Still live on Google Play and the web' },
    ],
  },
  locumbridge: {
    headline:
      'One app for both sides of locum staffing: practices post shifts, locum doctors find and book them, without an agency in the middle.',
    facts: [{ label: 'Languages', value: 'English, French' }],
    context: [
      'Clinics struggle to fill short-term shifts, and locum doctors struggle to find the right work, when everything goes through traditional staffing agencies. LocumBridge connects the two directly.',
      'I was team lead at OutsourceNZ. I set the app’s architecture and built core features myself.',
    ],
    challenges: [
      {
        title: 'Matching the right locum',
        body: 'A shift is only filled if the locum fits it: the right role, place and dates. Practices needed to see suitable people, not everyone.',
      },
      {
        title: 'Dates and availability',
        body: 'Shifts have exact dates and hours, and locums juggle several practices, so scheduling had to be clear and avoid clashes.',
      },
      {
        title: 'Two languages',
        body: 'The whole interface had to work in English and French, including dates and longer translated labels.',
      },
      {
        title: 'Two sides in one app',
        body: 'Practices and locums use the same app but do very different things: one posts and confirms shifts, the other searches and applies.',
      },
    ],
    built: [
      {
        title: 'Jobs from post to payment',
        body: 'A practice posts a job with its date and hours, sees applicants, and follows it through open, confirmed, completed and paid.',
      },
      {
        title: 'Matching and messages',
        body: 'Practices see matched locums for a shift and can message them in the app.',
      },
      {
        title: 'A shared calendar',
        body: 'Upcoming shifts on a calendar for both practices and locums.',
      },
      {
        title: 'Translations throughout',
        body: 'i18next drives every label, so a new language is a file, not a code change.',
      },
    ],
    decisions: [
      {
        title: 'One app, two roles',
        why: 'Practices and locums share sign-in, messaging and the calendar, so one codebase with role-based screens was cheaper to build and maintain than two apps.',
        tradeoff: 'Every screen has to know whose it is, which adds checks across the app.',
      },
      {
        title: 'i18next from day one',
        why: 'Adding a second language after the fact means hunting down every hard-coded string; building it in from the start kept French a translation job.',
      },
    ],
    results: [
      { label: 'Released on the App Store' },
      { label: 'Delivered and handed over; the client runs it' },
    ],
  },
  mybenefits: {
    headline:
      'Turning a gym membership people already pay for into a habit: go three times a week, prove it by location, unlock rewards.',
    context: [
      'Plenty of people pay for a gym membership they hardly use. MyBeneFITs NZ gives them a reason to turn up: three visits in a week unlock discount codes from online retailers.',
      'I built core features of the React Native app at OutsourceNZ, on a Node.js API that tracks members, visits and rewards.',
    ],
    challenges: [
      {
        title: 'Only real visits count',
        body: 'A reward is worth money, so a check-in from the sofa can’t count. The app had to confirm the member was actually at their gym.',
      },
      {
        title: 'Counting the week correctly',
        body: 'Three visits a week sounds simple, but the count has to reset at the right moment and never double-count a visit.',
      },
      {
        title: 'Reward codes are limited',
        body: 'Discount codes from retailers had to go to the right member, once, and only when the weekly goal was met.',
      },
      {
        title: 'Workouts in the app',
        body: 'Timed workouts needed a timer that stays accurate while the member is busy exercising.',
      },
    ],
    built: [
      {
        title: 'Location-checked gym visits',
        body: 'A visit only counts when the phone’s location is at the member’s gym.',
      },
      {
        title: 'A weekly goal',
        body: 'Progress toward three visits a week, shown clearly so members know how close they are to a reward.',
      },
      {
        title: 'Rewards and timed workouts',
        body: 'Discount codes unlocked by the weekly goal, plus timed workout sessions and an FAQ.',
      },
    ],
    decisions: [
      {
        title: 'GPS to verify a visit',
        why: 'Members already carry their phone to the gym, so checking location needs no hardware at the gym and no staff involvement.',
        tradeoff: 'Location permission is a big ask, and GPS can be off by a few metres indoors, so the gym’s area had to allow for that.',
      },
    ],
    results: [{ label: 'Released on the App Store' }],
  },
  extent: {
    headline:
      'A social events platform built and run end to end by one engineer: app, API, admin dashboard, payments, and the recovery when the server was breached.',
    facts: [
      { label: 'Apps', value: 'Mobile, dashboard, API' },
      { label: 'Tests', value: '13 regression suites' },
    ],
    context: [
      'ExtEnt Events lets people find events near them, RSVP, add friends and follow what their friends are going to. Event planners list their events, get a 7-day free trial once an admin approves them, then keep them live with a paid Stripe subscription. The team runs moderation, pricing, users and reports from a web dashboard.',
      'I built all of it on my own, working directly with the client: the React Native app, the Express API on MongoDB, and the Next.js admin dashboard. I also deployed it and kept it running.',
    ],
    challenges: [
      {
        title: 'Payments that never get lost',
        body: 'A planner’s card is charged by Stripe, but the event only goes live when the platform knows about it. If the app closes or a webhook arrives twice, the two can drift apart, with money taken and nothing to show for it.',
      },
      {
        title: 'Three questions that look like one',
        body: '“Is this event approved?”, “Is it paid for?” and “Is it still on?” are different questions. Treating them as one status hides paid events or shows unpaid ones.',
      },
      {
        title: 'A social graph',
        body: 'Friend requests, friends’ activity and who’s going where all have to respect each user’s privacy settings.',
      },
      {
        title: 'Running it on shared hosting',
        body: 'The API runs on cPanel under Passenger, which stops idle apps. Scheduled work kept in memory, like trial expiry, silently disappears when that happens.',
      },
    ],
    built: [
      {
        title: 'Mobile app',
        body: 'React Native with Redux Toolkit: a location-aware event feed, RSVPs, likes and comments, friends and their activity, push notifications, and Stripe for planners’ subscriptions.',
      },
      {
        title: 'Express API',
        body: 'JWT auth for both the app and the dashboard, rate limits on sign-in and OTP routes, Cloudinary for images and video, and BullMQ on Redis to send push notifications and email.',
      },
      {
        title: 'Admin dashboard',
        body: 'Next.js with TanStack Query: approve or reject events, manage users and pricing, and reports that all use the same date windows and timezone.',
      },
      {
        title: 'Documentation and tests',
        body: 'Architecture, product, deployment and security docs written from the code, and 13 regression test suites guarding event visibility, archiving and reports.',
      },
    ],
    decisions: [
      {
        title: 'Stripe webhooks are the source of truth',
        why: 'An event is marked paid when Stripe’s signed webhook says so, not when the app reports success. The signature is checked on the raw request body, and each webhook is recorded so a resent one is never applied twice.',
        tradeoff: 'There is a short delay between paying and the event going live, and the webhook route has to be mounted before any body parsing, which is easy to break.',
      },
      {
        title: 'Moderation, payment and “still live” kept apart',
        why: 'Status is only for moderation, payment state is separate, and “archived” is a timestamp, not a status. Paying un-archives an event straight away, and every listing, report and count uses one shared filter so they always agree.',
      },
      {
        title: 'A backstop for scheduled jobs',
        why: 'Because the host can stop the app and lose its in-memory schedule, the trial and expiry jobs can also be triggered by an outside cron call, and listings work out visibility when they are read, so they stay right even if a job is late.',
      },
    ],
    results: [
      { label: 'Found planners being charged without their event being linked; fixed the cause and wrote a reconciliation to find the affected payments' },
      { label: 'Led the recovery after the client’s shared hosting was breached: contained it, rotated every secret and redeployed from clean git history' },
    ],
    lessons: [
      'On shared hosting, assume the process can vanish at any moment. Anything that has to happen on time needs a second trigger.',
      'Write the payment path so it can be checked against Stripe afterwards. The reconciliation only worked because every subscription was stored with its Stripe ID.',
    ],
  },
  'fmb-toronto': {
    headline:
      'The weekly meal app for a community kitchen: menus, RSVPs and requests for hundreds of families, simple enough for every generation.',
    facts: [{ label: 'Platform', value: 'iOS and Android' }],
    context: [
      'Faiz al-Mawaid al-Burhaniyah (FMB) runs a thaali service for the Dawoodi Bohra community in Toronto, cooking and delivering meals to hundreds of families. The kitchen needs one place to publish the schedule and menu, collect RSVPs and requests, share announcements and hear how the food was.',
      'I was the only mobile developer. I built the React Native app on the community’s existing API.',
    ],
    challenges: [
      {
        title: 'Hundreds of families, one cut-off',
        body: 'RSVPs have to be in before the kitchen plans how much to cook. A missed change means wasted food or a family without a meal.',
      },
      {
        title: 'Every generation uses it',
        body: 'Many members aren’t comfortable with apps, so the main tasks had to be obvious and quick, with no learning curve.',
      },
      {
        title: 'More than one language',
        body: 'The app speaks the community’s languages as well as English, through i18next.',
      },
      {
        title: 'An API I couldn’t change',
        body: 'The backend already existed and served other systems, so the app had to fit its data and rules as they were.',
      },
    ],
    built: [
      {
        title: 'Schedule, menus and RSVPs',
        body: 'The week’s thaali schedule and menu, with RSVPs per family.',
      },
      {
        title: 'Requests and feedback',
        body: 'Fateha and Zabihat requests, and food ratings so the kitchen hears back after each meal.',
      },
      {
        title: 'Announcements by push',
        body: 'OneSignal push notifications for announcements and changes to the schedule.',
      },
    ],
    decisions: [
      {
        title: 'Push notifications for announcements',
        why: 'A menu change or a closed day has to reach every family the same day. Push lands on the lock screen, where a notice board or a group chat is easy to miss.',
        tradeoff: 'Members have to allow notifications, and too many messages would make people turn them off, so they are kept for things that matter.',
      },
    ],
    results: [
      { label: 'Live on the App Store and Google Play' },
      { label: 'Used by the community every week' },
    ],
  },
  myusta: {
    headline:
      'Two apps for one marketplace: homeowners find a local tradesperson, tradespeople win the job, and every step in between has to line up.',
    facts: [{ label: 'Apps', value: 'Homeowner, tradesperson' }],
    context: [
      'myUSTA is an Albanian-language home-services marketplace. Homeowners need a trusted local tradesperson quickly; tradespeople want a steady flow of work without chasing leads.',
      'I was the only mobile developer and built both apps in React Native and TypeScript: one for homeowners and one for tradespeople.',
    ],
    challenges: [
      {
        title: 'One job, two apps',
        body: 'A job starts in the homeowner’s app and is answered in the tradesperson’s. Every step, from the request to the finished job, had to show the same state on both sides.',
      },
      {
        title: 'Feeling trustworthy',
        body: 'Homeowners let a stranger into their home, so the apps had to look and feel professional enough to earn that trust.',
      },
    ],
    built: [
      {
        title: 'Homeowner app',
        body: 'Find a local tradesperson, post a job and follow it through to completion.',
      },
      {
        title: 'Tradesperson app',
        body: 'See new jobs, respond and manage the work, built to bring in jobs without chasing leads.',
      },
    ],
    decisions: [
      {
        title: 'Reanimated for a polished feel',
        why: 'Smooth, native-thread animations make both apps feel fast and well made, which matters when the product is asking for trust.',
        tradeoff: 'Animation code is more work to write and test than plain screens.',
      },
      {
        title: 'Two focused apps',
        why: 'Homeowners and tradespeople want very different things, so each gets an app built only for them rather than one app with modes.',
      },
    ],
    results: [
      { label: 'Both apps released on the App Store' },
      { label: 'Delivered and handed over; the client runs them' },
    ],
  },
  mish: {
    headline:
      'Carpooling built around the route: drivers publish trips they are already making, riders find one on the map and book a seat.',
    facts: [{ label: 'Team', value: 'Led the mobile team' }],
    context: [
      'MISH is a ride-sharing app where people sign up as drivers or riders. Drivers publish trips they are already taking; riders find a trip going their way and pay for a seat before it leaves.',
      'I was team lead at OutsourceNZ. I set the architecture, led and reviewed the team, wrote core features myself, and worked directly with the client.',
    ],
    challenges: [
      {
        title: 'Everything happens on a map',
        body: 'Trips, pickup points and searches are all about places and routes, so the map had to be accurate and quick to use on a phone.',
      },
      {
        title: 'The last seat goes once',
        body: 'Two riders can try to book the last seat on the same trip at the same moment. Only one can get it.',
      },
      {
        title: 'Rider today, driver tomorrow',
        body: 'The same person can ride one day and drive the next, so both sides had to live comfortably in one account.',
      },
    ],
    built: [
      {
        title: 'Trips on Google Maps',
        body: 'Drivers publish a trip with its route; riders search and see trips on the map.',
      },
      {
        title: 'Seat booking and payment',
        body: 'A rider buys a seat before the trip, which confirms it for both sides.',
      },
      {
        title: 'Rider and driver sides',
        body: 'Separate flows for publishing trips and booking seats, sharing one API and one account.',
      },
    ],
    decisions: [
      {
        title: 'Google Maps for routes',
        why: 'Real routes and distances let riders find trips that actually pass near them, instead of matching on typed addresses that rarely line up.',
        tradeoff: 'Maps API calls cost money per use, so searches and route lookups had to be kept to what the screen needs.',
      },
      {
        title: 'Pay to confirm a seat',
        why: 'Taking payment at booking means a driver can count on the riders who booked, and the seat count stays accurate.',
      },
    ],
    results: [
      { label: 'Released on the App Store and Google Play' },
      { label: 'Used to book real shared trips' },
    ],
  },
  ponataki: {
    headline:
      'Helping the next generation learn Niuean: short video units, quizzes you can hear, and games, with lessons the community can add without an app update.',
    context: [
      'Niuean is spoken by a small community, much of it living outside Niue, and keeping it alive means making it easy for younger people to learn. Ponataki teaches everyday words and sentences through short lessons, available on demand on mobile and online.',
      'I was team lead at OutsourceNZ. I set the app’s architecture and built core features myself.',
    ],
    challenges: [
      {
        title: 'Lessons are audio and video',
        body: 'Each unit has video lessons and its quizzes have audio, so media had to load quickly and play reliably, including on slower connections.',
      },
      {
        title: 'A language I don’t speak',
        body: 'Every word, sentence and recording is in Niuean. The app had to show the content exactly as the community wrote it, with no way for me to spot a mistake by reading it.',
      },
      {
        title: 'Learning and playing',
        body: 'Structured units, quizzes and learn-while-playing games each work differently, but had to feel like one app.',
      },
    ],
    built: [
      {
        title: 'Learning units',
        body: 'Units of short video lessons on everyday words and sentences.',
      },
      {
        title: 'Quizzes with audio',
        body: 'A quiz at the end of each unit, with audio so learners hear the words, not just read them.',
      },
      {
        title: 'Learn while playing',
        body: 'Games that practise the same words outside the lessons.',
      },
    ],
    decisions: [
      {
        title: 'Lessons come from the API, not the app',
        why: 'Units, words and recordings are loaded from the backend, so the community can add and correct lessons without waiting for a new release in the app stores. That mattered most because only they can check the language.',
        tradeoff: 'The app needs a connection to fetch new content, and every screen has to cope with content of any length.',
      },
    ],
    results: [{ label: 'Delivered and handed over; the client runs it' }],
  },
  majlix: {
    headline:
      'One app for the market numbers traders check across several platforms, shown clearly and kept fresh without placing a single trade.',
    context: [
      'Traders follow prices, currency rates and stats across several platforms. Majlix pulls them together into one app, so they can check the numbers without switching between services. It shows data only; it does not place trades.',
      'I worked on the Expo app as part of the team at ZAPTA Technologies. A NestJS API gathers the data from third-party providers.',
    ],
    challenges: [
      {
        title: 'Many providers, one view',
        body: 'Each data provider has its own format, rate limits and outages, but the app has to show one consistent picture.',
      },
      {
        title: 'Numbers that feel live',
        body: 'Prices and stats need to refresh often enough to be useful without draining the battery or the provider quota.',
      },
      {
        title: 'Charts on a phone',
        body: 'Market stats and charts had to stay readable and smooth on a small screen.',
      },
      {
        title: 'Clearly not a trading app',
        body: 'The app shows data from other platforms, so it had to present it clearly without looking like it executes trades.',
      },
    ],
    decisions: [
      {
        title: 'Cache provider data on the server',
        why: 'The API caches what it fetches from each provider, so many app users share one upstream call. That keeps the app within rate limits and costs, and screens still load when a provider is slow.',
        tradeoff: 'Cached numbers can be a little behind the source, so how long to keep each kind of data had to be chosen per provider.',
      },
      {
        title: 'Reanimated for stats and charts',
        why: 'Animations run on the native thread, so updating numbers and charts stay smooth.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  referralpro: {
    headline:
      'Turning word of mouth into something a business can track and reward, built by one developer on Firebase with no server to run.',
    context: [
      'Referrals are one of the best sources of new business, but they are rarely tracked and the people who make them are rarely rewarded. ReferralPro is a referral network: people refer customers, partners and services to companies and earn rewards, while the companies’ reps track every referral.',
      'I designed and built the app on my own, working directly with the client.',
    ],
    challenges: [
      {
        title: 'Following a referral to the end',
        body: 'A referral is only worth a reward once it turns into business, so each one had to be tracked from the moment it was made until it was rewarded.',
      },
      {
        title: 'Three kinds of user',
        body: 'People making referrals, the companies receiving them and the reps managing them each see and do different things in the same app.',
      },
      {
        title: 'Paid plans through the stores',
        body: 'Plans are sold as in-app purchases, which means working with Apple’s and Google’s billing and keeping the user’s plan in step with it.',
      },
      {
        title: 'No server of its own',
        body: 'Everything runs on Firebase, so who can read and change which referral had to be enforced by the database itself, not by an API.',
      },
    ],
    built: [
      {
        title: 'Sign-in',
        body: 'Firebase Auth with Google and Facebook sign-in, so joining takes a tap.',
      },
      {
        title: 'Companies and referrals',
        body: 'Companies and their referrals stored in Firestore, with each referral’s status visible to the people involved.',
      },
      {
        title: 'Plans',
        body: 'In-app purchases for paid plans on iOS and Android.',
      },
    ],
    decisions: [
      {
        title: 'Firebase instead of a custom server',
        why: 'Auth and Firestore gave sign-in, a live database and security rules out of the box, so one developer could ship the whole product without building or running a backend.',
        tradeoff: 'Access rules live in the database, which is harder to test than API code, and complex reports are harder to build on Firestore than on SQL.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  devtinder: {
    headline:
      'A matching app for developers: a feed that never shows the same person twice, and connection rules enforced by the data model itself.',
    facts: [{ label: 'Type', value: 'Learning project' }],
    context: [
      'DevTinder helps developers find people to build with: create a profile, browse a feed of other developers, send a request to the ones you’re interested in, and accept or reject the requests you receive.',
      'The Express and MongoDB backend follows NamasteDev’s Node.js course. I designed and built the React frontend my own way, with TanStack Query for server data, Redux Toolkit for the signed-in user, and a toast system for feedback.',
    ],
    challenges: [
      {
        title: 'A feed that doesn’t repeat',
        body: 'Once you have sent someone a request, or they have sent you one, they shouldn’t appear in your feed again, and you should never see yourself.',
      },
      {
        title: 'Requests with clear rules',
        body: 'A connection request moves through interested, ignored, accepted or rejected, and some combinations, like requesting yourself, must never happen.',
      },
      {
        title: 'Two kinds of state on the frontend',
        body: 'Who is signed in and the data loaded from the server change in different ways, and mixing them makes screens show stale information.',
      },
    ],
    built: [
      {
        title: 'Paginated feed',
        body: 'The feed excludes everyone you already have a request with, plus yourself, and returns only safe profile fields, a page at a time with a cap on page size.',
      },
      {
        title: 'Connections and requests',
        body: 'Send, review, accept and reject requests, and see your connections and incoming requests.',
      },
      {
        title: 'Frontend data layer',
        body: 'One Axios client with interceptors, query keys kept in one file, and TanStack Query hooks for sign-in, sign-up and profile updates.',
      },
    ],
    decisions: [
      {
        title: 'Request rules live in the schema',
        why: 'Allowed statuses are an enum and a pre-save check refuses a request to yourself, so the rules hold no matter which route writes the data.',
      },
      {
        title: 'Server data and session state kept apart',
        why: 'TanStack Query owns everything fetched from the API, with caching and refetching, while Redux holds only the signed-in user and auth status.',
        tradeoff: 'Two state libraries in a small app, and the signed-in user is written to both on login.',
      },
    ],
    results: [{ label: 'Live on Vercel, with the code public on GitHub' }],
    lessons: [
      'The JWT secret is hard-coded and the auth cookie isn’t httpOnly. In production I’d load the secret from the environment and set the cookie httpOnly, secure and same-site.',
      'Following a course for the backend made it easy to spend my own time where I wanted to learn most: structuring the data layer on the frontend.',
    ],
  },
  istikhara: {
    headline:
      'A private, guided way to seek istikhara before a big decision, with live conversation and the tools the team needs behind it.',
    context: [
      'Before an important decision, such as marriage, a job or a move, many Muslims perform istikhara and seek guidance. The app lets people describe the decision they face, go through istikhara step by step, and receive guidance according to Islamic tradition.',
      'I worked on the React Native app as part of the team.',
    ],
    challenges: [
      {
        title: 'Very personal questions',
        body: 'People describe sensitive life decisions, so the app had to feel private and trustworthy from the first screen.',
      },
      {
        title: 'Getting the tradition right',
        body: 'The steps and wording had to follow the religious practice exactly. A small mistake would cost the app its credibility.',
      },
      {
        title: 'Four ways to sign in',
        body: 'Email, Google, Facebook and Apple sign-in all lead to one account on a JWT-secured API.',
      },
      {
        title: 'Live chat and a staff side',
        body: 'Real-time chat with the people giving guidance, plus attendance and shift tools for the team, in the same app.',
      },
    ],
    built: [
      {
        title: 'A guided flow',
        body: 'Describe the decision, then go through istikhara one step at a time.',
      },
      {
        title: 'Chat over Socket.IO',
        body: 'Live conversation between the user and the person guiding them.',
      },
      {
        title: 'Staff tools',
        body: 'Attendance and shifts for the team that answers requests.',
      },
    ],
    decisions: [
      {
        title: 'One step at a time',
        why: 'A guided flow keeps people on the right steps in the right order, and lets someone who has never performed istikhara do it with confidence.',
        tradeoff: 'More screens to build and keep in step than a single form.',
      },
      {
        title: 'Apple sign-in alongside the others',
        why: 'The App Store requires Sign in with Apple when an app offers other social sign-in.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  whou: {
    headline:
      'Find like-minded people nearby and go straight to their Instagram, without building yet another social profile.',
    context: [
      'Meeting like-minded people nearby is hard when everyone’s real profile lives on a different platform. WhoU shows registered users within a radius of your location and links straight to their Instagram.',
      'I built the React Native app at OutsourceNZ, on an Express and MongoDB API built by the team.',
    ],
    challenges: [
      {
        title: 'Who is nearby, quickly',
        body: 'The list of people around you depends on where you are right now, so it had to load fast and change as you move.',
      },
      {
        title: 'Nearby, but not exactly where',
        body: 'People are happy to be found nearby, not to have their exact position shown to strangers.',
      },
      {
        title: 'Keeping location fresh',
        body: 'Your position has to stay up to date for the list to be right, without draining the battery.',
      },
      {
        title: 'Linking to Instagram',
        body: 'Each profile leads to the person’s Instagram, so the link had to work reliably from inside the app.',
      },
    ],
    built: [
      {
        title: 'People near you',
        body: 'A list of registered users within a radius of your location.',
      },
      {
        title: 'Profiles that link out',
        body: 'Each person links straight to their Instagram profile.',
      },
    ],
    decisions: [
      {
        title: 'Use Instagram as the profile',
        why: 'People already curate their Instagram, so linking to it gave every user a rich profile on day one, and the app could stay small and focused on finding people nearby.',
        tradeoff: 'The app depends on users having, and sharing, an Instagram account.',
      },
    ],
    results: [{ label: 'Released on the App Store and Google Play' }],
  },
  bookit: {
    headline:
      'One app for booking almost anything, built on a single booking flow that holds your slot while you pay.',
    facts: [{ label: 'Stage', value: 'MVP' }],
    context: [
      'Booking a haircut, a restaurant table and an event ticket usually means three different apps. BookIt puts appointments, venues and tables, events and tickets in one place.',
      'It was an OptimusFox project. I was the mobile developer and built the React Native app on the team’s Node.js API.',
    ],
    challenges: [
      {
        title: 'Many kinds of booking, one app',
        body: 'An appointment, a table and a ticket look different, but all had to fit one booking flow so the app stayed simple.',
      },
      {
        title: 'No double bookings',
        body: 'Two people can try to book the same slot or seat at the same moment. Only one can get it.',
      },
      {
        title: 'Availability and time slots',
        body: 'Opening hours, how long each booking takes and what is already taken all decide which slots appear.',
      },
      {
        title: 'Businesses and customers',
        body: 'Customers book, while businesses need their own screens to manage what they offer.',
      },
    ],
    decisions: [
      {
        title: 'Hold a slot while the customer pays',
        why: 'A slot is held for a short time once checkout starts, so it can’t be taken by someone else halfway through paying. Without it, two people could both pay for the same booking.',
        tradeoff: 'A held slot is unavailable to others until it is paid for or the hold runs out, so the hold has to be short.',
      },
    ],
    results: [{ label: 'Built as an MVP; not launched publicly' }],
  },
  livestream: {
    headline:
      'A social live-streaming app where going live, chatting and sending gifts all happen at once, and every gift is counted on the server.',
    context: [
      'The client wanted a social live-streaming product of their own, in the style of Bigo Live: anyone can go live, viewers watch and explore streams, chat in real time and send virtual gifts, and followers get a notification when someone they follow goes live.',
      'I designed and built the React Native app.',
    ],
    challenges: [
      {
        title: 'Video with little delay',
        body: 'Live chat only works if viewers see the stream almost as it happens, so the delay between host and audience had to stay low.',
      },
      {
        title: 'Chat and gifts on top of the stream',
        body: 'Messages and gift animations play over the video and have to stay in step with it without making playback stutter.',
      },
      {
        title: 'Gifts are real money',
        body: 'Virtual gifts are bought with real money, so every one has to be counted exactly once, for both sender and host.',
      },
      {
        title: 'Bringing viewers in',
        body: 'A stream only matters while it’s live, so followers had to hear about it the moment it started.',
      },
    ],
    built: [
      {
        title: 'Going live and watching',
        body: 'Vision Camera for broadcasting from the phone, React Native Video for playback, and WebRTC for the live connection.',
      },
      {
        title: 'Explore',
        body: 'Fast, scrolling lists of live streams built on FlashList.',
      },
      {
        title: 'Chat, gifts and alerts',
        body: 'Live chat and gifts during a stream, and notifications when someone goes live.',
      },
    ],
    decisions: [
      {
        title: 'Gifts are settled on the server',
        why: 'The app only asks to send a gift; the server checks the balance, records it and credits the host. A modified app or a dropped connection can’t create or lose money.',
        tradeoff: 'Each gift needs a round trip before it is confirmed, so the animation has to wait for the server or be shown as pending.',
      },
      {
        title: 'WebRTC for the live connection',
        why: 'WebRTC is built for real-time media, which keeps the delay low enough for chat and gifts to feel live.',
      },
    ],
    results: [{ label: 'Delivered; the client has since paused the project' }],
  },
  safesigns: {
    headline:
      'Point your phone at a safety sign and read what it means in your own language, so every worker on a New Zealand site can understand it.',
    context: [
      'New Zealand worksites employ many people from culturally and linguistically diverse backgrounds, and not all of them can read the health and safety signs around them. SafeSigns lets them photograph a sign and see its meaning in their chosen language.',
      'I was the only mobile developer at OutsourceNZ and built the React Native app. The sign database and image recognition sit behind it.',
    ],
    challenges: [
      {
        title: 'Photos taken on site',
        body: 'Signs are photographed in the real world: at an angle, in glare, dirty or far away. The app had to get a usable picture from that.',
      },
      {
        title: 'A wrong answer is dangerous',
        body: 'Misreading a safety sign could get someone hurt, so the meaning shown had to be the right one, every time.',
      },
      {
        title: 'Many languages',
        body: 'Each sign’s meaning is shown in the worker’s own language, chosen at the start.',
      },
      {
        title: 'A large library of signs',
        body: 'The database covers the health and safety signage used across New Zealand industries, organised so people can also browse it by category.',
      },
    ],
    built: [
      {
        title: 'Scan a sign',
        body: 'Take a photo and the app matches it against the sign database using image recognition, then shows what it means.',
      },
      {
        title: 'Choose your language',
        body: 'Pick a language once and every sign is explained in it.',
      },
      {
        title: 'Categories and history',
        body: 'Browse signs by category and see the ones you scanned recently.',
      },
    ],
    decisions: [
      {
        title: 'Recognise the sign, then look up a vetted meaning',
        why: 'The photo is only used to identify which sign it is. The explanation always comes from the curated database, so a worker never reads a machine-generated guess about what a safety sign means.',
        tradeoff: 'A sign that isn’t in the database can’t be explained, so the library has to keep growing.',
      },
    ],
    results: [
      { label: 'Live on the App Store' },
      { label: 'Used by workers on New Zealand sites' },
    ],
  },
  spouse: {
    headline:
      'A matchmaking app for Muslims looking to marry, where detailed profiles come first and conversations start only when both people agree.',
    context: [
      'People looking for a spouse want serious, well-described profiles and a respectful way to get in touch. Spouse gives them detailed profiles, likes and matches, and private conversations.',
      'I was the only mobile developer, working directly with the client, and built the React Native app on their REST API.',
    ],
    challenges: [
      {
        title: 'Detailed profiles without a tiring sign-up',
        body: 'A good match depends on family, faith, education and more, but asking for all of it at once makes people give up.',
      },
      {
        title: 'Respectful, private contact',
        body: 'Nobody should receive messages they didn’t agree to, and personal details have to stay private until both sides are interested.',
      },
      {
        title: 'Conversations in real time',
        body: 'Chat runs over Socket.IO and has to stay reliable as people move between screens and connections.',
      },
      {
        title: 'More than one language',
        body: 'The whole app is translated with i18next.',
      },
    ],
    built: [
      {
        title: 'Profiles, likes and matches',
        body: 'Detailed profiles, liking someone, and a match when the interest is mutual.',
      },
      {
        title: 'Private conversations',
        body: 'Real-time chat over Socket.IO between matched people.',
      },
      {
        title: 'A typed API layer',
        body: 'Redux Toolkit with RTK Query in TypeScript for every call to the client’s API.',
      },
    ],
    decisions: [
      {
        title: 'Chat only after a match',
        why: 'Both people have to like each other before they can talk. That keeps unwanted messages out and makes every conversation one both sides chose, which matters for a serious, faith-based app.',
        tradeoff: 'Fewer conversations start, by design.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  lifevize: {
    headline:
      'An advice marketplace where vetted advisers answer questions in paid, timed chat sessions and get paid out through Stripe Connect.',
    context: [
      'Getting expert advice quickly is hard, and advisers need a way to be paid for their time. On Lifevize, users post questions by category and approved advisers answer them in paid, timed chat sessions.',
      'I was the only mobile developer, working directly with the client, and built the React Native app on their REST API.',
    ],
    challenges: [
      {
        title: 'Paying the advisers',
        body: 'Money comes in from users and goes out to many advisers, each of whom has to be set up to receive payouts.',
      },
      {
        title: 'Sessions on a clock',
        body: 'A paid session starts, counts down and ends on time, on both phones at once.',
      },
      {
        title: 'Charging only for real sessions',
        body: 'A user should only pay for a session that actually happened, so a no-show can’t become a charge.',
      },
      {
        title: 'Only approved advisers',
        body: 'Advisers are approved before they can answer, so users can trust who they are paying.',
      },
    ],
    built: [
      {
        title: 'Questions by category',
        body: 'Users post a question in a category and approved advisers pick it up.',
      },
      {
        title: 'Timed chat sessions',
        body: 'Real-time chat on Firebase, limited to the length of the paid session.',
      },
      {
        title: 'Payments and payouts',
        body: 'Stripe Connect takes session payments and pays advisers.',
      },
    ],
    decisions: [
      {
        title: 'Stripe Connect for the marketplace',
        why: 'Connect handles adviser onboarding and identity checks, splits each payment between adviser and platform, and runs the payouts, which a small team should never build by hand.',
        tradeoff: 'Advisers must complete Stripe’s onboarding before they can be paid, which adds a step to joining.',
      },
      {
        title: 'Firebase for chat',
        why: 'Realtime chat without running a socket server alongside the client’s REST API.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  aawhina: {
    headline:
      'A free, private way for whaanau affected by family and sexual harm to reach support from someone they trust, with no account needed.',
    facts: [{ label: 'Team', value: 'Led the build' }],
    context: [
      'AawhinaNZ is a free support app from Friendship House for whaanau who have experienced family and sexual harm. It helps people reach support privately, from someone they feel comfortable with, and find support services across Aotearoa.',
      'I led the build at OutsourceNZ, working with the team on the React Native app and its Node.js API.',
    ],
    challenges: [
      {
        title: 'Safe even if the phone is seen',
        body: 'The person causing harm may look at the phone. The app had to protect the person using it, not just their data.',
      },
      {
        title: 'Choosing who to talk to',
        body: 'People reach out to someone they feel comfortable with, so they choose their support contact rather than being placed in a queue.',
      },
      {
        title: 'Right for whaanau',
        body: 'Language and design had to feel right for the whaanau it serves, including te reo Maaori.',
      },
      {
        title: 'Support near you',
        body: 'Support services across Aotearoa shown on a map, so people can find help close to them.',
      },
    ],
    built: [
      {
        title: 'Choose a contact',
        body: 'Pick a support person you trust and reach them privately from the app.',
      },
      {
        title: 'Support services on a map',
        body: 'Support options across Aotearoa, found by location.',
      },
    ],
    decisions: [
      {
        title: 'No account needed',
        why: 'Asking someone in danger to sign up, verify an email or remember a password puts a barrier, and a record, between them and help. Without an account, reaching support takes a few taps and leaves less behind.',
        tradeoff: 'Without accounts the app can’t keep history or follow up, so each contact stands on its own.',
      },
    ],
    results: [{ label: 'Released on the App Store and Google Play, free for whaanau' }],
  },
  vigourme: {
    headline:
      'Private, anonymous access to intimate well-being support from a phone, with no name, email or number required.',
    context: [
      'Many people never ask for help with intimate well-being because it feels too personal. VigourMe makes that support accessible and anonymous: users can book and follow a consultation without giving their identity.',
      'I worked on the React Native app at OptimusFox, built on Firebase.',
    ],
    challenges: [
      {
        title: 'Anonymous for real',
        body: 'Users had to be able to get help without giving a name, email or phone number, while the app still knows whose consultation is whose.',
      },
      {
        title: 'A sensitive subject',
        body: 'The topic needs a discreet, non-judgemental feel throughout, or people won’t use it.',
      },
      {
        title: 'Consultations that move in real time',
        body: 'When a consultation changes, both sides need to know straight away.',
      },
      {
        title: 'Notifications that don’t give it away',
        body: 'A notification on a lock screen can be seen by anyone, so its wording couldn’t reveal what the app is about.',
      },
    ],
    built: [
      {
        title: 'Anonymous sign-in',
        body: 'Firebase anonymous auth gives each user an account with no personal details.',
      },
      {
        title: 'Consultations',
        body: 'Consultations stored in Firestore and kept in sync on the device.',
      },
      {
        title: 'Triggers and push',
        body: 'Cloud functions react to changes and send push notifications.',
      },
    ],
    decisions: [
      {
        title: 'Cloud functions for triggers',
        why: 'Notifications and follow-up updates run on the server when a consultation changes, so they happen reliably even when the app is closed, and the logic isn’t left to each phone.',
        tradeoff: 'Logic split between the app and functions is harder to test together.',
      },
    ],
    results: [{ label: 'Published on Google Play' }],
  },
  dinisium: {
    headline:
      'A mobile way into a token project: connect a wallet, buy the token, follow your holdings and model what they could return.',
    context: [
      'Investors in a token project needed a simple mobile way to buy in and keep track of what they hold. Dinisium lets them buy the token, see their holdings on a dashboard, model returns with a calculator and manage subscriptions.',
      'I was one of the mobile developers on the React Native app at OptimusFox.',
    ],
    challenges: [
      {
        title: 'Connecting a wallet from a phone',
        body: 'The app works with the user’s Web3 wallet, which means handing off to the wallet and coming back safely.',
      },
      {
        title: 'Buying with crypto',
        body: 'A crypto purchase can’t be undone, so the flow had to make every step and amount clear before confirming.',
      },
      {
        title: 'Accurate holdings',
        body: 'Balances and their value had to be right, every time the dashboard opens.',
      },
      {
        title: 'A calculator, not advice',
        body: 'The returns calculator shows what-if numbers and had to read as a model, not a promise.',
      },
    ],
    built: [
      {
        title: 'Wallet and purchase',
        body: 'Connect a Web3 wallet and buy the token.',
      },
      {
        title: 'Dashboard and calculator',
        body: 'Holdings at a glance, plus a calculator for modelling returns.',
      },
      {
        title: 'Subscriptions',
        body: 'Manage subscriptions from the app.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  noyz: {
    headline:
      'A music app where fans stream in a social feed and can own the songs they love as NFTs, made simple for people new to crypto.',
    context: [
      'Artists want new ways to sell their music, and fans want to own a piece of it. On NOYZ, artists release music, fans stream it in a social feed, buy and sell music NFTs, and keep them in a personal vault.',
      'I was the only mobile developer at OptimusFox and built the React Native app.',
    ],
    challenges: [
      {
        title: 'Music in a scrolling feed',
        body: 'Tracks play as people scroll a social feed, so playback had to start fast and switch cleanly from one post to the next.',
      },
      {
        title: 'Buying and selling on a phone',
        body: 'NFT purchases and listings go through a blockchain wallet, all from inside the app.',
      },
      {
        title: 'Fans who are new to crypto',
        body: 'Most music fans have never bought an NFT, so wallets and purchases had to be explained in plain steps.',
      },
      {
        title: 'The vault',
        body: 'Owned NFTs are kept in a personal vault where they can be seen and played.',
      },
    ],
    built: [
      {
        title: 'Social music feed',
        body: 'Stream releases in a feed, with Google and Facebook sign-in to get started quickly.',
      },
      {
        title: 'NFT marketplace',
        body: 'Buy and sell music NFTs through a blockchain wallet.',
      },
      {
        title: 'Vault',
        body: 'A personal collection of owned music NFTs.',
      },
    ],
    results: [{ label: 'Delivered to the client' }],
  },
  'crypto-exchange': {
    headline:
      'Wallets, an order book and bank top-ups in one mobile app, so trading and funding happen in the same place.',
    context: [
      'Trading crypto and funding an account usually happen in separate places. This exchange app brings them together: hold crypto, trade on an order book, follow markets and top up from a bank account.',
      'I was one of the developers on the React Native app at OptimusFox.',
    ],
    challenges: [
      {
        title: 'A live order book',
        body: 'Bids and asks change constantly, and the screen has to keep up without freezing.',
      },
      {
        title: 'Wallets and balances',
        body: 'Users hold several coins, and every balance has to be right.',
      },
      {
        title: 'Bank top-ups',
        body: 'Money comes in from a bank account, so funding had to be clear about what was pending and what had arrived.',
      },
      {
        title: 'Accounts that hold money',
        body: 'An exchange account is a target, so security had to be part of every flow.',
      },
    ],
    built: [
      {
        title: 'Wallets',
        body: 'Hold and view several cryptocurrencies.',
      },
      {
        title: 'Trading and markets',
        body: 'Trade on an order book and follow market prices.',
      },
      {
        title: 'Funding',
        body: 'Top up the account from a bank.',
      },
    ],
    results: [{ label: 'Built but not launched' }],
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
    { name: 'locumbridge-match', caption: 'Matched locums for a shift' },
    { name: 'locumbridge-jobs', caption: 'A practice’s posted jobs, from open to paid' },
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
