import { ArrowUpRight, CalendarDays } from 'lucide-react'
import type { MouseEvent } from 'react'
import { siWhatsapp } from 'simple-icons'
import { booking } from '../../content/site'
import { scrollToId } from '../../lib/scroll'

const styles = {
  primary:
    'bg-accent text-accent-ink hover:shadow-[0_0_0_4px_var(--color-accent-dim),0_12px_40px_-8px_var(--color-accent)]',
  ghost: 'border border-line-strong text-ink hover:border-ink',
}

/** Cal.com's popup, with the site's dark theme and amber accent. */
async function openCal(calLink: string) {
  // Loaded on first click so Cal.com's script never slows the page down.
  const { getCalApi } = await import('@calcom/embed-react')
  const cal = await getCalApi({ namespace: 'intro' })
  cal('ui', {
    theme: 'dark',
    cssVarsPerTheme: { dark: { 'cal-brand': '#ffb224' }, light: { 'cal-brand': '#1a1204' } },
    layout: 'month_view',
  })
  cal('modal', { calLink, config: { layout: 'month_view', theme: 'dark' } })
}

/**
 * "Book a call": opens the Cal.com booking popup. Until booking.calLink is set
 * it scrolls to the contact form, so the button is never a dead end.
 */
export function BookCallButton({ variant = 'primary' }: { variant?: 'primary' | 'ghost' }) {
  const { calLink, label } = booking

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!calLink) return scrollToId('contact')
    // If the script can't load (offline, blocked), fall back to the booking page.
    openCal(calLink).catch(() => window.open(`https://cal.com/${calLink}`, '_blank', 'noopener'))
  }

  return (
    <a
      href={calLink ? `https://cal.com/${calLink}` : '/#contact'}
      onClick={onClick}
      className={`group inline-flex h-12 items-center gap-3 px-6 text-sm font-medium transition-[box-shadow,border-color,background-color] duration-300 ${styles[variant]}`}
    >
      <CalendarDays className="size-4" aria-hidden />
      {label}
    </a>
  )
}

/** Small "Chat on WhatsApp" link; renders nothing until booking.whatsapp is set. */
export function WhatsAppLink({ className = '' }: { className?: string }) {
  if (!booking.whatsapp) return null
  const href = `https://wa.me/${booking.whatsapp}?text=${encodeURIComponent(booking.whatsappMessage)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 label-mono text-muted transition-colors hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4 text-accent">
        <path d={siWhatsapp.path} />
      </svg>
      Chat on WhatsApp
      <ArrowUpRight
        className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </a>
  )
}
