import { useEffect, useState } from 'react'

/**
 * Scroll-spy: returns the id of the last listed section whose top has passed
 * 40% of the viewport. Sections in between (e.g. Experience) keep the previous
 * nav item active.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const targets = key.split('|')
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      let current: string | null = null
      for (const id of targets) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [key])

  return active
}
