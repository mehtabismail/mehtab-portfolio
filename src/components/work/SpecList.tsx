import type { Project } from '../../content/site'

interface Props {
  project: Project
}

const rows: { key: 'problem' | 'role' | 'architecture'; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'role', label: 'My role' },
  { key: 'architecture', label: 'Architecture' },
]

/** Problem → Role → Architecture → Stack → Outcome, as a spec table. */
export function SpecList({ project }: Props) {
  const row = 'grid gap-2 border-t border-line py-4 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-6'
  const dt = 'label-mono pt-1 text-faint'

  return (
    <dl>
      {rows
        .filter(({ key }) => project[key])
        .map(({ key, label }) => (
          <div key={key} className={row}>
            <dt className={dt}>{label}</dt>
            <dd className="leading-relaxed text-muted">{project[key]}</dd>
          </div>
        ))}
      <div className={project.outcome ? row : `${row} border-b`}>
        <dt className={dt}>Stack</dt>
        <dd>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="border border-line-strong px-2.5 py-1 font-mono text-xs">
                {s}
              </li>
            ))}
          </ul>
        </dd>
      </div>
      {project.outcome && (
        <div className={`${row} border-b`}>
          <dt className={dt}>Outcome</dt>
          <dd className="border-l-2 border-accent pl-4 leading-relaxed text-ink">
            {project.outcome}
          </dd>
        </div>
      )}
    </dl>
  )
}
