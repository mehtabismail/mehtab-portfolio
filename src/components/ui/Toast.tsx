import { AnimatePresence, m } from 'motion/react'
import { Check } from 'lucide-react'
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type ShowToast = (message: string) => void

const ToastContext = createContext<ShowToast>(() => {})

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback<ShowToast>((msg) => {
    window.clearTimeout(timer.current)
    setMessage(msg)
    timer.current = window.setTimeout(() => setMessage(null), 2400)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        <AnimatePresence>
          {message && (
            <m.div
              key={message}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 rounded-full border border-line-strong bg-surface-2/90 px-4 py-2 text-sm text-ink shadow-2xl shadow-black/50 backdrop-blur"
            >
              <span className="grid size-5 place-items-center rounded-full bg-accent text-accent-ink">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {message}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
