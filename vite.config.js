import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH is set by the GitHub Pages workflow (e.g. /knitbug2/); local dev stays at /.
const base = process.env.BASE_PATH ?? '/'

// Content JSON stores root-absolute image paths ("/content-images/...") so the
// admin tool can keep editing it as-is; prefix them with the base at build time.
function prefixContentImages() {
  return {
    name: 'prefix-content-images',
    transform(code, id) {
      if (base === '/' || !id.includes('/src/content/data/') || !id.endsWith('.json')) return null
      return code.replaceAll('"/content-images/', `"${base}content-images/`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [prefixContentImages(), react()],
})
