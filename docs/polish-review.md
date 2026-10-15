# Checkpoint 4: polish review

Date: 2026-10-15. Compared at 1440px against redoyanulhaque.me for quality of feel, not sameness.

## Side-by-side

| Area             | Reference                                                                                    | Mine now                                                                                                                                   | Verdict                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| First impression | Light "LOADING 0%" splash, then a dark hero with a large purple orb and a gradient role line | No splash; the hero is usable at once. The name rises letter by letter, the system diagram draws itself, and data packets flow             | Mine is faster to content. The reference has more drama in its first second |
| Ambient depth    | Two bold blurred orbs plus a glowing cursor dot                                              | Amber and slate glows that follow the cursor, a blueprint grid and grain. The amber glow was raised from 0.16 to 0.22 opacity in this pass | Comparable. Mine is calmer and on-brand                                     |
| Section rhythm   | Big headings, about one viewport per section                                                 | Numbered §-headings, plus blueprint dividers between sections added in this pass                                                           | Mine reads more like a document. That fits the "architect" positioning      |
| Services         | Dashed card with corner brackets that expands                                                | Spec-sheet cards with a cursor spotlight on the border, a dimension line and a title block                                                 | Different treatment, similar quality                                        |
| Timeline         | Centred dot, three columns                                                                   | Revision log: the rail fills as you scroll and markers light up                                                                            | On par. Weakened until the placeholder entries are real                     |
| Work             | Pinned horizontal scroll, image-led                                                          | Vertical case studies (problem → outcome) with architecture diagrams                                                                       | Mine says more. The reference _looks_ richer because it has real images     |
| Tech stack       | Glass-tile pyramid over video                                                                | matter.js physics pit (desktop), static grid elsewhere                                                                                     | Mine is more playful and much lighter (lazy-loaded, no video)               |
| Mobile           | Content stays blank until reveals fire, nav overlaps, no menu                                | Hamburger menu, swipe carousel, static fallbacks, no overflow at 375                                                                       | Clearly better                                                              |
| Reduced motion   | No visible support                                                                           | Every animated part has a static version                                                                                                   | Clearly better                                                              |

## Done in this pass

- **Reduced motion:** audited every component, and made the remaining height animations instant under it. Added a dev-only `?reduce-motion` URL switch for testing.
- **Responsive audit at 375/768/1024/1440 on both pages:** no horizontal overflow, no clipped text, no overlap with the fixed rails, and no tap targets under 24px.
- **Section dividers:** blueprint connectors between sections. The motif in dividers was part of the brief and was missing.
- **Scroll-spy:** the top nav now highlights the current section (`aria-current`).
- **Hero name:** a per-letter reveal, with an `sr-only` copy so screen readers hear one clean heading.
- **Role line:** in reduced-motion mode each role stays on one line.

## Recommended next (your call)

1. **Real project images** are the biggest single upgrade. One WebP screenshot per project (1600×1000) turns the covers into image-led showcases, with the diagram moving to the "Detail A" inset.
2. **Real timeline entries:** three of the four are placeholders.
3. **Optional crosshair cursor:** a thin blueprint crosshair that follows the mouse on desktop, matching the motif. I'd keep it subtle, or skip it if you prefer the native cursor.
4. **Bundle size:** the shared JS is about 127 KB gzipped. I'll trim it in checkpoint 5 (QA), together with the Lighthouse pass.
