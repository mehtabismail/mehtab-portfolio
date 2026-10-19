import { shotSize, type Shot } from '../../content/caseStudies'

function Screen({ shot, n, title }: { shot: Shot; n: number; title: string }) {
  const { w, h, kind } = shotSize(shot.name)
  const src = `/work/shots/${shot.name}`
  const phone = kind === 'mobile'

  return (
    <figure
      className={
        phone
          ? 'w-[min(68vw,260px)] shrink-0 snap-start sm:w-auto sm:max-w-[260px] sm:min-w-0 sm:flex-1'
          : ''
      }
    >
      <div
        className={`overflow-hidden border border-line-strong bg-surface ${phone ? 'rounded-[28px] p-1.5' : 'p-0'}`}
      >
        {!phone && (
          // browser chrome, drawn as three dots and an address bar
          <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="ml-3 h-4 flex-1 rounded-sm bg-surface-2" />
          </div>
        )}
        <picture>
          <source type="image/avif" srcSet={`${src}.avif`} />
          <img
            src={`${src}.jpg`}
            alt={`${title}: ${shot.caption}`}
            width={w}
            height={h}
            loading="lazy"
            decoding="async"
            className={`block h-auto w-full ${phone ? 'rounded-[22px]' : ''}`}
          />
        </picture>
      </div>
      <figcaption className="mt-3 flex gap-2 text-sm leading-snug text-muted">
        <span className="shrink-0 pt-0.5 label-mono text-accent">Fig.{n}</span>
        {shot.caption}
      </figcaption>
    </figure>
  )
}

/** Screens from the project: web pages stacked, phone screens in a swipeable row. */
export function Gallery({ shots, title }: { shots: Shot[]; title: string }) {
  const web = shots.filter((s) => shotSize(s.name).kind === 'web')
  const phone = shots.filter((s) => shotSize(s.name).kind === 'mobile')

  return (
    <div className="space-y-10">
      {web.length > 0 && (
        <div className="grid gap-8">
          {web.map((s) => (
            <Screen key={s.name} shot={s} n={shots.indexOf(s) + 1} title={title} />
          ))}
        </div>
      )}
      {phone.length > 0 && (
        // Scrolls sideways on phones; from sm up the screens share one row.
        <div
          data-lenis-prevent-horizontal
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0"
        >
          {phone.map((s) => (
            <Screen key={s.name} shot={s} n={shots.indexOf(s) + 1} title={title} />
          ))}
        </div>
      )}
    </div>
  )
}
