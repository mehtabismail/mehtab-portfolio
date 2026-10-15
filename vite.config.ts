import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { siteMeta } from './plugins/siteMeta.ts'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // The SSR build only produces the prerender helper (src/entry-server.tsx).
  plugins: isSsrBuild ? [react()] : [react(), tailwindcss(), siteMeta()],
  build: isSsrBuild
    ? {}
    : {
        rolldownOptions: {
          // Two static pages: the one-pager and /work
          input: {
            main: resolve(import.meta.dirname, 'index.html'),
            work: resolve(import.meta.dirname, 'work/index.html'),
          },
        },
      },
}))
