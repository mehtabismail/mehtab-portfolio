import {
  siCaddy,
  siExpo,
  siFastlane,
  siFirebase,
  siGit,
  siGithub,
  siGithubactions,
  siJavascript,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRedux,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWebrtc,
} from 'simple-icons'
import { forwardRef } from 'react'
import type { Tech, TechIconKey } from '../../../content/site'

const PATHS: Record<TechIconKey, string> = {
  react: siReact.path,
  nextjs: siNextdotjs.path,
  expo: siExpo.path,
  typescript: siTypescript.path,
  javascript: siJavascript.path,
  redux: siRedux.path,
  tailwind: siTailwindcss.path,
  nodejs: siNodedotjs.path,
  nestjs: siNestjs.path,
  postgresql: siPostgresql.path,
  mongodb: siMongodb.path,
  firebase: siFirebase.path,
  socketio: siSocketdotio.path,
  webrtc: siWebrtc.path,
  nginx: siNginx.path,
  caddy: siCaddy.path,
  git: siGit.path,
  github: siGithub.path,
  githubactions: siGithubactions.path,
  fastlane: siFastlane.path,
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
