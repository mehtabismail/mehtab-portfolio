import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { Backdrop } from './components/background/Backdrop'
import { Footer } from './components/layout/Footer'
import { SideRails } from './components/layout/SideRails'
import { TopBar } from './components/layout/TopBar'
import { ToastProvider } from './components/ui/Toast'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const loadFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default)

export type Page = 'home' | 'work' | 'notfound'

/** Chrome shared by every page: backdrop, fixed UI, smooth scroll, toasts. */
export function AppShell({ page, children }: { page: Page; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false
  useSmoothScroll(!reduce)

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <a
            href="#main"
            className="sr-only z-[70] bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Backdrop />
          <TopBar />
          <SideRails />
          <main id="main">{children}</main>
          <Footer showContactCta={page !== 'home'} />
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
