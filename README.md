# Mehtab Ismail — portfolio

Personal site for Mehtab Ismail, freelance full-stack developer and system architect. Two pages: the one-pager (`/`) and the full project index (`/work/`).

Built with React 19, Vite, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lenis and matter.js. Both pages are prerendered to static HTML at build time and deployed to Vercel.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Local dev server with hot reload                                |
| `npm run build`   | Type-check, build, and prerender both pages into `dist/`        |
| `npm run preview` | Serve the production build locally (run `build` first)          |
| `npm run lint`    | ESLint                                                          |
| `npm run format`  | Prettier (write) — `format:check` to only check                 |
| `npm run og`      | Re-render the share image `public/og.png` (needs Google Chrome) |

## Editing content

**All text lives in [`src/content/site.ts`](src/content/site.ts).** You never need to touch a component to change copy. Save the file and the dev server updates.

| To change…                                    | Edit in `site.ts`   |
| --------------------------------------------- | ------------------- |
| Email, city, domain, resume path              | `site`              |
| Page titles, descriptions, share image        | `seo`               |
| Social links (top rail, menu, contact)        | `socials`           |
| Hero greeting, rotating roles, statement      | `hero`              |
| "What I do" cards and their tool lists        | `about`, `services` |
| Projects (home showcase and `/work/`)         | `work`, `projects`  |
| How I work steps                              | `processFlow`       |
| Tech stack chips                              | `techStack`         |
| Contact copy, project types, **Formspree ID** | `contact`           |
| Experience timeline                           | `experience`        |

Search the file for `TODO` to find every placeholder still waiting for real details.

### Projects and client privacy

Everything in `site.ts` ships in the site's JavaScript, so a hidden client name must not appear in it anywhere:

- **Hidden project:** `showName: false`, with **no `name` field** (TypeScript rejects one) and a neutral `slug`. The site shows the `alias` and hides the project's links. Keep the real name in a `//` comment; comments are stripped from the build.
- **Approved by the client:** add `name: 'Real Name'`, set `showName: true`, and optionally rename the `slug`.

- `featured: true` puts a project in the home page showcase; every project appears on `/work/`.
- `arch` describes the little architecture diagram: nodes sit on a 0–100 grid, and `core: true` highlights a node in amber.
- `cover` (optional) is a screenshot in `public/`, e.g. `'/work/liora.webp'`. Use WebP or AVIF at about 1600×1000. With a cover, the diagram moves to a small "Detail A" inset.

### Files you add to `public/`

- `resume.pdf`: the "Resume" links point here. The build prints a warning while it's missing.
- Project screenshots for `cover`, e.g. `public/work/liora.webp`.

### The contact form

The form posts to [Formspree](https://formspree.io). Create a form there, copy the ID from its endpoint (`https://formspree.io/f/abcdwxyz` → `abcdwxyz`), and paste it into `contact.formspreeId`. Until then the form tells visitors to email you directly. A hidden honeypot field filters out spam bots.

### Share image

`public/og.png` is rendered from [`scripts/og/og.html`](scripts/og/og.html). Edit the HTML, then run `npm run og`. The script uses the macOS Google Chrome path; on another OS, change the path in `package.json`.

## Design system

Colours, fonts and spacing are CSS variables in the `@theme` block at the top of [`src/index.css`](src/index.css). Tailwind generates its utilities (`bg-bg`, `text-accent`, `font-display`, …) from them, so changing a token updates the whole site. The accent is `--color-accent` (Drafting Amber, `#ffb224`). Design rationale: [`docs/design-direction.md`](docs/design-direction.md).

## Motion and accessibility

- Every animation has a reduced-motion version. To preview it without changing system settings, open the dev site with `?reduce-motion`, e.g. `http://localhost:5173/?reduce-motion`. This switch only exists in dev.
- The physics tech stack only loads for mouse users on screens 768px and wider who allow motion. Everyone else gets a static grid.
- QA results (Lighthouse, link and form checks): [`docs/qa-report.md`](docs/qa-report.md).

## Project structure

```
src/
  content/site.ts          ← all editable text and settings
  App.tsx                  home page sections
  pages/WorkPage.tsx       /work/ page
  AppShell.tsx             shared chrome: backdrop, top bar, rails, footer
  components/
    sections/…             one folder per section (hero, services, work, …)
    layout/ ui/ work/      shared pieces
  entry-server.tsx         used at build time to prerender the HTML
plugins/siteMeta.ts        injects SEO tags, writes sitemap.xml and robots.txt
scripts/prerender.mjs      writes the prerendered HTML into dist/
vercel.json                Vercel build settings and headers
```

## Deploying to Vercel

The build is already configured in `vercel.json` (`npm run build` → `dist/`).

**First deploy, from GitHub (recommended):**

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** that repository. The settings come from `vercel.json`, so accept the defaults.
3. Optional: add your domain under **Project → Settings → Domains**, then set `site.url` in `site.ts` to it so the canonical, share and sitemap URLs are correct.

**First deploy from your terminal instead:**

```bash
npx vercel login
npx vercel          # preview deployment
npx vercel --prod   # production
```

**Redeploying:** with the GitHub setup, every push to the main branch deploys to production automatically, and other branches get preview URLs. With the CLI, run `npx vercel --prod` again.

### Before going live, checklist

- [ ] Email, city and social links in `site.ts`
- [ ] Formspree ID in `contact.formspreeId`, then send yourself a test message
- [ ] `public/resume.pdf`
- [ ] Domain in `site.url`
- [ ] Real experience entries (three are placeholders)
- [ ] Project text checked, especially `stack` and `outcome`; `showName` confirmed per client
- [ ] Optional: project screenshots as `cover`
