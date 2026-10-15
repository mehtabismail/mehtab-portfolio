import Lenis from 'lenis'
import { useEffect } from 'react'
import { setLenis } from '../lib/scroll'

/** Lenis smooth scrolling, skipped entirely when the user prefers reduced motion. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    setLenis(lenis)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])
}
