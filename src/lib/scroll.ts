import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

/**
 * Smoothly scroll to a section by id. If the section isn't on this page
 * (e.g. clicking "Contact" on /work), navigate to the home page section.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) {
    window.location.assign(`/#${id}`)
    return
  }
  if (lenis) {
    lenis.scrollTo(el, { offset: -64, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Scroll the current page back to the top. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0 })
}

/** Logo behaviour: go to the home page, or to its top if already there. */
export function goHome() {
  if (window.location.pathname !== '/') window.location.assign('/')
  else scrollToTop()
}
