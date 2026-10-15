import './lib/devReducedMotion'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { AppShell } from './AppShell'
import { WorkPage } from './pages/WorkPage'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <AppShell page="work">
      <WorkPage />
    </AppShell>
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs); dev starts empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
