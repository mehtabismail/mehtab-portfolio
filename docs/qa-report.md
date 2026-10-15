# Checkpoint 5: QA report

Date: 2026-10-15. Production build (`npm run build`) served with `vite preview`. Lighthouse 12.6.

## Lighthouse

| Page          | Performance | Accessibility | Best practices | SEO |
| ------------- | ----------- | ------------- | -------------- | --- |
| Home, mobile  | 91          | 100           | 100            | 100 |
| Home, desktop | 100         | 100           | 100            | 100 |
| Work, mobile  | 92          | 100           | 100            | 100 |
| Work, desktop | 100         | 100           | 100            | 100 |

Mobile with real (DevTools) throttling instead of simulated: **Performance 99**, first paint 1.6 s, largest paint 1.6 s. Simulated throttling runs on localhost, where everything loads at once. That misleads its model into treating JavaScript as blocking first paint, so expect higher simulated scores on Vercel's CDN with compression. The full mobile report is in [lighthouse-home-mobile.html](./lighthouse-home-mobile.html).

Before this pass, home on mobile scored 92 / 88 / 100 / 91.

## Fixed in this pass

- **Contrast:** the `faint` text colour went from #6b7280 (4.1:1) to #828995 (≥5.0:1 on every surface), so all text now meets WCAG AA.
- **Valid markup:** the contact details list (`<dl>`) had invalid nesting.
- **SEO:**
  - per-page title, description, canonical, Open Graph and Twitter tags
  - JSON-LD `Person` record
  - `sitemap.xml` and `robots.txt`
  - a custom 1200×630 share image (`public/og.png`, source in `scripts/og/og.html`, regenerate with `npm run og`)

  All of it is generated from `src/content/site.ts`.

- **Prerendering:** both pages ship as real HTML (`scripts/prerender.mjs`) and hydrate on load, so content paints before JavaScript runs and crawlers see the text.
- **Hero timing:** the hero tagline is visible from the first frame and the hero entrance is tighter.
- **Bundle:** animation features now load asynchronously (−6 KB gzipped off the critical path). The rest of the shared bundle is React DOM, at about 63 KB gzipped.
- **Missing resume:** the build now warns when `public/resume.pdf` is missing.

## Links

- All internal anchors (`#about`, `#work`, `#process`, `#contact`, `#main`) resolve on both pages. `/work/` and every asset return 200.
- **Needs your input:** `/resume.pdf` is missing (it will 404 on Vercel). The four social links point at generic homepages, and the canonical and share URLs use `https://example.com` until you give me a domain.

## Contact form (tested with a mocked Formspree response; nothing sent)

- Empty submit: the browser blocks it (name, email and message are required).
- With no form ID: shows "The form isn't connected yet — please email … directly".
- Server error: shows Formspree's message plus your email as a fallback, and keeps what the visitor typed.
- Success: the "Message sent." panel replaces the form and the form resets.
- Request: POST `https://formspree.io/f/<id>` with `Accept: application/json`, fields `name`, `email`, `project_type`, `message`, plus the `_gotcha` honeypot.
- **A real submission is still untested.** It needs your form ID in `contact.formspreeId`.

## Console

Clean tabs on both pages, scrolled top to bottom: no errors and no warnings, in dev or in the production build, and no hydration mismatches.
