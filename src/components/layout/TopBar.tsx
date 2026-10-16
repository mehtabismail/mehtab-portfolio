import { Copy, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { nav, site } from '../../content/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useCopyEmail } from '../../hooks/useCopyEmail'
import { getLenis, goHome, scrollToId } from '../../lib/scroll'
import { MobileMenu } from './MobileMenu'

export function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const copyEmail = useCopyEmail()
  const active = useActiveSection(nav.map((n) => n.target))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll and hide the rest of the page from assistive tech while the menu is open.
  useEffect(() => {
    const behind = [document.getElementById('main'), document.getElementById('site-footer')]
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      behind.forEach((el) => el?.setAttribute('inert', ''))
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
      behind.forEach((el) => el?.removeAttribute('inert'))
    }
  }, [open])

  // The menu is hidden from lg up; close it there (e.g. a rotated iPad) so the scroll lock lifts.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(width >= 64rem)')
    const onChange = () => mq.matches && setOpen(false)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [open])

  const go = useCallback((target: string) => {
    setOpen(false)
    // Wait a frame so the scroll lock is released before scrolling.
    requestAnimationFrame(() => scrollToId(target))
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    menuButton.current?.focus()
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? 'border-b border-line bg-bg/75 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={goHome}
            aria-label={`${site.name}, back to top`}
            className="group relative grid size-9 place-items-center border border-line-strong transition-colors hover:border-accent"
          >
            <span className="font-display text-[15px] font-bold tracking-tight">
              {site.initials}
            </span>
            <span className="absolute -right-[3px] -bottom-[3px] size-[5px] bg-accent transition-transform group-hover:scale-150" />
          </button>

          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email address ${site.email}`}
            className="group hidden items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-ink md:flex"
          >
            {site.email}
            <Copy className="size-3.5 text-faint transition-colors group-hover:text-accent" />
          </button>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item, i) => (
                <li key={item.target}>
                  <a
                    href={`/#${item.target}`}
                    aria-current={active === item.target ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.target)
                    }}
                    className="group relative flex items-baseline gap-1.5 py-2 label-mono text-muted transition-colors hover:text-ink aria-[current]:text-ink"
                  >
                    <span className="text-[10px] text-faint transition-colors group-hover:text-accent group-aria-[current]:text-accent">
                      0{i + 1}
                    </span>
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-aria-[current]:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center border border-line-strong text-ink transition-colors hover:border-accent lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} onNavigate={go} />
    </>
  )
}
