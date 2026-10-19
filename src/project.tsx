import './lib/devReducedMotion'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { AppShell } from './AppShell'
import { projectFromPath } from './lib/project'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectPage } from './pages/ProjectPage'

const root = document.getElementById('root')!
// Every /work/<slug>/ page is the same bundle; the URL picks the project.
const project = projectFromPath(window.location.pathname)
const app = (
  <StrictMode>
    <AppShell page={project ? 'project' : 'notfound'}>
      {project ? <ProjectPage project={project} /> : <NotFoundPage />}
    </AppShell>
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs); dev starts empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
