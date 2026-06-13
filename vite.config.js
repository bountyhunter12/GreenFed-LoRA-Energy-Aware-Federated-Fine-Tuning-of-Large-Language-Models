import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from a subpath, so all built asset URLs
// (e.g. /assets/index-abc.js) must be prefixed with the repo name.
// When developing locally, Vite still serves from "/" — the base only
// affects the production build.
const repoName =
  'GreenFed-LoRA-Energy-Aware-Federated-Fine-Tuning-of-Large-Language-Models';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  server: {
    host: true,
    port: 5173,
  },
});
