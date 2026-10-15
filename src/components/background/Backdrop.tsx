import { m, useReducedMotion, useTransform } from 'motion/react'
import { usePointer } from '../../hooks/usePointer'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fixed page backdrop: blueprint grid, drifting glow blobs, grain. */
export function Backdrop() {
  const reduce = useReducedMotion() ?? false
  const { x, y } = usePointer(!reduce, 30)

  // Blobs lean gently toward the cursor (opposite directions for depth).
  const ax = useTransform(x, (v) => v * 60)
  const ay = useTransform(y, (v) => v * 40)
  const bx = useTransform(x, (v) => v * -45)
  const by = useTransform(y, (v) => v * -30)

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 blueprint-grid"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 35%, black 30%, transparent 100%)',
        }}
      />

      <m.div className="absolute -top-[18vh] right-[-12vw]" style={{ x: ax, y: ay }}>
        <div
          className="h-[60vh] w-[60vh] animate-drift-a rounded-full opacity-[0.22] blur-[90px]"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
        />
      </m.div>
      <m.div className="absolute bottom-[-25vh] left-[-15vw]" style={{ x: bx, y: by }}>
        <div
          className="h-[70vh] w-[70vh] animate-drift-b rounded-full opacity-40 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, var(--color-slate-glow) 0%, transparent 70%)',
          }}
        />
      </m.div>

      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
      />
    </div>
  )
}
