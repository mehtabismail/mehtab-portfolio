import { m, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Copy } from 'lucide-react'
import { contact, hero, site, socials } from '../../../content/site'
import { useCopyEmail } from '../../../hooks/useCopyEmail'
import { Reveal } from '../../ui/Reveal'
import { ContactForm } from './ContactForm'

const ease = [0.16, 1, 0.3, 1] as const

export function Contact() {
  const reduce = useReducedMotion()
  const copyEmail = useCopyEmail()
  const words = contact.heading.split(' ')
  const last = words.pop()

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <div aria-hidden className="flex items-center gap-3 label-mono text-faint">
          <span className="text-accent">§06</span>
          <span>Contact</span>
          <span className="h-px flex-1 bg-[var(--color-line-strong)]" />
        </div>

        <h2
          id="contact-title"
          className="mt-8 font-display text-[clamp(3.5rem,12vw,10.5rem)] leading-[0.86] font-semibold tracking-[var(--tracking-display)]"
        >
          {[words.join(' '), last].map((line, i) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.16em]">
              <m.span
                className={`block ${i === 1 ? 'text-accent' : ''}`}
                initial={reduce ? false : { y: '105%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease, delay: i * 0.1 }}
              >
                {line}
                {i === 1 && <span className="text-ink">.</span>}
              </m.span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-xl leading-relaxed text-muted">{contact.intro}</p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 border-y border-line">
              <div className="col-span-2 border-b border-line py-5">
                <dt className="label-mono text-faint">Email</dt>
                <dd className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display text-2xl font-medium tracking-[-0.02em] break-all text-ink transition-colors hover:text-accent sm:text-3xl"
                  >
                    {site.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="grid size-9 place-items-center border border-line-strong text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Copy className="size-4" aria-hidden />
                  </button>
                </dd>
              </div>
              <div className="border-b border-line py-5">
                <dt className="label-mono text-faint">Location</dt>
                <dd className="mt-2 text-ink">{site.location}</dd>
              </div>
              <div className="border-b border-line py-5">
                <dt className="label-mono text-faint">Status</dt>
                <dd className="mt-2 flex items-start gap-2 text-ink">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  {hero.availability}
                </dd>
              </div>
              <div className="col-span-2 py-5">
                <dt className="label-mono text-faint">Elsewhere</dt>
                <dd className="mt-3">
                  <ul className="grid grid-cols-2 gap-x-6">
                    {socials.map((s) => (
                      <li key={s.key}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between border-b border-line py-3 text-ink transition-colors hover:border-accent hover:text-accent"
                        >
                          {s.label}
                          <ArrowUpRight
                            className="size-4 text-faint transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                            aria-hidden
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
