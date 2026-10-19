// Build-time renderer: scripts/prerender.mjs calls render() to put each page's
// HTML into dist/, so content paints before any JavaScript runs.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { AppShell, type Page } from './AppShell'
import { projects } from './content/site'
import { projectHead } from './lib/seo'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectPage } from './pages/ProjectPage'
import { WorkPage } from './pages/WorkPage'

export function render(page: Exclude<Page, 'project'>) {
  return renderToString(
    <StrictMode>
      {page === 'home' ? (
        <App />
      ) : (
        <AppShell page={page}>{page === 'work' ? <WorkPage /> : <NotFoundPage />}</AppShell>
      )}
    </StrictMode>,
  )
}

/** Every case study: its slug, prerendered body and <head> tags. */
export const caseStudyPages = () =>
  projects.map((project) => ({
    slug: project.slug,
    head: projectHead(project),
    html: renderToString(
      <StrictMode>
        <AppShell page="project">
          <ProjectPage project={project} />
        </AppShell>
      </StrictMode>,
    ),
  }))
