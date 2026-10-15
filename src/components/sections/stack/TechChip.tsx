import {
  siExpo,
  siFigma,
  siGit,
  siGithub,
  siJavascript,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
} from 'simple-icons'
import { forwardRef } from 'react'
import type { Tech, TechIconKey } from '../../../content/site'

const PATHS: Record<TechIconKey, string> = {
  react: siReact.path,
  nextjs: siNextdotjs.path,
  expo: siExpo.path,
  typescript: siTypescript.path,
  javascript: siJavascript.path,
  nodejs: siNodedotjs.path,
  postgresql: siPostgresql.path,
  mongodb: siMongodb.path,
  tailwind: siTailwindcss.path,
  figma: siFigma.path,
  git: siGit.path,
  github: siGithub.path,
  vercel: siVercel.path,
}

interface Props {
  tech: Tech
  className?: string
}

/** Pill with a brand glyph; shared by the physics pit and the static grid. */
export const TechChip = forwardRef<HTMLDivElement, Props>(function TechChip(
  { tech, className = '' },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-surface-2 pr-5 pl-4 font-mono text-sm whitespace-nowrap text-ink select-none ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[18px] shrink-0 text-accent"
        fill="currentColor"
        aria-hidden
      >
        <path d={PATHS[tech.icon]} />
      </svg>
      {tech.name}
    </div>
  )
})
