// Build-time renderer: scripts/prerender.mjs calls render() to put each page's
// HTML into dist/, so content paints before any JavaScript runs.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { AppShell, type Page } from './AppShell'
import { WorkPage } from './pages/WorkPage'

export function render(page: Page) {
  return renderToString(
    <StrictMode>
      {page === 'home' ? (
        <App />
      ) : (
        <AppShell page="work">
          <WorkPage />
        </AppShell>
      )}
    </StrictMode>,
  )
}
