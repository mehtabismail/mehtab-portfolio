import { AnimatePresence, m } from 'motion/react'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { contact, site } from '../../../content/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface FormspreeError {
  errors?: { message: string }[]
}

const fieldClass =
  'peer w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-ink placeholder:text-faint transition-colors focus:border-accent focus:ring-0 focus:outline-none'

function Field({
  index,
  label,
  htmlFor,
  children,
}: {
  index: string
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="group">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 label-mono text-faint transition-colors group-focus-within:text-accent"
      >
        <span aria-hidden>{index}</span>
        <span className="text-muted group-focus-within:text-ink">{label}</span>
      </label>
      {children}
    </div>
  )
}

/** Contact form posting to Formspree, with a honeypot and inline status. */
export function ContactForm() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const configured = contact.formspreeId.trim().length > 0

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!configured) {
      setStatus('error')
      setError(`The form isn’t connected yet — please email ${site.email} directly.`)
      return
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(`https://formspree.io/f/${contact.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      })
      if (res.ok) {
        setStatus('sent')
        form.current?.reset()
        return
      }
      const data = (await res.json().catch(() => ({}))) as FormspreeError
      throw new Error(data.errors?.map((x) => x.message).join(' ') || 'Something went wrong.')
    } catch (err) {
      setStatus('error')
      setError(
        `${err instanceof Error ? err.message : 'Something went wrong.'} You can also email ${site.email}.`,
      )
    }
  }

  return (
    <div className="relative border border-line-strong bg-surface/60 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-6 py-3 label-mono text-faint sm:px-8">
        <span>Project enquiry</span>
        <span className="text-accent">Form 01</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <m.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5 px-6 py-12 sm:px-8"
          >
            <span className="grid size-12 place-items-center bg-accent text-accent-ink">
              <Check className="size-6" strokeWidth={2.5} aria-hidden />
            </span>
            <p className="font-display text-4xl font-semibold tracking-[-0.03em]">
              {contact.successTitle}
            </p>
            <p className="max-w-sm text-muted">{contact.successBody}</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="label-mono text-ink underline decoration-accent underline-offset-4 hover:text-accent"
            >
              Send another
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={form}
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10"
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <Field index="01" label="Name" htmlFor={`${id}-name`}>
                <input
                  id={`${id}-name`}
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </Field>
              <Field index="02" label="Email" htmlFor={`${id}-email`}>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="flex items-baseline gap-2 label-mono text-faint">
                <span aria-hidden>03</span>
                <span className="text-muted">What do you need?</span>
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {contact.projectTypes.map((type, i) => (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      name="project_type"
                      value={type}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="inline-block border border-line-strong px-3.5 py-2 font-mono text-xs text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink hover:text-ink">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field index="04" label="Message" htmlFor={`${id}-message`}>
              <textarea
                id={`${id}-message`}
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder="What are you building, and where are you stuck?"
                className={`${fieldClass} resize-y`}
              />
            </Field>

            {/* Honeypot: hidden from people, filled in by bots; Formspree drops those. */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            {error && (
              <p
                id={`${id}-error`}
                role="alert"
                className="border-l-2 border-accent pl-4 text-sm text-ink"
              >
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="label-mono text-faint">Replies go to the email you enter.</p>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex h-12 items-center gap-3 bg-accent px-6 text-sm font-medium text-accent-ink transition-shadow hover:shadow-[0_0_0_4px_var(--color-accent-dim),0_12px_40px_-8px_var(--color-accent)] disabled:cursor-wait disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                {status === 'sending' ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
