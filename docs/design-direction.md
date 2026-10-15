# Reference analysis & design direction

Reference: redoyanulhaque.me, studied on 2026-10-15 at desktop (1175–1440px) and mobile (375px) widths.
It is used for inspiration only. No code, copy, assets, colours or layouts are reused.

## What makes it feel premium

1. **Restraint.** It uses a near-black background (`#0B080C`), one accent (lavender), one typeface (Geist) and a lot of empty space. Each section gets about one viewport of air.
2. **Motion everywhere, but slow.** Lenis smooth scroll, character and word split-text reveals, two large fixed blurred circles (`blur(50–60px)`) at the viewport edges, and a glowing cursor follower.
3. **Pinned set pieces.** GSAP ScrollTrigger (it uses `pin-spacer`) pins the Work section and scrolls the project columns horizontally. Tech Stack is a "pyramid" of glass tiles over a looping video.
4. **Framed cards.** The "What I do" cards use a dashed border with solid corner brackets, and expand to show tag chips.
5. **Persistent chrome.** Fixed top bar (initials, email, nav), vertical social rail on the left, and a "Resume" link in the bottom-right corner.

## Weak spots I'll avoid

- **Mobile reveals:** content stays invisible until a scroll trigger fires, so large blank areas appear when you jump down the page.
- **Mobile chrome:** the nav links stack on top of the content, there's no hamburger, and the rotated "Resume" link overlaps the cards.
- **Desktop overlap:** the left social rail sits on top of the work cards.
- **Contrast:** some subtitles are very low contrast and would fail AA.
- **Weight:** a background video and a big single JS bundle.

## How I'll adapt each idea (my own identity)

| Reference idea                          | My version                                                                                                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lavender accent, Geist                  | **Drafting Amber** accent + **Bricolage Grotesque** display / Inter body / JetBrains Mono for annotations                                                                                                                         |
| Two fixed blurred circles               | Amber and cool-slate glow blobs that drift slowly and lean toward the cursor; plus a grain overlay                                                                                                                                |
| Name left, gradient rotating role right | Name stacked left; role cycles in mono with a caret, like a terminal readout; **self-drawing system diagram** (Client → API → DB → Queue) on the right whose nodes follow the cursor                                              |
| Dashed card + corner brackets           | **"Spec sheet" cards**: hairline border, a cursor-tracked amber spotlight on the border, a **dimension line** along the top edge (`⟵ 01 ⟶`) that extends on hover, and a drawing "title block" footer (`SHEET 01/03 · SCALE 1:1`) |
| Centred timeline with dot               | **Revision history**: left rail styled like a drawing revision table (`REV 05 · 2026`), the rail fills with amber as you scroll, and entries reveal in sequence                                                                   |
| Pinned horizontal project columns       | **Vertical case-study sheets**: sticky project index number on the left, Problem → Role → Architecture → Stack → Outcome on the right, with a blueprint thumbnail of the architecture                                             |
| Glass-tile pyramid over video           | **matter.js physics pit**: logo bodies fall and can be thrown, lazy-loaded, with a static grid fallback                                                                                                                           |
| (none)                                  | **Process** section: 4 steps drawn as a connected blueprint flow                                                                                                                                                                  |

## Tokens (draft)

- Background `#0A0B0D`, surface `#111317`, hairline `rgba(148,163,184,0.12)`
- Text `#EDEEF0`, muted `#9AA1AC` (≈7.4:1 on the background)
- Accent `#FFB224` (≈11:1 on the background, AA at every size); accent-dim `rgba(255,178,36,0.14)`
- Blueprint lines `rgba(148,163,184,0.06)` on a 32px grid, with a 160px major grid

## Tech decisions

- **Framer Motion over GSAP.** It's declarative in React, `pathLength` drives the self-drawing SVG diagram, `useScroll` drives the timeline fill, and `MotionConfig reducedMotion="user"` turns motion off globally. No pinned horizontal scroll is planned, so ScrollTrigger isn't needed.
- **matter.js over react-three-fiber.** It's about 25 KB gzipped against roughly 150 KB+ for three.js and r3f, it's 2D, and dragging and throwing come built in. It's code-split and only loads when the section is near the viewport on desktop with motion allowed.
