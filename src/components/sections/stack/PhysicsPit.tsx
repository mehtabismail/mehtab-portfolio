import Matter from 'matter-js'
import { MousePointer2, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Tech } from '../../../content/site'
import { TechChip } from './TechChip'

interface Props {
  items: Tech[]
  hint: string
}

const WALL = 400

/**
 * Tech logos as matter.js bodies. Physics runs headless; each body drives the
 * transform of a DOM chip, so text and icons stay crisp. Loaded lazily and only
 * on desktop with motion allowed.
 */
export default function PhysicsPit({ items, hint }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLDivElement | null)[]>([])
  const [touched, setTouched] = useState(false)
  const [round, setRound] = useState(0)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter

    const width = el.clientWidth
    const height = el.clientHeight
    const engine = Engine.create()
    engine.gravity.y = 1

    const walls = [
      Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
      Bodies.rectangle(-WALL / 2, 0, WALL, height * 4, { isStatic: true }),
      Bodies.rectangle(width + WALL / 2, 0, WALL, height * 4, { isStatic: true }),
    ]

    const sizes = chips.current.map((c) => ({ w: c?.offsetWidth ?? 120, h: c?.offsetHeight ?? 48 }))
    const bodies = items.map((_, i) => {
      const { w, h } = sizes[i]
      return Bodies.rectangle(w / 2 + Math.random() * Math.max(1, width - w), -h - i * 55, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.3,
        friction: 0.2,
        frictionAir: 0.015,
        angle: (Math.random() - 0.5) * 0.8,
      })
    })

    const mouse = Mouse.create(el)
    const h = mouse as unknown as Record<
      'mousemove' | 'mousedown' | 'mouseup' | 'mousewheel',
      EventListener
    >
    const listeners: [string, EventListener][] = [
      ['mousemove', h.mousemove],
      ['mousedown', h.mousedown],
      ['mouseup', h.mouseup],
      ['wheel', h.mousewheel],
      ['touchmove', h.mousemove],
      ['touchstart', h.mousedown],
      ['touchend', h.mouseup],
    ]
    // Keep wheel and touch for the page: scrolling over the pit must still scroll.
    listeners
      .filter(([type]) => type === 'wheel' || type.startsWith('touch'))
      .forEach(([type, fn]) => el.removeEventListener(type, fn))

    const drag = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1 },
    })
    Events.on(drag, 'startdrag', () => setTouched(true))
    // Release a body if the cursor leaves the pit mid-drag.
    const release = () => {
      mouse.button = -1
    }
    el.addEventListener('mouseleave', release)

    Composite.add(engine.world, [...walls, ...bodies, drag])

    let frame = 0
    let last = performance.now()
    let running = false
    const tick = (now: number) => {
      // matter.js is stable at steps of 16.7 ms or less; slow frames just run slower
      const delta = Math.min(now - last, 1000 / 60)
      last = now
      Engine.update(engine, delta)
      bodies.forEach((b, i) => {
        const chip = chips.current[i]
        if (!chip) return
        const { w, h } = sizes[i]
        chip.style.transform = `translate3d(${b.position.x - w / 2}px, ${b.position.y - h / 2}px, 0) rotate(${b.angle}rad)`
      })
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    // Only simulate while the pit is on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.15,
    })
    io.observe(el)

    return () => {
      stop()
      io.disconnect()
      el.removeEventListener('mouseleave', release)
      listeners.forEach(([type, fn]) => el.removeEventListener(type, fn))
      Events.off(drag, 'startdrag')
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [items, round])

  return (
    <div aria-hidden>
      <div
        ref={box}
        className="relative h-[520px] cursor-grab overflow-hidden border border-line-strong bg-surface/40 active:cursor-grabbing"
      >
        <div className="absolute inset-0 blueprint-grid opacity-70" />
        <span className="absolute top-4 right-5 label-mono text-faint">g = 9.81 m/s²</span>

        <div
          className={`pointer-events-none absolute top-4 left-5 flex items-center gap-2 label-mono text-accent transition-opacity duration-700 ${touched ? 'opacity-0' : 'opacity-100'}`}
        >
          <MousePointer2 className="size-3.5 animate-bounce" />
          {hint}
        </div>

        {items.map((tech, i) => (
          <TechChip
            key={`${round}-${tech.name}`}
            ref={(node) => {
              chips.current[i] = node
            }}
            tech={tech}
            className="pointer-events-none absolute top-0 left-0 will-change-transform"
          />
        ))}
      </div>

      {/* Controls sit below the box so they never cover a chip */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="label-mono text-faint">{items.length} tools · drag to rearrange</span>
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setTouched(false)
            setRound((r) => r + 1)
          }}
          className="flex items-center gap-2 border border-line-strong px-3 py-2 label-mono text-muted transition-colors hover:border-accent hover:text-ink"
        >
          <RotateCcw className="size-3.5" />
          Drop again
        </button>
      </div>
    </div>
  )
}
