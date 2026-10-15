import { useMotionValue, useSpring, type MotionValue } from 'motion/react'
import { useEffect } from 'react'

interface Pointer {
  /** -1 (left) … 1 (right), spring-smoothed */
  x: MotionValue<number>
  /** -1 (top) … 1 (bottom), spring-smoothed */
  y: MotionValue<number>
}

/**
 * Normalised, smoothed pointer position across the viewport. Stays at 0 on
 * touch devices and when disabled (reduced motion).
 */
export function usePointer(enabled: boolean, stiffness = 60): Pointer {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness, damping: 20, mass: 0.6 })
  const y = useSpring(rawY, { stiffness, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!enabled || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, rawX, rawY])

  return { x, y }
}
